"use client";

import { Table, Spin, Alert, Typography, Tag, Badge } from "antd";
import { CheckCircle, Hourglass } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminController } from "@/services/controller";
import { useAuthRedirect } from "@/components/hooks/use-auth-redirect";

type THBSignProps = {
  className?: string;
};

const THBSign = ({ className = "" }: THBSignProps) => (
  <span className={`text-lg font-medium mb-3 ${className}`}>฿</span>
);

const { Title } = Typography;

interface JobReferral {
  referred_job_payout: boolean; // Boolean indicating if paid
  referrer: string;
  payout_value: number;
}

interface TutorReferral {
  referred_tutor_payout: boolean; // Boolean indicating if paid
  referrer: string;
  payout_value: number;
}

interface PendingPayout {
  job_id: string;
  tutor_id: string;
  job_referral: JobReferral | null;
  tutor_referral: TutorReferral | null;
  referralFee: number;
}

interface ApiResponse {
  message: string;
  data: PendingPayout[];
}

export default function PendingPayoutsPage() {
  useAuthRedirect();
  const {
    data: payouts,
    refetch,
    isFetching: loading,
  } = useQuery({
    queryKey: ["getAllPayout"],
    queryFn: async () => {
      const resp = await adminController.GetPayouts();

      return resp.filter(
        (item) => item && (item.job_referral || item.tutor_referral)
      );
    },
    initialData: [],
  });

  const columns = [
    {
      title: "Job ID",
      dataIndex: "job_id",
      key: "job_id",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Tutor ID",
      dataIndex: "tutor_id",
      key: "tutor_id",
    },
    {
      title: "ค่าแนะนำของงาน",
      dataIndex: "referralFee",
      key: "referralFee",
      render: (fee: number) => (
        <div className="flex items-center gap-1">
          <span className="font-medium">{fee.toFixed(2)}</span>{" "}
          <THBSign className="h-4 w-4 text-green-500" />
        </div>
      ),
    },
    {
      title: "Job Referral",
      dataIndex: "job_referral",
      key: "job_referral",
      render: (referral: JobReferral | null) =>
        referral ? (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="font-medium">
                {referral.payout_value.toFixed(2)}
              </span>
              <THBSign className="h-4 w-4 text-green-500" />

              {referral.referred_job_payout ? (
                <Badge status="success" text="Paid" />
              ) : (
                <Badge status="processing" text="Pending" />
              )}
            </div>
            <Tag color="blue">Referrer: {referral.referrer}</Tag>
          </div>
        ) : (
          <span className="text-gray-400">No referral</span>
        ),
    },
    {
      title: "Tutor Referral",
      dataIndex: "tutor_referral",
      key: "tutor_referral",
      render: (referral: TutorReferral | null) =>
        referral ? (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="font-medium">
                {referral.payout_value.toFixed(2)}
              </span>
              <THBSign className="h-4 w-4 text-green-500" />

              {referral.referred_tutor_payout ? (
                <Badge status="success" text="Paid" />
              ) : (
                <Badge status="processing" text="Pending" />
              )}
            </div>
            <Tag color="purple">Referrer: {referral.referrer}</Tag>
          </div>
        ) : (
          <span className="text-gray-400">No referral</span>
        ),
    },
    {
      title: "Payment Status",
      key: "payment_status",
      render: (_, record: PendingPayout) => {
        const jobPaid = record.job_referral?.referred_job_payout || false;
        const tutorPaid = record.tutor_referral?.referred_tutor_payout || false;

        if (!record.job_referral && !record.tutor_referral) {
          return <span className="text-gray-400">No referrals</span>;
        }

        if (
          (record.job_referral && !jobPaid) ||
          (record.tutor_referral && !tutorPaid)
        ) {
          return (
            <div className="flex items-center gap-1 text-amber-500">
              <Badge status="processing" text="Pending" />
            </div>
          );
        }

        return (
          <div className="flex items-center gap-1 text-green-500">
            <Badge status="success" text="Paid" />
          </div>
        );
      },
    },
    {
      title: "Total Payout",
      key: "total_payout",
      render: (_, record: PendingPayout) => {
        const jobPayoutValue = record.job_referral?.payout_value || 0;
        const tutorPayoutValue = record.tutor_referral?.payout_value || 0;
        const total = jobPayoutValue + tutorPayoutValue;

        return (
          <div className="flex items-center gap-1">
            <span className="font-bold">{total.toFixed(2)}</span>
            <THBSign className="h-4 w-4 text-green-600" />
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Pending Payouts</Title>
        <p className="text-gray-500">
          View all payouts for completed jobs with referrals
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Loading payouts..." />
        </div>
      ) : (
        <Table
          dataSource={payouts}
          columns={columns}
          rowKey="job_id"
          pagination={{ pageSize: 10 }}
          summary={(pageData) => {
            const totalReferralFee = pageData.reduce(
              (total, payout) => total + payout.referralFee,
              0
            );

            const totalJobPayoutValue = pageData.reduce(
              (total, payout) =>
                total + (payout.job_referral?.payout_value || 0),
              0
            );

            const totalTutorPayoutValue = pageData.reduce(
              (total, payout) =>
                total + (payout.tutor_referral?.payout_value || 0),
              0
            );

            const grandTotal = totalJobPayoutValue + totalTutorPayoutValue;

            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <strong>Total</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <div className="flex items-center gap-1">
                      <strong>{totalReferralFee.toFixed(2)}</strong>
                      <THBSign className="h-4 w-4 text-blue-600" />
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <div className="flex items-center gap-1">
                      <strong>{totalJobPayoutValue.toFixed(2)}</strong>
                      <THBSign className="h-4 w-4 text-green-600" />
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <div className="flex items-center gap-1">
                      <strong>{totalTutorPayoutValue.toFixed(2)}</strong>
                      <THBSign className="h-4 w-4 text-green-600" />
                    </div>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}></Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <div className="flex items-center gap-1">
                      <strong>{grandTotal.toFixed(2)}</strong>
                      <THBSign className="h-4 w-4 text-green-600" />
                    </div>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      )}
    </div>
  );
}

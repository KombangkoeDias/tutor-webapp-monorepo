"use client";
import React, { useState } from "react";
import {
  Divider,
  Image,
  Input,
  Popconfirm,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import { Input as InputShadCN } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { adminController } from "@/services/controller";
import { useAuthRedirect } from "@/components/hooks/use-auth-redirect";
import {
  mapReservationStatusToColor,
  ReservationStatus,
  useTableStyle,
  variantButtonClassName,
} from "@/chulatutordream/lib/constants";
import { getLatestComment } from "@/components/hooks/login-context";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import { ExportOutlined } from "@ant-design/icons";
import JobDrawer from "./job-drawer";
import { useSharedConstants } from "@/components/hooks/constant-context";
import { Label } from "@/components/ui/label";
import FormItem from "antd/es/form/FormItem";
import toast from "react-hot-toast";

type ReservationData = {
  id: number;
  tutor: {
    title: string;
    name: string;
    surname: string;
    nickname: string;
  };
  job: {
    id: number;
  };
  status: string;
  updated_at_ms: string;
  created_at_ms: string;
  referral_fee: number;
  payment_status: string;
  job_summary: string;
  refunded_amount: number;
  refunded_receipt: string;
};

export default function TutorReviewListPage() {
  useAuthRedirect();
  const [jobId, setJobId] = useState<number>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { styles } = useTableStyle();
  const { subjects } = useSharedConstants();
  const {
    data: reservations,
    isFetching: isFetchingReservations,
    refetch,
  } = useQuery({
    queryKey: ["getAllReservations"],
    queryFn: async () => {
      const resp = await adminController.GetAllReservations([
        ReservationStatus.COMPLETED,
        ReservationStatus.PENDING_REFUND,
        ReservationStatus.REFUNDED,
      ]);
      return resp.reservations;
    },
    initialData: [],
  });

  const columns: TableColumnsType<ReservationData> = [
    {
      title: "ชื่อ-นามสกุล",
      width: 200,
      fixed: "left",
      render: (_, record) => {
        return `${record.tutor.title} ${record.tutor.name} ${record.tutor.surname}`;
      },
    },
    {
      title: "ชื่อเล่น",
      render: (_, record) => {
        return record.tutor.nickname;
      },
    },
    {
      title: "งาน",
      render: (_, record) => {
        return (
          <div className="flex items-center">
            รหัสงาน ${record.job_summary}{" "}
            <ExportOutlined
              onClick={() => {
                setJobId(record.job.id);
                setOpenDrawer(true);
              }}
            />
          </div>
        );
      },
      width: 150,
    },
    {
      title: "สถานะการจอง",
      render: (_, record) => {
        return (
          <Tag
            color={mapReservationStatusToColor(
              record.status as ReservationStatus
            )}
          >
            {record.status}
          </Tag>
        );
      },
      width: 150,
    },
    {
      title: "สถานะการจ่ายเงิน",
      render: (_, record) => {
        return <Tag color="blue">{record.payment_status}</Tag>;
      },
      width: 150,
    },
    {
      title: "ค่าแนะนำ",
      render: (_, record) => {
        return <>{record.referral_fee} บาท</>;
      },
      width: 150,
    },

    {
      title: "Action",
      render: (_, record) => {
        return (
          <Popconfirm
            title="แน่ใจไหมว่าต้องการ แก้สถานะ การจองนี้เป็น pending refund"
            onConfirm={async () => {
              await adminController.MarkRefund(record.id);
              refetch();
            }}
          >
            <Button
              variant="outline"
              className="border-[#30b0c7] text-[#30b0c7] hover:bg-[#30b0c7]/10 text-md rounded-md"
            >
              แก้สถานะเป็น pending refund
            </Button>
          </Popconfirm>
        );
      },
      fixed: "right",
    },
  ];

  const refundActionColumns = _.cloneDeep(columns);
  refundActionColumns[columns.length - 1] = {
    title: "Action",
    render: (_, record) => {
      return (
        <RefundAction
          referral_fee={record.referral_fee}
          reservationId={record.id}
          refetch={refetch}
        />
      );
    },
    fixed: "right",
  };

  const refundedActionColumns = _.cloneDeep(columns);
  refundedActionColumns[columns.length - 1] = {
    title: "จำนวนเงินที่ refund",
    render: (_, record) => {
      return <>{record.refunded_amount} บาท</>;
    },
  };
  refundedActionColumns.push({
    title: "สลิปโอนเงิน",
    render: (_, record) => {
      return (
        <Image
          height={200}
          src={record.refunded_receipt ?? ""}
          fallback="data:image/png;base64,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"
        />
      );
    },
    fixed: "right",
  });

  return (
    <div>
      <Divider style={{ borderColor: "#7cb305" }}>
        การจองงานที่เสร็จแล้ว
      </Divider>
      <JobDrawer
        open={openDrawer}
        setOpen={setOpenDrawer}
        selectedJobId={jobId ?? 0}
        subjects={subjects}
        readOnly={true}
      />
      <Table<ReservationData>
        className={styles.customTable}
        loading={isFetchingReservations}
        pagination={{ pageSize: 5 }}
        columns={columns}
        dataSource={reservations?.filter(
          (r) => r.status === ReservationStatus.COMPLETED
        )}
        scroll={{ x: "max-content" }}
      />
      <Divider style={{ borderColor: "#7cb305" }}>
        การจองงานที่รอ refund
      </Divider>
      <Table<ReservationData>
        className={styles.customTable}
        loading={isFetchingReservations}
        pagination={{ pageSize: 5 }}
        columns={refundActionColumns}
        dataSource={reservations?.filter(
          (r) => r.status === ReservationStatus.PENDING_REFUND
        )}
        scroll={{ x: "max-content" }}
      />
      <Divider style={{ borderColor: "#7cb305" }}>
        การจองงานที่ได้รับการ refund แล้ว
      </Divider>
      <Table<ReservationData>
        className={styles.customTable}
        loading={isFetchingReservations}
        pagination={{ pageSize: 5 }}
        columns={refundedActionColumns}
        dataSource={reservations?.filter(
          (r) => r.status === ReservationStatus.REFUNDED
        )}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

const RefundAction = (props: any) => {
  const [refundAmount, setRefundAmount] = useState(props.referral_fee);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Set the file in the form data using setValue from react-hook-form
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <div className="p-4">
        <div className="flex justify-center p-4">
          {previewUrl && (
            <Image
              height={100}
              src={previewUrl ?? ""}
              fallback="data:image/png;base64,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"
            />
          )}
        </div>
        <FormItem label="สลิปโอน">
          <InputShadCN
            type="file"
            className="text-sm text-gray-500"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </FormItem>
      </div>
      <div className="flex justify-center gap-4">
        <FormItem label="Amount">
          <Input
            style={{ width: "200px" }}
            type="number"
            value={refundAmount}
            onChange={(e) => {
              setRefundAmount(parseInt(e.target.value));
            }}
            addonAfter={"บาท"}
          />
        </FormItem>

        <Button
          className={variantButtonClassName}
          variant="outline"
          onClick={async () => {
            if (!selectedFile) {
              return toast.error("กรุณาเลือกไฟล์");
            }
            const fileName = await adminController.UploadFile(selectedFile);
            await adminController.ManualRefund(
              props.reservationId,
              fileName,
              refundAmount
            );
            props.refetch && props.refetch();
          }}
        >
          Refund
        </Button>
      </div>
    </>
  );
};

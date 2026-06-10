"use client";

import React from "react";
import Link from "next/link";
import {
  Alert,
  Card,
  Col,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { adminController } from "@/services/controller";

const { Title, Text } = Typography;

type DashboardStats = {
  overview: {
    tutors: {
      total: number;
      verified: number;
      unverified: number;
      pending_profile_edits: number;
    };
    jobs: {
      total: number;
      by_status: {
        created: number;
        approved: number;
        cancelled: number;
        completed: number;
      };
    };
    reservations: { total: number; by_status: Record<string, number> };
    students: { unique_posters: number };
    newsletter_subscribers: number;
    referral_codes: number;
  };
  revenue: {
    total_referral_fees: number;
    total_refunded: number;
    completed_paid_count: number;
  };
  action_items: {
    tutors_to_review: number;
    open_jobs: number;
    slips_to_review: number;
    pending_refunds: number;
  };
  top_subjects: { subject: string; count: number }[];
  recent: {
    jobs: {
      id: number;
      status: string;
      subject: string;
      student_name: string;
      fee: number;
      created_at_ms: string;
    }[];
    tutors: {
      id: number;
      name: string;
      admin_verified: boolean;
      email_verified: boolean;
      created_at_ms: string;
    }[];
    completions: {
      reservation_id: number;
      job_id: number;
      tutor_name: string;
      referral_fee: number;
      completed_at_ms: string;
    }[];
  };
};

const jobStatusColor: Record<string, string> = {
  created: "blue",
  approved: "cyan",
  cancelled: "red",
  completed: "green",
};

function formatDate(ms: string) {
  const date = new Date(Number(ms));
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return amount.toLocaleString("th-TH");
}

function ActionItemAlerts({
  items,
}: {
  items: DashboardStats["action_items"];
}) {
  const alerts: { message: string; href: string; count: number }[] = [];

  if (items.tutors_to_review > 0) {
    alerts.push({
      message: "ติวเตอร์รอการรีวิว",
      href: "/tutor/list",
      count: items.tutors_to_review,
    });
  }
  if (items.open_jobs > 0) {
    alerts.push({
      message: "งานที่ยังเปิดอยู่",
      href: "/job/list",
      count: items.open_jobs,
    });
  }
  if (items.slips_to_review > 0) {
    alerts.push({
      message: "สลิปรอตรวจสอบ",
      href: "/reservations/slip",
      count: items.slips_to_review,
    });
  }
  if (items.pending_refunds > 0) {
    alerts.push({
      message: "รอคืนเงิน",
      href: "/tutor/refund",
      count: items.pending_refunds,
    });
  }

  if (alerts.length === 0) {
    return (
      <Alert
        message="ไม่มีงานค้าง — ทุกอย่างเรียบร้อย"
        type="success"
        showIcon
        className="mb-6"
      />
    );
  }

  return (
    <div className="mb-6 flex flex-col gap-2">
      {alerts.map((alert) => (
        <Link key={alert.href} href={alert.href}>
          <Alert
            message={
              <span>
                <ExclamationCircleOutlined className="mr-2" />
                {alert.message}: <strong>{alert.count}</strong> รายการ —{" "}
                <Text underline>คลิกเพื่อดู</Text>
              </span>
            }
            type="warning"
            showIcon={false}
            className="cursor-pointer hover:opacity-90"
          />
        </Link>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isFetching } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: () => adminController.GetDashboardStats(),
  });

  if (isFetching || !stats) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="กำลังโหลดข้อมูล..." />
      </div>
    );
  }

  const { overview, revenue, action_items, top_subjects, recent } = stats;

  return (
    <div className="max-w-7xl mx-auto px-2">
      <Title level={2} className="mb-6">
        Dashboard
      </Title>

      <ActionItemAlerts items={action_items} />

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="ติวเตอร์ทั้งหมด"
              value={overview.tutors.total}
              prefix={<UserOutlined />}
              suffix={
                <Text type="secondary" className="text-sm">
                  ({overview.tutors.verified} อนุมัติแล้ว)
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="งานทั้งหมด"
              value={overview.jobs.total}
              prefix={<FileTextOutlined />}
              suffix={
                <Text type="secondary" className="text-sm">
                  ({overview.jobs.by_status.completed} เสร็จสิ้น)
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Reservations"
              value={overview.reservations.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="นักเรียน (unique)"
              value={overview.students.unique_posters}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card title="รายได้ค่าแนะนำ">
            <Statistic
              title="รวมค่าแนะนำที่ชำระแล้ว"
              value={revenue.total_referral_fees}
              prefix="฿"
              formatter={(v) => formatCurrency(Number(v))}
            />
            <div className="mt-4 space-y-1">
              <Text type="secondary">
                งานที่ชำระแล้ว: {revenue.completed_paid_count} รายการ
              </Text>
              <br />
              <Text type="secondary">
                คืนเงินแล้ว: ฿{formatCurrency(revenue.total_refunded)}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card title="สถานะงาน">
            <div className="space-y-2">
              {Object.entries(overview.jobs.by_status).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <Tag color={jobStatusColor[status] ?? "default"}>{status}</Tag>
                  <Text strong>{count}</Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card title="อื่นๆ">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text>ติวเตอร์รอยืนยัน</Text>
                <Text strong>{overview.tutors.unverified}</Text>
              </div>
              <div className="flex justify-between">
                <Text>แก้ไขโปรไฟล์รออนุมัติ</Text>
                <Text strong>{overview.tutors.pending_profile_edits}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Referral codes</Text>
                <Text strong>{overview.referral_codes}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Newsletter subscribers</Text>
                <Text strong>{overview.newsletter_subscribers}</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="วิชายอดนิยม (Top 5)">
            <Table
              dataSource={top_subjects}
              rowKey="subject"
              pagination={false}
              size="small"
              columns={[
                { title: "วิชา", dataIndex: "subject", key: "subject" },
                {
                  title: "จำนวนงาน",
                  dataIndex: "count",
                  key: "count",
                  align: "right",
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Reservation ตามสถานะ">
            <Table
              dataSource={Object.entries(overview.reservations.by_status).map(
                ([status, count]) => ({ status, count })
              )}
              rowKey="status"
              pagination={false}
              size="small"
              columns={[
                { title: "สถานะ", dataIndex: "status", key: "status" },
                {
                  title: "จำนวน",
                  dataIndex: "count",
                  key: "count",
                  align: "right",
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="งานล่าสุด">
            <Table
              dataSource={recent.jobs}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                { title: "ID", dataIndex: "id", key: "id", width: 60 },
                { title: "วิชา", dataIndex: "subject", key: "subject" },
                {
                  title: "สถานะ",
                  dataIndex: "status",
                  key: "status",
                  render: (status: string) => (
                    <Tag color={jobStatusColor[status]}>{status}</Tag>
                  ),
                },
                {
                  title: "วันที่",
                  dataIndex: "created_at_ms",
                  key: "created_at_ms",
                  render: formatDate,
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="ติวเตอร์ใหม่ล่าสุด">
            <Table
              dataSource={recent.tutors}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                { title: "ชื่อ", dataIndex: "name", key: "name" },
                {
                  title: "สถานะ",
                  key: "verified",
                  render: (_, record) =>
                    record.admin_verified ? (
                      <Tag color="green">อนุมัติแล้ว</Tag>
                    ) : (
                      <Tag color="orange">รออนุมัติ</Tag>
                    ),
                },
                {
                  title: "วันที่",
                  dataIndex: "created_at_ms",
                  key: "created_at_ms",
                  render: formatDate,
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="งานที่เสร็จล่าสุด">
            <Table
              dataSource={recent.completions}
              rowKey="reservation_id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: "Job",
                  dataIndex: "job_id",
                  key: "job_id",
                  width: 60,
                },
                { title: "ติวเตอร์", dataIndex: "tutor_name", key: "tutor_name" },
                {
                  title: "ค่าแนะนำ",
                  dataIndex: "referral_fee",
                  key: "referral_fee",
                  align: "right",
                  render: (fee: number) => `฿${formatCurrency(fee)}`,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

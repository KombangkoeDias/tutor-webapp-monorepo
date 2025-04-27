"use client";
import React from "react";
import { Table, Image, Popconfirm, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { adminController } from "@/services/controller";
import { useAuthRedirect } from "@/components/hooks/use-auth-redirect";

const ReservationTable = () => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["reservation slip"],
    queryFn: async () => {
      const reservations = await adminController.ListReservationSip();
      return reservations;
    },
    initialData: [],
  });

  const handleApproveWithConfirm = async (record: any) => {
    await adminController.ApproveSlip(record.id);
    refetch();
  };

  const columns = [
    {
      title: "Reservation ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Job ID",
      dataIndex: "job_id",
      key: "job_id",
    },
    {
      title: "Tutor ID",
      dataIndex: "tutor_id",
      key: "tutor_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
    },
    {
      title: "ค่าแนะนำ",
      dataIndex: "referral_fee",
      key: "payment_status",
    },
    {
      title: "Slip",
      dataIndex: "slip",
      key: "slip",
      render: (url: string) => (
        <Image width={100} src={url} alt="Payment Slip" />
      ),
    },
    {
      title: "Approve slip",
      key: "approveConfirm",
      render: (_: any, record: any) => (
        <Popconfirm
          title="คุณต้องการ approve slip นี้ใช้หรือไม่"
          onConfirm={() => handleApproveWithConfirm(record)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="dashed" disabled={record.payment_status === "paid"}>
            Approve
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data.reservations}
      loading={isFetching}
    />
  );
};

export default ReservationTable;

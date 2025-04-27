"use client";

import { useState } from "react";
import { Table, Tag, Button, Input, Space, Typography } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import { ArrowUpRight, CopyIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminController } from "@/services/controller";
import { CopyOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { useAuthRedirect } from "@/components/hooks/use-auth-redirect";

const { Title } = Typography;

interface JobData {
  id: number;
  description: string;
  reservation_num: number;
  choose_tutor_link: string;
}

const JobListTable = () => {
  useAuthRedirect();
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["getAllJobList"],
    queryFn: async () => {
      const resp = await adminController.GetJobSummary();
      return resp.jobs;
    },
    initialData: [],
  });

  const columns: ColumnsType<JobData> = [
    {
      title: "รหัสงาน",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "300px",
    },
    {
      title: "จำนวนติวเตอร์ที่จองงาน",
      dataIndex: "reservation_num",
      key: "reservation_num",
      sorter: (a, b) => a.reservation_num - b.reservation_num,
      render: (reservations: number) => {
        const color = reservations > 0 ? "green" : "volcano";
        return <Tag color={color}>{reservations}</Tag>;
      },
    },
    {
      title: "ลิงค์เลือกติวเตอร์",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <Button
              icon={<ArrowUpRight size={18} />}
              href={record.choose_tutor_link}
              target="_blank"
              className="ml-2"
            >
              Go
            </Button>
            <Button
              icon={<CopyIcon size={18} />}
              className="ml-2"
              onClick={() => {
                navigator.clipboard
                  .writeText(record.choose_tutor_link)
                  .then(() => {
                    toast.success(
                      `Copied ลิงค์เลือกติวเตอร์ สำหรับรหัสงาน ${record.description}!`,
                      {
                        position: "bottom-right",
                      }
                    );
                  });
              }}
            >
              Copy
            </Button>
          </>
        );
      },
      fixed: "right",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <Title level={2} className="text-center mb-2">
            งานทั้งหมดที่จองได้
          </Title>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          className="border border-gray-200 rounded-lg"
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default JobListTable;

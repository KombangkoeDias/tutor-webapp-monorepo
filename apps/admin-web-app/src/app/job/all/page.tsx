"use client";

import { Table, Typography, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { adminController } from "@/services/controller";
import { useAuthRedirect } from "@/components/hooks/use-auth-redirect";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useState, useEffect } from "react";
import styled from "styled-components";

const AlwaysScrollTable = styled(Table)`
  .ant-table-container {
    overflow-x: auto !important;
  }
  .ant-table-content,
  .ant-table-body {
    overflow-x: scroll !important;
  }

  /* Reserve space for scrollbar (prevents layout shift) */
  .ant-table-content {
    scrollbar-gutter: stable;
  }

  /* Optional: Always show scrollbar in Webkit browsers */
  .ant-table-content::-webkit-scrollbar {
    height: 8px;
  }
  .ant-table-content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
`;

const { Title } = Typography;

interface JobData {
  id: number;
  status: string;
  note: string;
  created_at_ms: string;
  updated_at_ms: string;
  creator_email: string;
  phone: string | null;
  line_id: string | null;
  name: string;
  surname: string;
  nickname: string;
  fundamental: string;
  level1: string;
  level2: number | null;
  want_to_learn_level1: string;
  want_to_learn_level2: number | null;
  learn_language: string;
  learner_number: number;
  school: string;
  available_date_time: string;
  starting_date: string;
  session_count_per_week: number;
  total_session_count: number;
  hours_per_session: number;
  location: string;
  online: boolean;
  fee: number;
  additional_info: string | null;
  contact_preference: string;
  tutor_id: number | null;
  subjectsId: number;
  referral_code: string | null;
  subject: {
    id: number;
    name: string;
    pendingProfileEditTutorsId: number | null;
  };
  tags: Array<{
    id: number;
    name: string;
  }>;
}

const AllJobsPage = () => {
  useAuthRedirect();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["getAllJobs"],
    queryFn: async () => {
      return await adminController.GetAllJobs();
    },
  });

  // Update total count when data changes
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setPagination((prev) => ({
        ...prev,
        total: data.length,
      }));
    }
  }, [data]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(parseInt(dateString));
      return format(date, "dd/MM/yyyy HH:mm", { locale: th });
    } catch {
      return dateString;
    }
  };

  // Helper function to format ISO date
  const formatISODate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: th });
    } catch {
      return dateString;
    }
  };

  // Helper function to render status with color
  const renderStatus = (status: string) => {
    const statusConfig = {
      created: { color: "blue", text: "สร้างแล้ว" },
      cancelled: { color: "red", text: "ยกเลิก" },
      completed: { color: "green", text: "เสร็จสิ้น" },
      in_progress: { color: "orange", text: "กำลังดำเนินการ" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "default",
      text: status,
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // Helper function to render boolean values
  const renderBoolean = (value: boolean) => (
    <Tag color={value ? "green" : "red"}>{value ? "ใช่" : "ไม่"}</Tag>
  );

  // Helper function to render tags
  const renderTags = (tags: Array<{ id: number; name: string }>) => {
    if (!tags || tags.length === 0) return "-";
    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Tag key={tag.id} color="purple">
            {tag.name}
          </Tag>
        ))}
      </div>
    );
  };

  // Helper function to render subject
  const renderSubject = (subject: { id: number; name: string }) => (
    <Tag color="cyan">{subject.name}</Tag>
  );

  // Helper function to render long text with tooltip
  const renderLongText = (text: string | null, maxLength: number = 50) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;

    return (
      <Tooltip title={text}>
        <span className="cursor-help">{text.substring(0, maxLength)}...</span>
      </Tooltip>
    );
  };

  // Generate columns dynamically based on the first data item
  const generateColumns = (): ColumnsType<JobData> => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    const firstItem = data[0];
    const columns: ColumnsType<JobData> = [];

    // Define column configurations for specific fields
    const columnConfigs: Record<string, any> = {
      id: {
        title: "รหัสงาน",
        width: 80,
        sorter: (a: JobData, b: JobData) => a.id - b.id,
      },
      status: {
        title: "สถานะ",
        width: 120,
        render: renderStatus,
        filters: [
          { text: "สร้างแล้ว", value: "created" },
          { text: "ยกเลิก", value: "cancelled" },
          { text: "เสร็จสิ้น", value: "completed" },
        ],
        onFilter: (value: any, record: JobData) => record.status === value,
      },
      note: {
        title: "หมายเหตุ",
        width: 200,
        render: (text: string) => renderLongText(text, 30),
      },
      created_at_ms: {
        title: "วันที่สร้าง",
        width: 150,
        render: formatDate,
        sorter: (a: JobData, b: JobData) =>
          parseInt(a.created_at_ms) - parseInt(b.created_at_ms),
      },
      updated_at_ms: {
        title: "วันที่อัปเดต",
        width: 150,
        render: formatDate,
        sorter: (a: JobData, b: JobData) =>
          parseInt(a.updated_at_ms) - parseInt(b.updated_at_ms),
      },
      creator_email: {
        title: "อีเมลผู้สร้าง",
        width: 200,
        render: (text: string) => renderLongText(text, 25),
      },
      phone: { title: "เบอร์โทร", width: 120 },
      line_id: {
        title: "Line ID",
        width: 150,
        render: (text: string) => renderLongText(text, 20),
      },
      name: { title: "ชื่อ", width: 120 },
      surname: { title: "นามสกุล", width: 120 },
      nickname: { title: "ชื่อเล่น", width: 100 },
      fundamental: {
        title: "พื้นฐาน",
        width: 120,
        filters: [
          { text: "ดีมาก", value: "ดีมาก" },
          { text: "ดี", value: "ดี" },
          { text: "ปานกลาง", value: "ปานกลาง" },
          { text: "ค่อนข้างอ่อน", value: "ค่อนข้างอ่อน" },
          { text: "อ่อน", value: "อ่อน" },
        ],
        onFilter: (value: any, record: JobData) => record.fundamental === value,
      },
      level1: { title: "ระดับปัจจุบัน", width: 120 },
      level2: { title: "ชั้น", width: 80 },
      want_to_learn_level1: { title: "ระดับที่ต้องการเรียน", width: 150 },
      want_to_learn_level2: { title: "ชั้นที่ต้องการเรียน", width: 150 },
      learn_language: { title: "ภาษาที่เรียน", width: 120 },
      learner_number: {
        title: "จำนวนผู้เรียน",
        width: 120,
        sorter: (a: JobData, b: JobData) => a.learner_number - b.learner_number,
      },
      school: {
        title: "โรงเรียน",
        width: 150,
        render: (text: string) => renderLongText(text, 20),
      },
      available_date_time: {
        title: "เวลาที่ว่าง",
        width: 200,
        render: (text: string) => renderLongText(text, 30),
      },
      starting_date: {
        title: "วันที่เริ่มเรียน",
        width: 150,
        render: formatISODate,
        sorter: (a: JobData, b: JobData) =>
          new Date(a.starting_date).getTime() -
          new Date(b.starting_date).getTime(),
      },
      session_count_per_week: {
        title: "ครั้ง/สัปดาห์",
        width: 120,
        sorter: (a: JobData, b: JobData) =>
          a.session_count_per_week - b.session_count_per_week,
      },
      total_session_count: {
        title: "จำนวนครั้งทั้งหมด",
        width: 150,
        sorter: (a: JobData, b: JobData) =>
          a.total_session_count - b.total_session_count,
      },
      hours_per_session: {
        title: "ชั่วโมง/ครั้ง",
        width: 120,
        sorter: (a: JobData, b: JobData) =>
          a.hours_per_session - b.hours_per_session,
      },
      location: {
        title: "สถานที่",
        width: 150,
        render: (text: string) => renderLongText(text, 20),
      },
      online: { title: "ออนไลน์", width: 100, render: renderBoolean },
      fee: {
        title: "ค่าสอน",
        width: 100,
        sorter: (a: JobData, b: JobData) => a.fee - b.fee,
      },
      additional_info: {
        title: "ข้อมูลเพิ่มเติม",
        width: 200,
        render: (text: string) => renderLongText(text, 30),
      },
      contact_preference: { title: "ช่องทางติดต่อ", width: 150 },
      tutor_id: { title: "รหัสติวเตอร์", width: 120 },
      subjectsId: { title: "รหัสวิชา", width: 100 },
      referral_code: { title: "รหัสแนะนำ", width: 150 },
      subject: {
        title: "วิชา",
        width: 120,
        render: (subject: { id: number; name: string }) =>
          renderSubject(subject),
      },
      tags: { title: "แท็ก", width: 200, render: renderTags },
    };

    // Generate columns based on the first item's keys
    Object.keys(firstItem).forEach((key) => {
      const config = columnConfigs[key];
      if (config) {
        columns.push({
          key,
          dataIndex: key,
          ...config,
        });
      } else {
        // Default column for unknown fields
        columns.push({
          key,
          dataIndex: key,
          title: key,
          width: 150,
          render: (text: any) => {
            if (typeof text === "object" && text !== null) {
              return JSON.stringify(text);
            }
            return text?.toString() || "-";
          },
        });
      }
    });

    return columns;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <Title level={2} className="text-center mb-2">
            งานทั้งหมด (รายละเอียด)
          </Title>
          <p className="text-center text-gray-600">
            แสดงรายละเอียดงานทั้งหมดในระบบ พร้อมการกรองและเรียงลำดับ
          </p>
        </div>

        <AlwaysScrollTable
          columns={generateColumns()}
          dataSource={data || []}
          rowKey="id"
          className="border border-gray-200 rounded-lg"
          scroll={{ x: "max-content", y: "calc(100vh - 300px)" }}
          loading={isFetching}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} จาก ${total} รายการ`,
            pageSizeOptions: ["25", "50", "100", "200"],
            onChange: (page, pageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: pageSize || prev.pageSize,
              }));
            },
            onShowSizeChange: (current, size) => {
              setPagination((prev) => ({
                ...prev,
                current: 1, // Reset to first page when changing page size
                pageSize: size,
              }));
            },
          }}
          size="small"
        />
      </div>
    </div>
  );
};

export default AllJobsPage;

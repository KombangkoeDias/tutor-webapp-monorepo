"use client";
import React, { useState } from "react";
import {
  CollapseProps,
  Divider,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { adminController } from "@/services/controller";
import { useAuthRedirect } from "@/components/hooks/use-auth-redirect";
import { useTableStyle } from "@/chulatutordream/lib/constants";
import { getLatestComment } from "@/components/hooks/login-context";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import TutorProfileReviewDrawer from "./drawer";

type TutorReviewData = {
  id: number;
  title: string;
  name: string;
  educational_background: any[];
  admin_comments: any[];
  accolade: string;
  preferred_job_subject: number[];
  preferred_job_level: string[];
};

export default function TutorReviewListPage() {
  useAuthRedirect();
  const [tutorId, setTutorId] = useState<number>();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isEditProfileTutor, setIsEditProfileTutor] = useState(false);
  const [allowReview, setAllowReview] = useState(true);
  const { styles } = useTableStyle();
  const {
    data: tutors,
    isFetching: isFetchingTutors,
    refetch,
  } = useQuery({
    queryKey: ["getAllUnverifiedTutor"],
    queryFn: async () => {
      const resp = await adminController.GetAllTutors(true);
      return resp;
    },
    initialData: [],
  });

  const columns = (
    isEditProfileTutor: boolean = false,
    isViewProfileTutorOnly: boolean = false
  ): TableColumnsType<TutorReviewData> => [
    {
      title: "ชื่อ-นามสกุล",
      width: 200,
      fixed: "left",
      render: (_, record) => {
        return `${record.title} ${record.name}`;
      },
    },
    {
      title: "การศึกษาสูงสุด",
      render: (_, record) => {
        const eduBackground = record.educational_background[0];
        return `จบ ${eduBackground.level} ที่ ${eduBackground.school}, สาขา ${eduBackground.major}, ได้ GPA: ${eduBackground.gpa}`;
      },
      width: 300,
    },
    {
      title: "สอนวิชา",
      render: (_, record) => {
        return record.preferred_job_subject
          .map((subject) => subject.name)
          .join(", ");
      },
      width: 150,
    },
    {
      title: "ระดับชั้นที่สอน",
      render: (_, record) => {
        return record.preferred_job_level.join(", ");
      },
      width: 150,
    },
    {
      title: "รางวัล/ผลงาน",
      dataIndex: "accolade",
      width: 150,
      render: (_, record) => {
        return (
          <Typography.Paragraph
            ellipsis={{
              rows: 5,
              expandable: "collapsible",
              symbol: (expanded) => {
                return expanded ? "collapse" : "ดูเพิ่มเติม";
              },
            }}
            style={{ whiteSpace: "pre-line" }}
          >
            {record.accolade ?? "-"}
          </Typography.Paragraph>
        );
      },
    },
    {
      title: "admin comment ล่าสุด",
      render: (_, record) => {
        return getLatestComment(record.admin_comments)?.detail ?? "-";
      },
      width: 150,
    },
    {
      title: "Action",
      render: (_, record) => {
        if (isViewProfileTutorOnly) {
          return (
            <Button
              variant="outline"
              className="border-[#30b0c7] text-[#30b0c7] hover:bg-[#30b0c7]/10 text-md rounded-md"
              onClick={() => {
                setTutorId(record.id);
                setOpenDrawer(true);
                setAllowReview(false);
                setIsEditProfileTutor(false);
              }}
            >
              ดูโปรไฟล์
            </Button>
          );
        }
        return (
          <Button
            variant="outline"
            className="border-[#30b0c7] text-[#30b0c7] hover:bg-[#30b0c7]/10 text-md rounded-md"
            onClick={() => {
              setTutorId(record.id);
              setOpenDrawer(true);
              setAllowReview(true);
              setIsEditProfileTutor(isEditProfileTutor);
            }}
          >
            ดูโปรไฟล์เพื่อ review
          </Button>
        );
      },
      fixed: "right",
    },
  ];

  const disabledActionColumns = _.cloneDeep(columns());
  disabledActionColumns[disabledActionColumns.length - 1] = {
    title: "Action",
    render: (_, record) => {
      return <></>;
    },
    fixed: "right",
  };

  return (
    <div>
      <TutorProfileReviewDrawer
        open={openDrawer}
        setOpen={setOpenDrawer}
        tutorId={tutorId}
        refetchTutorForReview={refetch}
        isEditProfileTutor={isEditProfileTutor}
        allowReview={allowReview}
      />
      <Divider style={{ borderColor: "#7cb305" }}>
        ติวเตอร์ที่กำลังรอรีวิว
      </Divider>
      <div className="flex justify-center">
        <div className="lg:w-[80%]">
          <Divider style={{ borderColor: "#7cb305" }}>
            ติวเตอร์สมัครใหม่
          </Divider>
        </div>
      </div>
      <Table<TutorReviewData>
        className={styles.customTable}
        loading={isFetchingTutors}
        pagination={{ pageSize: 5 }}
        columns={columns()}
        dataSource={tutors.to_review?.sign_up}
        scroll={{ x: "max-content" }}
      />
      <div className="flex justify-center">
        <div className="lg:w-[80%]">
          <Divider style={{ borderColor: "#7cb305" }}>
            ติวเตอร์แก้ไขโปรไฟล์
          </Divider>
        </div>
      </div>
      <Table<TutorReviewData>
        className={styles.customTable}
        loading={isFetchingTutors}
        pagination={{ pageSize: 5 }}
        columns={columns(true)}
        dataSource={tutors.to_review?.edit_profile}
        scroll={{ x: "max-content" }}
      />
      <Divider style={{ borderColor: "#7cb305" }}>
        รอติวเตอร์แก้โปรไฟล์ตาม admin comment
      </Divider>
      <Table<TutorReviewData>
        className={styles.customTable}
        loading={isFetchingTutors}
        pagination={{ pageSize: 5 }}
        columns={columns(false, false)}
        dataSource={tutors.pending}
        scroll={{ x: "max-content" }}
      />
      <Divider style={{ borderColor: "#7cb305" }}>ติวเตอร์อื่นๆ</Divider>
      <Table<TutorReviewData>
        className={styles.customTable}
        loading={isFetchingTutors}
        pagination={{ pageSize: 5 }}
        columns={columns(false, true)}
        dataSource={tutors.others}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

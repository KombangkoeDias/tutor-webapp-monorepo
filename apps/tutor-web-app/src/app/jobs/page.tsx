"use client";
import { Modal, Tag } from "antd";
import { Button } from "@/components/ui/button";
import { Button as AntdButton } from "antd";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Level1Options,
  useTableStyle,
  variantButtonClassName,
} from "@/lib/constants";

import { jobController } from "@/services/controller/job";
import { useQuery } from "@tanstack/react-query";

import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";
import { ArrowUpRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import JobDrawer from "./drawer";
import {
  toReactSelectOptions,
  useSharedConstants,
} from "@/components/hooks/constant-context";
import { CheckCircleOutlined, FullscreenOutlined } from "@ant-design/icons";

export enum JobTableMode {
  CONCISE = "concise",
  DETAILED = "detailed",
}

const customStyles = {
  menu: (provided) => ({
    ...provided,
    zIndex: 500,
  }),
};

interface DataType {
  id: number;
  subjectId: number;
  learner_level: string;
  want_to_learn_level: string;
  note: string;
  additional_info: string;
  location: string;
  available_date_time: string;
  tags: any;
}

const JobTable: React.FC<{
  columns: TableColumnsType<DataType>;
  loading: boolean;
  data: DataType[];
  mode: JobTableMode;
}> = ({ columns, loading, data, mode }) => {
  const { styles } = useTableStyle();

  return (
    <Table<DataType>
      loading={loading}
      className={styles.customTable}
      columns={columns}
      dataSource={data}
      scroll={{ y: 500, x: "max-content" }}
      pagination={mode === JobTableMode.CONCISE ? { pageSize: 5 } : false}
    />
  );
};

export default function JobsPage({
  mode = JobTableMode.DETAILED,
}: {
  mode: JobTableMode;
}) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  var columns: TableColumnsType<DataType> = [
    {
      title: "รหัสงาน",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "วิชา",
      dataIndex: "subjectId",
      render: (subjectId) => {
        return <>{subjects[subjectId]}</>;
      },
      width: 50,
    },
    {
      title: "ระดับชั้นผู้เรียน",
      dataIndex: "learner_level",
      width: 100,
    },
    {
      title: "ระดับชั้นที่ต้องการเรียน",
      dataIndex: "want_to_learn_level",
      width: 100,
    },
    {
      title: "รายละเอียด",
      dataIndex: "note",
      width: 150,
    },
    {
      title: "สถานที่สอน",
      dataIndex: "location",
      width: 150,
    },
    {
      title: "รายละเอียดวันเวลาที่เรียน",
      dataIndex: "available_date_time",
      width: "30%",
    },
    {
      title: "Tag",
      dataIndex: "tags",
      render: (tagMap) => {
        if (Object.keys(tagMap).length === 0) {
          return "-";
        }
        return tagMap?.map((tag: any) => {
          return <Tag color="blue">{tag.name}</Tag>;
        });
      },
      width: 200,
    },
    {
      title: "ดูรายละเอียดงาน/จองงาน",
      fixed: "right",
      width: 50,
      render: (_, record) => {
        return (
          <>
            <div className="hidden md:block">
              <Button
                type="button"
                variant="outline"
                className={variantButtonClassName}
                onClick={() => {
                  if (mode === JobTableMode.CONCISE) {
                    router.push(`/jobs?jobId=${record.id}`);
                  } else {
                    setSelectedJobId(record.id);
                    setOpenDrawer(true);
                  }
                }}
              >
                ดูงาน
                <ArrowUpRight />
              </Button>
            </div>
            <div className="display-block md:hidden">
              <Button
                type="button"
                variant="outline"
                className={variantButtonClassName}
                onClick={() => {
                  setSelectedJobId(record.id);
                  setOpenDrawer(true);
                }}
              >
                ดูงาน
                <ArrowUpRight />
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const jobId = searchParams.get("jobId");
      if (jobId) {
        setSelectedJobId(parseInt(jobId));
        setOpenDrawer(true);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  if (mode === JobTableMode.CONCISE) {
    columns = columns.filter((column) =>
      [
        "รหัสงาน",
        "วิชา",
        "ระดับชั้น",
        "สถานที่สอน",
        "ดูรายละเอียดงาน/จองงาน",
      ].includes(column.title as string)
    );
  }

  const {
    data: jobs,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["getAllJobs"],
    queryFn: async () => {
      const resp = await jobController.GetJobs(
        filter.levels,
        filter.subjects,
        filter.tags
      );
      return resp.jobs;
    },
    initialData: [],
  });

  const { subjects, tags, isLoadingSubjects, isLoadingTags } =
    useSharedConstants();

  const [filter, setFilter] = useState<{
    subjects?: number[];
    levels?: string[];
    tags?: number[];
  }>({});

  useEffect(() => {
    if (!isFetching) {
      refetch();
    }
  }, [filter]);

  return (
    <>
      <div className="w-full">
        <Card className="min-h-[500px] max-h-[1000px] border border-gray-300 rounded-lg shadow-md">
          <CardHeader>
            <div className="grid grid-cols-2 mb-4">
              <CardTitle className="text-xl font-semibold">
                งานสอนทั้งหมด
                <CardDescription>
                  *แสดงเฉพาะงานที่ยังไม่ได้จองเท่านั้น
                </CardDescription>
              </CardTitle>
              {pathname === "/" && (
                <div className="flex justify-end">
                  <AntdButton onClick={() => router.push("/jobs")}>
                    <FullscreenOutlined />
                  </AntdButton>
                </div>
              )}
            </div>
            <CardContent>
              <div className="rounded-md">
                {mode === JobTableMode.DETAILED && (
                  <div className="grid grid-cols-1 md:grid-cols-3 mb-3 gap-4 px-3">
                    <div>
                      <Label className="mb-1">วิชา</Label>
                      <Select
                        styles={customStyles}
                        isLoading={isLoadingSubjects}
                        menuPlacement="auto"
                        options={Object.entries(subjects).map(
                          ([key, value]) => ({
                            label: value,
                            value: key.toString(),
                          })
                        )}
                        isMulti
                        className="text-black"
                        closeMenuOnSelect={false}
                        onChange={(v) =>
                          setFilter({
                            ...filter,
                            subjects: v.map((e) => parseInt(e?.value)),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="mb-1">ระดับชั้น</Label>
                      <Select
                        menuPlacement="auto"
                        options={Level1Options}
                        isMulti
                        className="text-black"
                        closeMenuOnSelect={false}
                        onChange={(v) =>
                          setFilter({
                            ...filter,
                            levels: v.map((e) => e?.value).flat(),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="mb-1">Tag</Label>
                      <Select
                        menuPlacement="auto"
                        options={toReactSelectOptions(tags)}
                        isMulti
                        className="text-black"
                        closeMenuOnSelect={false}
                        onChange={(v) =>
                          setFilter({
                            ...filter,
                            tags: v.map((e) => parseInt(e?.value)),
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                <JobTable
                  columns={columns}
                  loading={isFetching || isLoadingTags || isLoadingSubjects}
                  data={jobs}
                  mode={mode}
                />
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
      <JobDrawer
        subjects={subjects}
        open={openDrawer}
        setOpen={setOpenDrawer}
        selectedJobId={selectedJobId}
        readOnly={false}
        refetch={refetch}
        setShowSuccessModal={setShowSuccessModal}
      />
      <Modal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          window.location.reload();
        }}
        onOk={() => {
          setShowSuccessModal(false);
          window.location.reload();
        }}
        onCancel={() => {
          setShowSuccessModal(false);
          window.location.reload();
        }}
        className="success-modal"
      >
        <div className="flex flex-col items-center justify-center py-6">
          <div className="bg-pink-100 p-4 rounded-full mb-4">
            <CheckCircleOutlined className="text-pink-500 text-5xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            จองงานสำเร็จ: รหัสงาน: {selectedJobId}
          </h3>
          <p className="text-gray-600 text-center mb-4">
            ขอบคุณที่ใช้บริการ Job Tutor Dream
          </p>
          <p className="text-gray-600 text-center">
            โปรดรอนักเรียนเลือกติวเตอร์ตามโปรไฟล์ที่ส่งไป
            ระบบจะแจ้งเตือนท่านผ่านอีเมลหากท่านได้รับเลือกให้เป็นติวเตอร์ในงานนี้
          </p>
        </div>
      </Modal>
    </>
  );
}

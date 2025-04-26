"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { reservationController } from "@/services/controller/reservation";
import { useLoggedIn } from "@/components/hooks/login-context";
import {
  mapReservationStatusToColor,
  mapReservationStatusToTooltipText,
  mapPaymentStatusToColor,
  PaymentStatus,
  ReservationStatus,
  useTableStyle,
  variantButtonClassName,
} from "@/lib/constants";

import {
  Button,
  Modal,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
  Dropdown,
  Space,
  Image as AntdImage,
} from "antd";
import { useSharedConstants } from "@/components/hooks/constant-context";
import {
  FullscreenOutlined,
  ReloadOutlined,
  ExportOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { tutorController } from "@/services/controller/tutor";
import _ from "lodash";
import Image from "next/image";
import JobDrawer from "@/app/jobs/drawer";
import type { MenuProps } from "antd";
import { UploadFormSingle } from "@/components/shared/upload_form";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
// enum
export enum JobHistoryTableMode {
  CONCISE = "concise",
  DETAILED = "detailed",
}

type JobReservation = {
  id: number;
  job_id: number;
  tutor_id: number;
  status: string;
  created_at_ms: string;
  updated_at_ms: string;
  propose_online: boolean;
  propose_fee: number;
  payment_qr_base64: string;
  omise_source_id: string;
  omise_charge_id: string;
  payment_status: string;
  slip: string;
  subjectsId: number;
  level: string;
  note: string;
  additional_info: string;
  location: string;
  available_date_time: string;
  refunded_amount: number;
  refunded_receipt: string;
};

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Bangkok", // Change timezone as needed
};

type JobHistoryTableProps = {
  pageSize?: number;
  mode: JobHistoryTableMode;
};

export default function JobHistoryTable({
  pageSize = 3,
  mode,
}: JobHistoryTableProps) {
  const { isLoading: isAuthenticating } = useLoggedIn();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isJobContactModalOpen, setIsJobContactModalOpen] = useState(false);
  const [isJobDrawerOpen, setIsJobDrawerOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const { styles } = useTableStyle();
  const router = useRouter();
  const pathname = usePathname();
  const {
    data,
    error,
    isFetching: isFetchingHistory,
    refetch: refetchReservationHistory,
  } = useQuery({
    queryKey: ["reservation_history"],
    queryFn: async () => {
      const resp = await reservationController.GetReservationHistory();
      return resp.reservations;
    },
    initialData: [],
    enabled: !isAuthenticating,
  });

  const { subjects, isLoading } = useSharedConstants();

  const cancelReservation = async (reservationId: number) => {
    await tutorController.cancelReservation(reservationId);
    refetch();
  };

  var columns: TableColumnsType<JobReservation> = [
    {
      title: "รหัสงาน",
      width: 70,
      fixed: "left",
      render: (_, record) => {
        return (
          <>
            {record.job_id} &nbsp;{" "}
            <ExportOutlined
              onClick={() => {
                setSelectedJobId(record.job_id);
                setIsJobDrawerOpen(true);
              }}
            />
          </>
        );
      },
    },
    {
      title: "วิชา",
      dataIndex: "subjectsId",
      render: (subjectId, record) => {
        return <>{subjects[subjectId] + " " + record.level}</>;
      },
      width: 200,
      ...(window.innerWidth > 768 ? { fixed: "left" } : {}),
    },
    {
      title: "รายละเอียด",
      render: (_, record) => {
        return record.note + ", " + record.additional_info;
      },
    },
    {
      title: "สถานที่สอน",
      dataIndex: "location",
    },
    {
      title: "วันเรียน",
      dataIndex: "available_date_time",
    },
    {
      title: "วันที่จอง",
      dataIndex: "created_at_ms",
      render: (timeMs) => {
        return new Date(parseInt(timeMs)).toLocaleString(
          "th-TH",
          dateTimeOptions
        );
      },
    },
    {
      title: "เงื่อนไขเพิ่มเติม",
      render: (_, record) => {
        return (
          <>
            <p>
              ค่าสอนที่เสนอ:{" "}
              {record.propose_fee ? record.propose_fee + " บาท" : "-"}
            </p>
            <p>เสนอสอนออนไลน์: {record.propose_online ? "✅" : "-"}</p>
          </>
        );
      },
    },
    {
      title: "สถานะการจอง",
      dataIndex: "status",
      render: (status) => {
        return (
          <>
            <Tooltip
              title={mapReservationStatusToTooltipText(status)}
              className="mr-2 cursor-help"
            >
              <InfoCircleOutlined />
            </Tooltip>
            <Tag color={mapReservationStatusToColor(status)}>{status}</Tag>
          </>
        );
      },
      ...(window.innerWidth > 768 ? { fixed: "right" } : {}),
    },
    {
      title: "action",
      render: (_, record) => {
        const renderActionButton = () => {
          if (
            [ReservationStatus.RESERVED, ReservationStatus.BACKUP].includes(
              record.status as ReservationStatus
            )
          ) {
            return (
              <div className="z-10">
                <Button
                  danger
                  ghost
                  onClick={() => {
                    cancelReservation(record.id);
                  }}
                >
                  ยกเลิกการจอง
                </Button>
              </div>
            );
          } else if (record.status === ReservationStatus.APPROVED) {
            if (record.slip) {
              return (
                <div>
                  ท่านได้อัพโหลดสลิปแล้ว โปรดรอแอดมิน รีวิวภายใน 24 ชม
                  <div className="flex justify-center">
                    <AntdImage height={150} src={record.slip} />
                  </div>
                </div>
              );
            }
            return renderPaymentStatus(record);
          } else if (record.status === ReservationStatus.COMPLETED) {
            return (
              <div className="w-full flex justify-center">
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    setReservationId(record.id.toString());
                    setIsJobContactModalOpen(true);
                  }}
                >
                  ดูข้อมูลการติดต่อผู้ปกครอง/นักเรียน
                </Button>
              </div>
            );
          } else if (record.status === ReservationStatus.REFUNDED) {
            return (
              <div>
                <div>จำนวนเงินที่ refund: {record.refunded_amount} บาท</div>
                <div className="flex justify-center">
                  <AntdImage height={150} src={record.refunded_receipt} />
                </div>
                <div className="flex justify-center">ใบเสร็จโอนเงิน</div>
              </div>
            );
          } else {
            return <></>;
          }
        };
        const items: MenuProps["items"] = [
          {
            key: "1",
            label: <>{renderActionButton()}</>,
          },
        ];
        if (mode === JobHistoryTableMode.CONCISE) {
          // under dropdown
          return (
            <Dropdown menu={{ items: items }} placement="bottom">
              <Button>
                <DownOutlined />
              </Button>
            </Dropdown>
          );
        } else {
          return <>{renderActionButton()}</>;
        }
      },
      ...(window.innerWidth > 768 ? { fixed: "right" } : {}),
    },
  ];

  if (mode === JobHistoryTableMode.CONCISE) {
    columns = columns.filter((column) =>
      ["รหัสงาน", "วิชา", "สถานะการจอง", "action"].includes(
        column.title as string
      )
    );
  }

  function renderPaymentStatus(record: JobReservation) {
    if (
      !!!record.payment_status ||
      record.payment_status === PaymentStatus.UNPAID
    ) {
      return (
        <div className="flex flex-col items-center justify-center">
          <Button
            className={variantButtonClassName}
            onClick={() => {
              setReservationId(record.id.toString());
              setIsPaymentModalOpen(true);
            }}
          >
            จ่ายเงินค่าแนะนำ
          </Button>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center">
        <div>
          สถานะการจ่ายเงิน: &nbsp;
          <Tag
            color={mapPaymentStatusToColor(
              record.payment_status as PaymentStatus
            )}
          >
            {record.payment_status}
          </Tag>
        </div>
        <br />
        {record.payment_status === PaymentStatus.FAILED && (
          <Button
            type="primary"
            ghost
            onClick={() => {
              setReservationId(record.id.toString());
              setIsPaymentModalOpen(true);
            }}
          >
            จ่ายเงินค่าแนะนำอีกครั้ง
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <PaymentModal
        isModalOpen={isPaymentModalOpen}
        setIsModalOpen={setIsPaymentModalOpen}
        reservationId={reservationId ?? ""}
        setIsJobContactModalOpen={setIsJobContactModalOpen}
        refetchReservationHistory={refetchReservationHistory}
      />
      <JobContactModal
        isModalOpen={isJobContactModalOpen}
        setIsModalOpen={setIsJobContactModalOpen}
        reservationId={reservationId ?? ""}
      />
      <Card className="mb-8">
        <CardHeader>
          <div className="grid grid-cols-2">
            <CardTitle className="text-xl font-semibold">
              ประวัติการจองงาน
            </CardTitle>
            {pathname === "/" && (
              <div className="flex justify-end">
                <Button onClick={() => router.push("/reservation/history")}>
                  <FullscreenOutlined />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        {/* show number of record out of total at the footer */}
        <CardContent>
          <Table<JobReservation>
            className={styles.customTable}
            loading={isAuthenticating || isLoading || isFetchingHistory}
            pagination={{ pageSize: pageSize }}
            columns={columns}
            dataSource={data}
            scroll={{ x: "max-content" }}
          />
        </CardContent>
      </Card>
      <JobDrawer
        open={isJobDrawerOpen}
        setOpen={setIsJobDrawerOpen}
        selectedJobId={selectedJobId ?? 0}
        subjects={subjects}
        readOnly={true}
        refetch={refetchReservationHistory}
      />
    </div>
  );
}

function PaymentModal({
  isModalOpen,
  setIsModalOpen,
  reservationId,
  setIsJobContactModalOpen,
  refetchReservationHistory,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  reservationId: string;
  setIsJobContactModalOpen: (isOpen: boolean) => void;
  refetchReservationHistory: () => void;
}) {
  const [isCreatingQRCode, setIsCreatingQRCode] = useState(false);
  const [isQrRendered, setIsQrRendered] = useState(false);

  const form = useForm({
    defaultValues: {
      receipt: undefined,
    },
  });

  // poll payment status
  useEffect(() => {
    if (isModalOpen) {
      setIsCreatingQRCode(true);
      reservationController
        .GenerateQRCode(reservationId)
        .then((_) => {
          refetch();
        })
        .finally(() => {
          setIsCreatingQRCode(false);
        });
      const interval = setInterval(() => {
        refetch();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isModalOpen]);

  const { data, error, isFetching, isRefetching, refetch } = useQuery({
    queryKey: ["reservation", reservationId],
    queryFn: async () => {
      const resp = await reservationController.GetReservationById(
        reservationId
      );

      return resp;
    },
    initialData: null,
    enabled: isModalOpen,
  });

  useEffect(() => {
    if (data?.payment_status === PaymentStatus.PAID) {
      setIsModalOpen(false);
      setIsJobContactModalOpen(true);
    }
  }, [data]);

  const mapPaymentStatusToText = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return "จ่ายเงินแล้ว";
      case PaymentStatus.UNPAID:
        return "รอจ่ายเงิน";
      case PaymentStatus.FAILED:
        return "จ่ายเงินไม่สำเร็จ";
      default:
        return status;
    }
  };

  const isUsingOmise = false;

  return (
    <Modal
      title="จ่ายเงินค่าแนะนำ"
      open={isModalOpen}
      onOk={async () => {
        if (form.getValues("receipt")) {
          const fileName = await tutorController.UploadReceipt(
            form.getValues("receipt") as File
          );
          await tutorController.AddSlip(parseInt(reservationId), fileName);
          refetchReservationHistory();
        }
        setIsModalOpen(false);
      }}
      okText={form.getValues("receipt") ? "ส่งสลิป" : "Ok"}
      onCancel={() => setIsModalOpen(false)}
      loading={(data == null && isFetching) || isCreatingQRCode}
    >
      <div className="flex flex-col items-center justify-center p-8">
        {!isUsingOmise && (
          <>
            <div className="flex justify-center items-center w-[400px] bg-[#113E64]">
              <Image
                src="/thai-qr-payment-logo.png"
                alt="qr logo"
                width={150}
                height={150}
              />
            </div>
            <div className="mt-3">
              <Image
                src="/thailand-pg.png"
                alt="qr code"
                width={150}
                height={150}
              />
            </div>
          </>
        )}
        <div style={{ position: "relative" }}>
          <Image
            src={data?.payment_qr_base64}
            alt="qr code"
            width={300}
            height={300}
            unoptimized
            style={{ display: "block" }}
            onLoadingComplete={() => setIsQrRendered(true)}
          />
          {isQrRendered && (
            <Image
              src="/home-thaiqrcode.png"
              alt="qr code"
              width={50}
              height={50}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>
        <p className="text-lg ">ชื่อบัญชี: นางสาว ชัสมา ไตรสุริยธรรมา</p>
        <p className="text-lg font-semibold">{data?.referral_fee} บาท</p>
        {/* show payment status beautiful*/}
        {isUsingOmise && (
          <>
            <p className="text-lg font-semibold">
              สถานะการจ่ายเงิน: &nbsp;
              <Tag
                color={
                  data?.payment_status
                    ? mapPaymentStatusToColor(
                        data?.payment_status as PaymentStatus
                      )
                    : "default"
                }
                className="text-lg font-semibold mt-2"
              >
                {mapPaymentStatusToText(data?.payment_status as PaymentStatus)}
              </Tag>
            </p>
            {data?.payment_status === PaymentStatus.FAILED && (
              <>
                <p className="text-lg font-semibold mt-2 text-red-500">
                  กรุณาสร้าง QR Code ใหม่
                </p>
                <Button
                  className="mt-2"
                  type="primary"
                  ghost
                  onClick={() => {
                    setIsCreatingQRCode(true);
                    reservationController
                      .GenerateQRCode(reservationId, true)
                      .then((_) => {
                        refetch();
                      })
                      .finally(() => {
                        setIsCreatingQRCode(false);
                      });
                  }}
                >
                  <ReloadOutlined /> สร้าง QR Code ใหม่
                </Button>
              </>
            )}
          </>
        )}
        {!isUsingOmise && (
          <Form {...form}>
            <form>
              <div className="mt-4 w-[100%]">
                <UploadFormSingle
                  form={form}
                  fileFormPath="receipt"
                  fileUrlPath="undefined"
                  originalName=""
                  readOnly={false}
                  name="receipt"
                  // label="อัพโหลด slip การโอนเงิน"
                  description="แอดมินจะรีวิว slip ของท่านภายใน 24 ชั่วโมง"
                  existingFileUrlPath="url"
                  existingFileNamePath="name"
                />
              </div>
              <div>
                <p>
                  <b>
                    กรุณาแนบสลิป
                    ไม่เช่นนั้นแอดมินจะไม่สามารถดำเนินการขั้นต่อไปได้
                  </b>
                </p>
              </div>
            </form>
          </Form>
        )}
      </div>
    </Modal>
  );
}

function JobContactModal({
  isModalOpen,
  setIsModalOpen,
  reservationId,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  reservationId: string;
}) {
  const { data, error, isFetching, isRefetching, refetch } = useQuery({
    queryKey: ["reservation", reservationId, 2],
    queryFn: async () => {
      const resp = await reservationController.GetReservationById(
        reservationId
      );
      return resp;
    },
    initialData: null,
    enabled: isModalOpen,
  });

  const renderJobContact = () => {
    if (isFetching) {
      return <Spin className="mt-4" />;
    }
    if (data?.job_contact) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          {data.job_contact.map((contact: any) => (
            <p className="text-lg p-2" key={contact.id}>
              {contact.type}: {contact.value}
            </p>
          ))}
        </div>
      );
    } else {
      return <>ไม่มีข้อมูลช่องทางการติดต่อ กรุณาติดต่อแอดมิน</>;
    }
  };

  return (
    <Modal
      title="ช่องทางการติดต่อผู้ปกครอง/นักเรียน"
      open={isModalOpen}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
    >
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-2xl font-bold">✅ ชำระเงินค่าแนะนำเรียบร้อย!!</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p>โปรดติดต่อผู้ปกครอง/นักเรียนตามช่องทางด้านล่าง</p>
        {renderJobContact()}
      </div>
    </Modal>
  );
}

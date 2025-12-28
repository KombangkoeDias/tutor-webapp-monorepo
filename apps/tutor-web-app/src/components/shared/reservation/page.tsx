"use client";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import {
  Avatar,
  Checkbox,
  message,
  Modal,
  Skeleton,
  Table,
  TableColumnType,
  Tag,
  Typography,
} from "antd";
import {
  mapReservationStatusToColor,
  ReservationStatus,
  useTableStyle,
} from "../../../lib/constants";
import { useQuery } from "@tanstack/react-query";
import { reservationController } from "../../../services/controller/reservation";
import _ from "lodash";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Images, User } from "lucide-react";

export default function ReservationListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { styles } = useTableStyle();
  const [mainTutor, setMainTutor] = useState<number>();
  const [backupTutor, setBackupTutor] = useState<number>();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const code = searchParams.get("code");
  const jobId = searchParams.get("jobId");
  const status = searchParams.get("status");
  if (!code || !jobId) {
    // redirect to home
    toast.error("ลิงค์เข้าดูงานไม่ถูกต้อง");
    router.push("/");
  }
  const [croppedImages, setCroppedImages] = useState<string[]>([]);

  const {
    data,
    error,
    isFetching: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reservation list", jobId, code],
    queryFn: async () => {
      const resp = await reservationController.GetReservationList(
        parseInt(jobId || "0"),
        code || ""
      );

      console.log("kbd resp", resp);

      if (resp.job?.status === "approved") {
        const mainReservation = resp.reservations.find(
          (res) => res.status === ReservationStatus.APPROVED
        );
        const backupReservation = resp.reservations.find(
          (res) => res.status === ReservationStatus.BACKUP
        );
        if (mainReservation) {
          setMainTutor(mainReservation.id);
        }
        if (backupReservation) {
          setBackupTutor(backupReservation.id);
        }
      }

      console.log("kbd resp 2", resp);

      const croppedImages = await Promise.all(
        resp.reservations.map(async (reservation) => {
          const cropSettings =
            reservation?.tutorDetail?.profilePic?.cropSettings
              ?.croppedAreaPixels;
          const imageSrc = reservation?.tutorDetail?.profilePic.url;
          if (!imageSrc || !cropSettings) {
            return null;
          }
          return getCroppedImg(imageSrc, cropSettings);
        })
      );
      console.log("kbd resp", resp);

      setCroppedImages(croppedImages);

      console.log("kbd job", resp.job);
      console.log("kbd reservations", resp.reservations);

      return {
        job: resp.job,
        reservations: resp.reservations,
      };
    },
    initialData: { job: null, reservations: [] },
    enabled: !!jobId && !!code,
  });

  // table
  const columns: TableColumnType<TutorReservation>[] = [
    {
      title: "ลำดับ",
      render: (_, record, index) => {
        return <div>{index + 1}</div>;
      },
      width: 70,
    },
    {
      title: "ติวเตอร์",
      render: (_, record, index) => {
        // make avatar larger
        return (
          <div>
            <Avatar
              size={100}
              src={croppedImages[index]}
              icon={<User size={50} />}
            />
          </div>
        );
      },
      width: 70,
    },
    {
      title: "เพศ",
      render: (_, record) => {
        const male = ["นาย", "เด็กชาย"];
        return (
          <div>
            <p>{male.includes(record.tutorDetail.title) ? "ชาย" : "หญิง"}</p>
          </div>
        );
      },
      width: 100,
    },
    {
      title: "ชื่อเล่น",
      render: (_, record) => {
        return (
          <div>
            <p>{record.tutorDetail.nickname}</p>
          </div>
        );
      },
      width: 100,
    },
    {
      title: "สถานะ",
      render: (_, record) => {
        return (
          <div>
            <p>
              <Tag
                color={mapReservationStatusToColor(
                  record.status as ReservationStatus
                )}
              >
                {record.status}
              </Tag>
            </p>
          </div>
        );
      },
      width: 100,
    },
    {
      title: "วันที่จอง",
      render: (_, record) => {
        return (
          <div>
            <p>
              {new Date(parseInt(record.created_at_ms)).toLocaleString(
                "th-TH",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>
        );
      },
    },
    {
      title: "ประวัติการศึกษา",
      dataIndex: "tutorDetail.educationalExp",
      render: (_, record) => {
        const eduBackground = record.tutorDetail.educationalExp[0];
        return `จบ ${eduBackground.level} ที่ ${eduBackground.school}, สาขา ${eduBackground.major}`;
      },
      width: 300,
    },
    {
      title: "ผลงาน/รางวัล",
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
            {record.tutorDetail.accolade ?? "-"}
          </Typography.Paragraph>
        );
      },
      width: 300,
    },
    {
      title: "ค่าสอนที่ติวเตอร์เสนอ",
      render: (_, record) => {
        return (
          <div>
            <p>
              {record.propose_fee
                ? record.propose_fee + " บาท"
                : "✅ ติวเตอร์โอเคกับค่าสอนที่คุณตั้ง"}
            </p>
          </div>
        );
      },
    },
    {
      title: "ต้องการออนไลน์",
      dataIndex: "propose_online",
      render: (_, record) => {
        console.log("record", record);
        return (
          <div>
            <p>
              {record.propose_online
                ? "⚠️ ติวเตอร์ต้องการสอนออนไลน์เท่านั้น"
                : data?.job?.online
                  ? "✅ ติวเตอร์โอเคกับการสอนออนไลน์"
                  : "✅ ติวเตอร์โอเคกับการสอนออฟไลน์"}
            </p>
          </div>
        );
      },
    },

    {
      title: (
        <>
          เลือกติวเตอร์หลัก <p className="text-red-500">*</p>
        </>
      ),
      render: (_, record) => {
        return (
          <div>
            <Checkbox
              disabled={status === ReservationStatus.APPROVED}
              checked={
                status === ReservationStatus.APPROVED || record.id === mainTutor
              }
              onChange={(e) => {
                if (record.id === backupTutor) {
                  setBackupTutor(undefined);
                }
                if (record.id === mainTutor) {
                  return setMainTutor(undefined);
                }
                setMainTutor(record.id);
              }}
            />
          </div>
        );
      },
      width: window.innerWidth > 768 ? "10%" : "4%",
      fixed: "right",
    },
    {
      title: "เลือกติวเตอร์สำรอง",
      render: (_, record) => {
        return (
          <div>
            <Checkbox
              disabled={status === ReservationStatus.BACKUP}
              checked={
                status === ReservationStatus.BACKUP || record.id === backupTutor
              }
              onChange={(e) => {
                if (record.id === mainTutor) {
                  setMainTutor(undefined);
                }
                if (record.id === backupTutor) {
                  return setBackupTutor(undefined);
                }
                setBackupTutor(record.id);
              }}
            />
          </div>
        );
      },
      width: window.innerWidth > 768 ? "7%" : "4%",
      fixed: "right",
    },
  ];

  type TutorReservation = {
    id: number;
    status: string;
    created_at_ms: string;
    updated_at_ms: string;
    tutorDetail: {
      id: number;
      nickname: string;
      educationalExp: {
        level: string;
        school: string;
        major: string;
        gpa: string;
      }[];
      accolade: string;
      title: string;
      profilePic: {
        url: string;
        cropSettings: {
          x: number;
          y: number;
          zoom: number;
          croppedAreaPixels: {
            width: number;
            height: number;
            x: number;
            y: number;
          };
        };
      };
    };
    propose_fee: number | null;
    propose_online: boolean;
    job: {
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
      level2: number;
      want_to_learn_level1: string;
      want_to_learn_level2: number;
      learner_number: number;
      school: string;
      available_date_time: string;
      starting_date: string;
      session_count_per_week: number;
      total_session_count: number;
      hours_per_session: number;
      location: string;
      fee: number;
      additional_info: string;
      contact_preference: string;
      tutor_id: number | null;
      subjectsId: number;
      online: boolean;
    };
  };

  const getColumnsForSelectedTutor = () => {
    const copiedColumns = _.cloneDeep(columns);
    copiedColumns[0] = {
      title: "ติวเตอร์",
      render: (_, record, index) => {
        if (record.status === ReservationStatus.COMPLETED) {
          return "ติวเตอร์ที่สอนงานนี้";
        }
        return record.id === mainTutor ? "ติวเตอร์หลัก" : "ติวเตอร์สำรอง";
      },
      width: 70,
      fixed: "left",
    };
    return copiedColumns.slice(0, copiedColumns.length - 2);
  };

  return (
    <div className="p-4">
      {isLoading && (
        <div>
          <Skeleton active />
          <Skeleton active />
          <Skeleton active />
        </div>
      )}
      {data.job?.status === "created" && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-2">
              เลือกติวเตอร์สำหรับงาน รหัส: {jobId}
            </h1>
          </div>

          <Table<TutorReservation>
            className={styles.customTable}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            columns={columns}
            dataSource={data.reservations}
            scroll={{ x: "max-content", y: "calc(100vh-200px)" }}
            rowClassName={(record) => {
              if (record.tutorDetail.id === mainTutor)
                return "border-2 border-blue-500";
              if (record.tutorDetail.id === backupTutor)
                return "border-2 border-red-500";
              return "";
            }}
          />
          <div className="grid grid-cols-1 flex justify-between items-center">
            <div className="w-full flex justify-end">
              <Button
                className="bg-[#4CAF50] hover:bg-[#45a049]"
                onClick={() => {
                  if (mainTutor) {
                    setShowConfirmationModal(true);
                  } else {
                    toast.error("กรุณาเลือกติวเตอร์หลัก");
                  }
                }}
              >
                ยืนยันการเลือกติวเตอร์
              </Button>
            </div>
          </div>
        </>
      )}
      {data.job?.status === "approved" && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-2">
              งานรหัส: {jobId} ถูกยืนยันแล้ว
            </h1>
          </div>

          <Table<TutorReservation>
            className={styles.customTable}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            columns={getColumnsForSelectedTutor()}
            dataSource={data.reservations}
            scroll={{ x: "max-content", y: "calc(100vh-200px)" }}
            rowClassName={(record) => {
              if (record.tutorDetail.id === mainTutor)
                return "border-2 border-blue-500";
              if (record.tutorDetail.id === backupTutor)
                return "border-2 border-red-500";
              return "";
            }}
          />
        </>
      )}
      {data.job?.status === "cancelled" && (
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-2">
            งานรหัส: {jobId} ถูกยกเลิกแล้วเนื่องจากงานไม่มีการอัพเดทใดๆ
            ในหนึ่งเดือน ตามที่แจ้งไว้
          </h1>
        </div>
      )}
      {data.job?.status === "completed" && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-2">
              งานรหัส: {jobId} เสร็จสิ้นแล้ว
            </h1>
          </div>

          <Table<TutorReservation>
            className={styles.customTable}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            columns={getColumnsForSelectedTutor()}
            dataSource={data.reservations}
            scroll={{ x: "max-content", y: "calc(100vh-200px)" }}
            rowClassName={(record) => {
              return "border-2 border-blue-500";
            }}
          />
        </>
      )}
      {showConfirmationModal && (
        <Modal
          title="ยืนยันการเลือกติวเตอร์"
          okButtonProps={{
            style: {
              backgroundColor: "#4CAF50",
              color: "white",
            },
          }}
          open={showConfirmationModal}
          onOk={async () => {
            await reservationController.ApproveReservation(
              code || "",
              mainTutor || 0,
              backupTutor || undefined
            );
            setShowConfirmationModal(false);
            refetch();
          }}
          onCancel={() => setShowConfirmationModal(false)}
          width={`100vw - 2rem`}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-2">
              ติวเตอร์ที่เลือกสำหรับงาน รหัส: {jobId}
            </h1>
          </div>
          <Table<TutorReservation>
            className={styles.customTable}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            columns={getColumnsForSelectedTutor()}
            dataSource={data.reservations
              .filter(
                (item) => item.id === mainTutor || item.id === backupTutor
              )
              .sort((a, b) => {
                if (a.tutorDetail.id === mainTutor) return -1;
                if (b.tutorDetail.id === mainTutor) return 1;
                return 0;
              })}
            scroll={{ x: "max-content", y: "calc(100vh-200px)" }}
          />
        </Modal>
      )}
    </div>
  );
}

/**
 * Creates an image element from a source
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous"; // This helps avoid CORS issues with S3 URLs
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any
): Promise<string> => {
  // For S3 or other remote URLs, we need to handle them differently than base64 strings
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return imageSrc;
  }

  // Set canvas size to the desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As Base64 string
  return canvas.toDataURL("image/jpeg");
};

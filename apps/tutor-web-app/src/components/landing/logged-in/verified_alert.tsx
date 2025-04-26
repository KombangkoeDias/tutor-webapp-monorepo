import {
  getLatestComment,
  useLoggedIn,
} from "@/components/hooks/login-context";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OctagonAlert } from "lucide-react";
import { tutorController } from "@/services/controller/tutor";
import { Tag } from "antd";
import { variantButtonClassName } from "@/lib/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function VerifiedAlert() {
  const { tutor } = useLoggedIn();
  const router = useRouter();
  const TutorUnderReviewAlert = () => {
    if (tutor?.admin_comments?.length === 0) {
      return (
        <Alert className="shadow-lg p-5 m-4 w-[90wv]">
          <div className="flex justify-start">
            <Spinner />
            <AlertTitle className="pl-4 mb-0">
              เรากำลังรีวิวโปรไฟล์ของท่าน
            </AlertTitle>
          </div>
          <AlertDescription className="pl-10">
            แอคเคานท์ของท่านกำลังรอการรีวิวจากแอดมิน โปรดรอประมาณ 2-3 วันทำการ
          </AlertDescription>
        </Alert>
      );
    } else {
      if (
        getLatestComment(tutor?.admin_comments)?.created_at_ms ??
        "0" > (tutor?.updated_at_ms ?? "")
      ) {
        // admin comments after tutor update
        return (
          <Alert className="shadow-lg p-5 m-4 w-[90wv]">
            <div className="flex justify-between">
              <div className="flex justify-start">
                <Spinner />
                <AlertTitle className="pl-4 mb-0">
                  แอดมินได้แสดงความเห็นบนโปรไฟล์ของคุณ:{" "}
                  <Tag color="blue">
                    "{getLatestComment(tutor?.admin_comments)?.detail ?? ""}"
                  </Tag>
                </AlertTitle>
              </div>
              <div className="flex justify-end items-center">
                <Button
                  variant="outline"
                  className={variantButtonClassName}
                  onClick={() => {
                    router.push("/tutor/profile?edit_tour=true");
                  }}
                >
                  แก้ไขโปรไฟล์
                </Button>
              </div>
            </div>

            <AlertDescription className="pl-10">
              กรุณาแก้โปรไฟล์ตามความเหมาะสม
            </AlertDescription>
          </Alert>
        );
      }
      return (
        <Alert className="shadow-lg p-5 m-4 w-[90wv]">
          <div className="flex justify-start">
            <Spinner />
            <AlertTitle className="pl-4 mb-0">
              เรากำลังรีวิวโปรไฟล์ของท่าน
            </AlertTitle>
          </div>
          <AlertDescription className="pl-10">
            แอคเคานท์ของท่านกำลังรอการรีวิวจากแอดมินจากที่แอดมินได้แสดงความเห็นในครั้งที่แล้ว
            <Tag color="default">
              "{getLatestComment(tutor?.admin_comments)?.detail ?? ""}"
            </Tag>
          </AlertDescription>
        </Alert>
      );
    }
  };
  return (
    <div className="grid grid-cols-1">
      <div className="mt-8 ml-8 mr-8">
        <h1 className="text-3xl font-bold text-gray-800 ">
          ยินดีต้อนรับ, {tutor?.name ?? ""}!
        </h1>
        <p>
          แอคเคานท์ของท่านยังไม่พร้อมสำหรับการใช้งาน โปรดดูรายละเอียดด้านล่าง
        </p>
      </div>
      {!tutor?.email_verified && (
        <Alert className="shadow-lg p-6 m-4 w-[90wv]">
          <OctagonAlert className="h-8 w-8" color="red" />
          <AlertTitle>แอคเคานท์ของท่านยังไม่ได้ทำการยืนยันอีเมล</AlertTitle>
          <AlertDescription>
            กรุณายืนยันอีเมล เราได้ส่งอีเมลยืนยันไปแล้วที่ {tutor?.email}{" "}
            (กรุณาเช็ค โฟลเดอร์ spam และ promotion หากไม่พบอีเมล )
            <span className="flex justify-start">
              <Button
                variant="outline"
                className={variantButtonClassName}
                onClick={async () => {
                  await tutorController.resendVerifyEmail();
                }}
              >
                ส่งอีเมลยืนยันอีกครั้ง
              </Button>
            </span>
          </AlertDescription>
        </Alert>
      )}
      {!tutor?.admin_verified && <TutorUnderReviewAlert />}
    </div>
  );

  //   } else if (!tutor?.admin_verified) {
  //     return (
  //       <Alert>
  //         <OctagonAlert className="h-4 w-4" color="red" />
  //         <AlertTitle>Heads up!</AlertTitle>
  //         <AlertDescription>
  //           You can add components to your app using the cli.
  //         </AlertDescription>
  //       </Alert>
  //     );
  //   } else {
  //     return <></>;
  //   }
}

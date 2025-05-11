"use client";
import { useLocationConstants } from "@/components/hooks/location-context";
import {
  getLatestComment,
  useLoggedIn,
} from "@/components/hooks/login-context";
import { useAuthRedirect } from "@/components/hooks/use-auth-redirect";
import {
  convertBackendToFormData,
  convertFormDataToBackend,
} from "@/components/shared/form_data";
import { uploadAllFiles } from "@/components/shared/form_data";
import TutorProfileForm, {
  tutorProfileFormSchemaForUpdate,
} from "@/components/shared/profile";
import { Button } from "@/components/ui/button";
import { variantButtonClassName } from "@/lib/constants";
import { removeSearchParam, scrollToTop } from "@/lib/utils";
import { tutorController } from "@/services/controller/tutor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Alert, Drawer } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function TutorProfile() {
  useAuthRedirect();
  const { loggedIn, reAuthenticate } = useLoggedIn();
  const [readOnly, setReadOnly] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [openPendingProfileDrawer, setOpenPendingProfileDrawer] =
    useState(false);
  const [pendingProfileReadOnly, setPendingProfileReadOnly] = useState(true);

  useEffect(() => {
    const edit = searchParams.get("edit");
    if (edit == "true") {
      setReadOnly(false);
      return;
    }
    setReadOnly(true);
  }, [searchParams]);

  const formDefaultValues = {
    title: undefined,
    name: undefined,
    surname: undefined,
    nickname: undefined,
    telephone: undefined,
    email: undefined,
    line_id: undefined,
    birthday: undefined,
    address: undefined,
    province: undefined,
    amphoe: undefined,
    tambon: undefined,
    postcode: undefined,
    id_card_img_file: undefined,
    id_card_img: undefined,
    educational_cert_img_file: [],
    educational_cert_img: [],
    accolade_cert_img_file: [],
    accolade_cert_img: [],
    educational_background_list: [{}],
    educational_background: undefined,
    preferred_job_level_list: undefined,
    preferred_job_level: undefined,
    preferred_job_subject: undefined,
    preferred_job_subject_list: undefined,
    accolade: undefined,
  };

  const form = useForm({
    resolver: zodResolver(tutorProfileFormSchemaForUpdate),
    mode: "onTouched",
    defaultValues: formDefaultValues,
  });

  const pendingProfileForm = useForm({
    resolver: zodResolver(tutorProfileFormSchemaForUpdate),
    mode: "onTouched",
    defaultValues: formDefaultValues,
  });

  const { setProvinceId, setAmphoeId, setTambonId } = useLocationConstants();

  const {
    data: tutorData,
    isFetching,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["tutorProfile"],
    queryFn: async () => {
      const tutor = await tutorController.LoadTutorProfile();

      const [profile, pendingProfile] = await Promise.all([
        convertBackendToFormData(tutor.profile),
        convertBackendToFormData(tutor.pending_profile),
      ]);

      const profileToSetAddress = !!pendingProfile ? pendingProfile : profile;

      setProvinceId(profileToSetAddress.province.value);
      setAmphoeId(profileToSetAddress.amphoe.value);
      setTambonId(profileToSetAddress.tambon.value);

      form.reset(profile);
      pendingProfileForm.reset(pendingProfile);

      return {
        profile,
        pending_profile: pendingProfile,
      };
    },
    initialData: {},
    enabled: loggedIn,
  });

  const onSubmit = async (
    values: z.infer<typeof tutorProfileFormSchemaForUpdate>
  ) => {
    const requestValues = await toast.promise(
      uploadAllFiles(values),
      tutorController.getToastConfig("กำลังอัพโหลดไฟล์ทั้งหมด")
    );
    console.log("kbd requestValues", requestValues);
    if (!requestValues.accolade) {
      requestValues.accolade = undefined;
    }
    const request = convertFormDataToBackend(requestValues);
    await tutorController.UpdateProfile(request);
    router.push(pathName + "?" + removeSearchParam(searchParams, "edit"));
    setReadOnly(true);
    setPendingProfileReadOnly(true);
    refetch();
    reAuthenticate();
    scrollToTop();
  };

  return (
    <>
      {tutorData.pending_profile && (
        <EditProfileAlert
          setOpenPendingProfileDrawer={setOpenPendingProfileDrawer}
          comments={tutorData.pending_profile?.admin_comments}
          tutorProfile={tutorData.pending_profile}
        />
      )}
      <TutorProfileForm
        onSubmit={onSubmit}
        form={form}
        refetch={refetch}
        readOnly={readOnly}
        setReadOnly={setReadOnly}
        profilePage={true}
        header={readOnly ? "โปรไฟล์" : "แก้ไขโปรไฟล์"}
        loading={isFetching}
        allowEdit={!!!tutorData.pending_profile}
      />
      <Drawer
        width="80%"
        title="การแก้ไขโปรไฟล์ที่รอรีวิว"
        onClose={() => {
          setPendingProfileReadOnly(true);
          setOpenPendingProfileDrawer(false);
        }}
        open={openPendingProfileDrawer}
        style={{ zIndex: 2 }}
      >
        <div>
          <TutorProfileForm
            onSubmit={onSubmit}
            form={pendingProfileForm}
            refetch={refetch}
            readOnly={pendingProfileReadOnly}
            setReadOnly={setPendingProfileReadOnly}
            pendingEditPage={true}
            profilePage={true}
            header={
              pendingProfileReadOnly ? "โปรไฟล์รอรีวิว" : "แก้ไขโปรไฟล์รอรีวิว"
            }
            loading={isFetching}
            allowEdit={true}
          />
        </div>
      </Drawer>
    </>
  );
}

const EditProfileAlert = (props: any) => {
  if ((props.comments?.length ?? 0) === 0) {
    return (
      <div className="flex justify-center m-4">
        <Alert
          message={
            <>
              <div>
                คุณมีการแก้ไขโปรไฟล์ที่กำลังรอแอดมินรีวิว โปรดรอประมาณ 2-3
                วันทำการ คลิกที่ปุมด้านล่างเพื่อดูการแก้ไขของท่าน
                หรืออัพเดทการแก้ไขโปรไฟล์ของท่าน
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className={variantButtonClassName}
                  onClick={() => props.setOpenPendingProfileDrawer(true)}
                >
                  ดูการแก้ไข
                </Button>
              </div>
            </>
          }
          className="lg:w-[50%]"
          type="warning"
          showIcon
        />
      </div>
    );
  } else if (
    (getLatestComment(props.comments)?.created_at_ms ?? "0") <
    (props.tutorProfile?.updated_at_ms ?? "")
  ) {
    return (
      <div className="flex justify-center m-4">
        <Alert
          message={
            <>
              <div>
                คุณมีการแก้ไขโปรไฟล์ที่กำลังรอแอดมินรีวิว จาก comment ล่าสุด "
                {getLatestComment(props.comments)?.detail}" โปรดรอประมาณ 2-3
                วันทำการ คลิกที่ปุมด้านล่างเพื่อดูการแก้ไขของท่าน
                หรืออัพเดทการแก้ไขโปรไฟล์ของท่าน
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className={variantButtonClassName}
                  onClick={() => {
                    props.setOpenPendingProfileDrawer(true);
                  }}
                >
                  ดูโปรไฟล์เพื่อแก้ไข
                </Button>
              </div>
            </>
          }
          className="lg:w-[50%]"
          type="warning"
          showIcon
        />
      </div>
    );
  } else if ((props.comments?.length ?? 0) > 0) {
    return (
      <div className="flex justify-center m-4">
        <Alert
          message={
            <>
              <div>
                แอดมินได้รีวิวและ comment บนการแก้ไขโปรไฟล์ของคุณแล้ว: "
                {getLatestComment(props.comments)?.detail}"
                กรุณาแก้ไขโปรไฟล์อีกครั้ง
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className={variantButtonClassName}
                  onClick={() => {
                    props.setOpenPendingProfileDrawer(true);
                  }}
                >
                  ดูโปรไฟล์เพื่อแก้ไข
                </Button>
              </div>
            </>
          }
          className="lg:w-[50%]"
          type="warning"
          showIcon
        />
      </div>
    );
  } else {
    return <></>;
  }
};

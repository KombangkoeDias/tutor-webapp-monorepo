"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { tutorController } from "@/services/controller/tutor";

import _ from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoggedIn } from "@/components/hooks/login-context";
import { useEffect, useState } from "react";
import TutorProfileForm, {
  tutorProfileFormSchemaForSignUp,
} from "@/components/shared/profile";
import toast from "react-hot-toast";
import { convertFormDataToBackend } from "@/components/shared/form_data";
import { uploadAllFiles } from "@/components/shared/form_data";

export default function TutorRegistrationForm() {
  const router = useRouter();

  const { loggedIn } = useLoggedIn();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlSearchParams = useSearchParams();

  const code = urlSearchParams.get("utm_ref") ?? undefined;

  useEffect(() => {
    if (loggedIn) {
      router.push("/");
    }
  }, [loggedIn]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof tutorProfileFormSchemaForSignUp>>({
    resolver: zodResolver(tutorProfileFormSchemaForSignUp),
    mode: "onTouched",
    defaultValues: {
      title: undefined,
      name: undefined,
      surname: undefined,
      nickname: undefined,
      telephone: undefined,
      email: undefined,
      line_id: undefined,
      birthday: undefined,
      address: undefined,
      province: { label: undefined, value: undefined },
      amphoe: { label: undefined, value: undefined },
      tambon: { label: undefined, value: undefined },
      postcode: undefined,
      password: "",
      confirm_password: "",
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
      accept_terms_and_conditions: undefined,
      want_news_via_email: undefined,
    },
  });

  // form.watch((values) => {
  //   console.log("kbd", values);
  // });

  // 2. Define a submit handler.
  async function onSubmit(
    values: z.infer<typeof tutorProfileFormSchemaForSignUp>
  ) {
    setIsSubmitting(true);
    const requestValues = await toast.promise(
      uploadAllFiles(values),
      tutorController.getToastConfig("กำลังอัพโหลดไฟล์ทั้งหมด")
    );
    const signUpRequestBody = convertFormDataToBackend(requestValues);
    signUpRequestBody.referral_code = code;
    await tutorController.SignUp(signUpRequestBody).finally(() => {
      setIsSubmitting(false);
    });
    toast.success("ท่านได้สมัครติวเตอร์แล้ว กรุณาเข้าสู่ระบบ");
    router.push("/tutor/login");
  }

  return (
    <TutorProfileForm
      form={form}
      onSubmit={onSubmit}
      header={"สมัครติวเตอร์"}
      loading={false}
      isSubmitting={isSubmitting}
    />
  );
}

import { Form } from "@/components/ui/form";
import { Field } from "@/chulatutordream/components/shared/form-item";
import SelectField from "@/chulatutordream/components/shared/select";
import { Input } from "@/components/ui/input";
import {
  LabelComponent,
  RequiredLabel,
} from "@/chulatutordream/components/shared/label";
import { Label } from "../ui/label";
import { DatePickerComponent } from "@/chulatutordream/components/shared/date-picker";
import { TooltipComponent } from "@/chulatutordream/components/shared/tooltip";
import { Textarea } from "../ui/textarea";
import { EducationHistory } from "@/components/education-history";
import { Button } from "../ui/button";
import Select from "react-select";
import {
  Level1Options,
  variantButtonClassName,
} from "@/chulatutordream/lib/constants";
import {
  toReactSelectOptions,
  useSharedConstants,
} from "../hooks/constant-context";
import { useFieldArray } from "react-hook-form";
import { Skeleton, Alert } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { CheckCircle } from "lucide-react";
import ReadOnlyFormItem from "@/chulatutordream/components/shared/read-only-item";
import { getLatestComment } from "../hooks/login-context";
import { adminController } from "@/services/controller";
import toast from "react-hot-toast";
import { UploadFormSingle } from "@/chulatutordream/components/shared/upload_form";
import { UploadFormMulti } from "@/chulatutordream/components/shared/upload_form_multi";
import { motion } from "framer-motion";
import { AddressComponent } from "../form/address";
import ProfilePictureUploader from "@/chulatutordream/components/shared/profile_pic";

type TutorProfileFormProps = {
  form: any;
  refetch?: Function;
  onSubmit?: Function;
  readOnly?: boolean;
  setReadOnly?: Dispatch<SetStateAction<boolean>>;
  header: string;
  loading: boolean;
  adminComments: any[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  tutorId: number;
  pendingEditProfile: boolean;
  allowReview: boolean;
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TutorProfileForm({
  form,
  onSubmit = () => {},
  readOnly = false,
  loading,
  adminComments,
  setOpen,
  tutorId,
  refetch,
  pendingEditProfile = false,
  allowReview = true,
}: TutorProfileFormProps) {
  const { subjects } = useSharedConstants();

  const [comment, setComment] = useState("");

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "educational_background_list", // Name of the array
  });

  console.log(
    "kbd getLatestComment",
    adminComments,
    getLatestComment(adminComments)
  );

  return (
    <>
      {allowReview && (
        <Alert
          message={
            getLatestComment(adminComments)?.detail == undefined
              ? "ไม่มี admin comment ก่อนหน้า"
              : `admin comment ล่าสุด: ${
                  getLatestComment(adminComments)?.detail
                }`
          }
          showIcon
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-2xl font-semibold mb-8 p-4">
            ติวเตอร์: {form.getValues("name")} {form.getValues("surname")}{" "}
            &nbsp;{" "}
          </h1>

          {loading ? (
            <div className="space-y-6 mb-4">
              {" "}
              <Skeleton active />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <ProfilePictureUploader
                  onSave={(data) => {}}
                  defaultOriginalImage={
                    form.getValues("profile_pic_original") || undefined
                  }
                  defaultCropSettings={JSON.parse(
                    form.getValues("profile_pic_crop_setting") ?? "null"
                  )}
                  size="md"
                  readOnly={readOnly}
                  profilePage={false}
                />
              </div>
              <motion.div
                variants={fadeIn}
                className="mb-2 p-4 border-l-4 border-teal-200"
              >
                <h2 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                  ข้อมูลส่วนตัว
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Field
                    form={form}
                    label="คำนำหน้า"
                    required
                    name="title"
                    shadCNComponent={(field) => {
                      return (
                        <div className="w-full">
                          <SelectField
                            field={field}
                            placeholder="โปรดเลือกคำนำหน้า"
                            options={[
                              "นาย",
                              "นางสาว",
                              "เด็กชาย",
                              "เด็กหญิง",
                              "นาง",
                            ]}
                            mode="VALUE_ONLY"
                          />
                        </div>
                      );
                    }}
                    readOnly={readOnly}
                  />
                  <Field
                    form={form}
                    label="ชื่อ"
                    required
                    name="name"
                    shadCNComponent={(field) => {
                      return (
                        <Input
                          placeholder="โปรดกรอกชื่อ"
                          {...field}
                          className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                        />
                      );
                    }}
                    readOnly={readOnly}
                  />
                  <Field
                    form={form}
                    label="นามสกุล"
                    required
                    name="surname"
                    shadCNComponent={(field) => {
                      return (
                        <Input
                          placeholder="โปรดกรอกนามสกุล"
                          {...field}
                          className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                        />
                      );
                    }}
                    readOnly={readOnly}
                  />

                  <Field
                    form={form}
                    label="ชื่อเล่น"
                    required
                    name="nickname"
                    shadCNComponent={(field) => {
                      return (
                        <Input
                          placeholder="โปรดกรอกชื่อเล่น"
                          {...field}
                          className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                        />
                      );
                    }}
                    readOnly={readOnly}
                  />
                  <Field
                    form={form}
                    label="เบอร์มือถือ"
                    required
                    name="telephone"
                    shadCNComponent={(field) => {
                      return (
                        <Input
                          placeholder="โปรดกรอกเบอร์โทรศัพท์"
                          {...field}
                          className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                        />
                      );
                    }}
                    tooltip={
                      <TooltipComponent content="กรุณากรอกแต่เบอร์ตัวเลข 10 หลักเท่านั้น เช่น 0650631323 หากอยู่ต่างประเทศให้ใส่ country code ด้วย เช่น +65 93958849" />
                    }
                    readOnly={readOnly}
                  />
                  <Field
                    form={form}
                    label="อีเมล"
                    required
                    name="email"
                    shadCNComponent={(field) => {
                      return (
                        <Input
                          placeholder="กรุณาใส่อีเมล"
                          type="email"
                          {...field}
                          className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                        />
                      );
                    }}
                    readOnly={readOnly}
                  />
                  <Field
                    form={form}
                    label="ไลน์ ID"
                    required
                    name="line_id"
                    shadCNComponent={(field) => {
                      return (
                        <Input
                          placeholder="กรุณาใส่ line ID"
                          {...field}
                          className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                        />
                      );
                    }}
                    readOnly={readOnly}
                  />
                  <DatePickerComponent
                    required
                    name="birthday"
                    label="วันเกิด"
                    form={form}
                    placeholder="กรุณาเลือกวันเกิด"
                    readOnly={readOnly}
                  />
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="mb-2 p-4 border-l-4 border-teal-200"
              >
                <h2 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                  ที่อยู่
                </h2>
                <div className="grid grid-cols-1 gap-5">
                  <Field
                    form={form}
                    label="ที่อยู่ปัจจุบัน"
                    required
                    name="address"
                    shadCNComponent={(field) => {
                      return (
                        <Input
                          placeholder="กรุณากรอกที่อยู่"
                          {...field}
                          className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                        />
                      );
                    }}
                    readOnly={readOnly}
                  />
                </div>
                <div className="mt-4">
                  <AddressComponent form={form} readOnly={readOnly} />
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="mb-2 p-4 border-l-4 border-teal-200"
              >
                <h2 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                  เอกสารยืนยันตัวตน
                </h2>
                <div>
                  <RequiredLabel
                    readOnly={readOnly}
                    label={<Label className="text-teal-700">บัตรประชาชน</Label>}
                  />
                  <div className="border border-dashed border-teal-200 rounded-lg p-5 text-center bg-gray-50 hover:bg-white transition-colors">
                    <UploadFormSingle
                      form={form}
                      readOnly={readOnly}
                      description="กรุณาแนบบัตรประชาชน กรุณาขีดคร่อมภาพบัตร และเขียนว่า '#ใช้เพื่อสมัครติวเตอร์กับ Job Tutor Dream เท่านั้น#'"
                      name="id_card_img_file"
                      existingFileNamePath="id_card_img_original"
                      existingFileUrlPath="id_card_img"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="mb-2 p-4 border-l-4 border-teal-200"
              >
                <h2 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                  ประวัติการศึกษา
                </h2>

                {fields.map((field, index) => {
                  return (
                    <div
                      key={index}
                      className="mb-6 p-4 bg-white/80 rounded-lg border border-teal-100"
                    >
                      <EducationHistory
                        index={index}
                        onDelete={() => remove(index)}
                        form={form}
                        readOnly={readOnly}
                      />
                    </div>
                  );
                })}

                <div className="mt-6">
                  <RequiredLabel
                    readOnly={readOnly}
                    label={
                      <Label className="text-teal-700">หลักฐานการศึกษา</Label>
                    }
                  />
                  <div className="border border-dashed border-teal-200 rounded-lg p-5 text-center bg-gray-50 hover:bg-white transition-colors">
                    <UploadFormMulti
                      form={form}
                      readOnly={readOnly}
                      description="กรุณาแนบ บัตรนิสิตนักศึกษา /ทรานสคริปต์"
                      name="educational_cert_img_file"
                      existingFileNamesPath="educational_cert_img_original"
                      existingFileUrlsPath="educational_cert_img"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="mb-2 p-4 border-l-4 border-teal-200"
              >
                <h2 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                  ความถนัดในการสอน
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Field
                        form={form}
                        label="ระดับชั้น"
                        name="preferred_job_level_list"
                        required
                        shadCNComponent={(field) => {
                          return (
                            <div className="w-full">
                              <Select
                                menuPlacement="auto"
                                placeholder="กรุณาเลือกระดับชั้น (เลือกได้มากกว่า 1)"
                                {...field}
                                options={Level1Options}
                                isMulti
                                closeMenuOnSelect={false}
                                className="text-black"
                              />
                            </div>
                          );
                        }}
                        readOnly={readOnly}
                        customReadOnly={() => {
                          const value = form
                            ?.getValues("preferred_job_level_list")
                            ?.map((obj) => obj.label)
                            ?.join(", ");
                          return (
                            <ReadOnlyFormItem
                              form={form}
                              name="preferred_job_level_list"
                              value={value}
                            />
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Field
                        form={form}
                        label="วิชา"
                        name="preferred_job_subject_list"
                        required
                        shadCNComponent={(field) => {
                          return (
                            <div className="w-full">
                              <Select
                                menuPlacement="auto"
                                placeholder="กรุณาเลือกวิชา (เลือกได้มากกว่า 1)"
                                {...field}
                                options={toReactSelectOptions(subjects)}
                                isMulti
                                closeMenuOnSelect={false}
                                className="text-black"
                              />
                            </div>
                          );
                        }}
                        readOnly={readOnly}
                        customReadOnly={() => {
                          const value = form
                            ?.getValues("preferred_job_subject_list")
                            ?.map((obj) => obj.label)
                            ?.join(", ");
                          return (
                            <ReadOnlyFormItem
                              form={form}
                              name="preferred_job_subject_list"
                              value={value}
                            />
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Field
                      form={form}
                      label="รางวัล / ผลงาน / ประสบการณ์"
                      name="accolade"
                      shadCNComponent={(field) => {
                        return (
                          <Textarea
                            className="min-h-[100px] whitespace-pre bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                            placeholder="สอบได้ / ได้รับทุน / เคยสอนมาก่อน / นักเรียนทุน / ทำกิจกรรม 5 เดือน 3 ปี"
                            {...field}
                          />
                        );
                      }}
                      readOnly={readOnly}
                    />
                  </div>
                  <div>
                    <Label className="text-teal-700">ไฟล์คะแนนสอบ</Label>
                    <div className="border border-dashed border-teal-200 rounded-lg p-5 text-center bg-gray-50 hover:bg-white transition-colors">
                      <UploadFormMulti
                        form={form}
                        description="เช่น IELTS, TGAT, GAT/PAT, กสพท  (ถ้ามี)"
                        readOnly={readOnly}
                        name="accolade_cert_img_file"
                        existingFileNamesPath="accolade_cert_img_original"
                        existingFileUrlsPath="accolade_cert_img"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {allowReview && (
                <>
                  <div className="grid grid-cols-1">
                    <LabelComponent required={false} label={"Admin Comment"} />
                    <Textarea
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                    {comment && (
                      <Button
                        variant="outline"
                        onClick={async () => {
                          if (comment === "") {
                            toast.error("กรุณาใส่ comment ก่อนจะ add comment");
                            return;
                          }
                          await adminController.AddComment(
                            tutorId,
                            comment,
                            pendingEditProfile
                          );
                          setOpen(false);
                          refetch && refetch();
                        }}
                        className={variantButtonClassName}
                      >
                        Add Comment
                      </Button>
                    )}
                    {!comment && (
                      <Button
                        onClick={async () => {
                          await adminController.ApproveTutor(
                            tutorId,
                            pendingEditProfile
                          );
                          setOpen(false);
                          refetch && refetch();
                        }}
                        className="w-full bg-[#4CAF50] hover:bg-[#45a049]"
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </form>
      </Form>
    </>
  );
}

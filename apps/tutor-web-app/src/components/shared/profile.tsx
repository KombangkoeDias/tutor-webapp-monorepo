"use client"

import { Form } from "@/components/ui/form"
import { Field } from "@/components/shared/form-item"
import SelectField from "@/components/shared/select"
import { Input } from "@/components/ui/input"
import { RequiredLabel } from "./label"
import { Label } from "../ui/label"
import { DatePickerComponent } from "./date-picker"
import { TooltipComponent } from "./tooltip"
import { Textarea } from "../ui/textarea"
import { EducationHistory } from "../education-history"
import { Button } from "../ui/button"
import Select from "react-select"
import { Level1Options } from "@/lib/constants"
import { toReactSelectOptions, useSharedConstants } from "../hooks/constant-context"
import { Checkbox } from "../ui/checkbox"
import { useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Skeleton, type TourProps, Tour, Button as AntdButton, Modal, Alert, Popconfirm } from "antd"
import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { CheckCircle } from "lucide-react"
import { EditOutlined } from "@ant-design/icons"
import ReadOnlyFormItem from "./read-only-item"
import { useSearchParams } from "next/navigation"
import { scrollToTop } from "@/lib/utils"
import { useLoggedIn } from "../hooks/login-context"
import _ from "lodash"
import { UploadFormSingle } from "./upload_form"
import { UploadFormMulti } from "./upload_form_multi"
import toast from "react-hot-toast"
import { AddressComponent } from "../form/address"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion";
import ProfilePictureUploader from "./profile_pic"


// Add the following styles to your SelectField component
const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#2dd4bf" : "#99f6e4",
    boxShadow: state.isFocused ? "0 0 0 1px #2dd4bf" : "none",
    "&:hover": {
      borderColor: "#2dd4bf",
    },
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#14b8a6" : state.isFocused ? "#e6fffa" : null,
    color: state.isSelected ? "white" : "inherit",
    "&:hover": {
      backgroundColor: state.isSelected ? "#14b8a6" : "#e6fffa",
    },
  }),
}

const errorMessages = {
  title: "กรุณาเลือกคำนำหน้า",
  name: "กรุณากรอกชื่อของท่าน",
  surname: "กรุณากรอกนามสกุลของท่าน",
  nickname: "กรุณากรอกชื่อเล่นของท่าน",
  telephone: "กรุณากรอกเบอร์โทรศัพท์",
  email: "กรุณากรอกอีเมล",
  line_id: "กรุณากรอกไลน์ ID",
  birthday: "กรุณากรอกวันเกิด",
  address: "กรุณากรอกที่อยู่",
  province: "กรุณาเลือกจังหวัด",
  amphoe: "กรุณาเลือกอำเภอ",
  tambon: "กรุณาเลือกตำบล",
  password: "กรุณากรอกรหัสผ่าน",
  confirm_password: "กรุณายืนยันรหัสผ่าน",
  preferred_job_level_list: "กรุณาเลือกระดับชั้น",
  preferred_job_subject_list: "กรุณาเลือกวิชา",
  accept_terms_and_conditions: "กรุณาอ่านและยอมรับเงื่อนไขการให้บริการ",
}

export const schema = z.object({
  profile_pic_original: z.string({required_error: "กรุณาเลือกรูปโปรไฟล์"}).nonempty({message: "กรุณาเลือกรูปโปรไฟล์"}),
  profile_pic_crop_setting: z.string().optional(),
  profile_pic_original_url: z.string().optional().nullable(),

  title: z.enum(["นาย", "นางสาว", "นาง", "เด็กชาย", "เด็กหญิง"], {
    required_error: errorMessages.title,
  }),
  name: z.string({ required_error: errorMessages.name }).nonempty({ message: errorMessages.name }),
  surname: z.string({ required_error: errorMessages.surname }).nonempty({ message: errorMessages.surname }),
  nickname: z.string({ required_error: errorMessages.nickname }).nonempty({ message: errorMessages.nickname }),
  telephone: z
    .string({ required_error: errorMessages.telephone })
    .length(10, { message: "เบอร์โทรศัพท์ต้องมี 10 ตัวเลข" })
    .regex(/^0\d+$/, {
      message: "เบอร์โทรศัพท์ต้องประกอบด้วยตัวเลขเท่านั้น และ ต้องขึ้นต้นด้วยเลข 0",
    }),
  email: z.string({ required_error: errorMessages.email }).email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  line_id: z.string({ required_error: errorMessages.line_id }).nonempty({ message: errorMessages.line_id }),
  birthday: z.date({ required_error: errorMessages.birthday }),
  address: z.string({ required_error: errorMessages.address }).nonempty({ message: errorMessages.address }),
  province: z.object({ label: z.string(), value: z.string() }, { required_error: errorMessages.province }),
  amphoe: z.object({ label: z.string(), value: z.string() }, { required_error: errorMessages.amphoe }),
  tambon: z.object({ label: z.string(), value: z.string() }, { required_error: errorMessages.tambon }),
  postcode: z.string().optional(),
  id_card_img: z.string().optional(),
  id_card_img_file: z
    .instanceof(File, {
      message: "กรุณาเลือกไฟล์",
    })
    .optional()
    .nullable()
    .refine((file) => file?.size ?? 0 <= 5 * 1024 * 1024, {
      message: "ขนาดของไฟล์ต้องเล็กกว่า 5MB",
    }),
  id_card_img_original: z.string().optional().nullable(),
  educational_cert_img: z.array(z.string()).optional().nullable(),
  educational_cert_img_file: z
    .array(
      z
        .instanceof(File, {
          message: "กรุณาเลือกไฟล์",
        })
        .refine((file) => file?.size ?? 0 <= 5 * 1024 * 1024, {
          message: "ขนาดของไฟล์ต้องเล็กกว่า 5MB",
        }),
    )
    .optional(),
  educational_cert_img_original: z.array(z.string()).optional().nullable(),
  accolade_cert_img: z.array(z.string()).optional().nullable(),
  accolade_cert_img_file: z
    .array(
      z
        .instanceof(File, {
          message: "กรุณาเลือกไฟล์",
        })
        .optional()
        .refine((file) => file?.size ?? 0 <= 5 * 1024 * 1024, {
          message: "ขนาดของไฟล์ต้องเล็กกว่า 5MB",
        }),
    )
    .optional(),
  accolade_cert_img_original: z.array(z.string()).optional().nullable(),
  educational_background: z.string().optional(),
  educational_background_list: z
    .array(
      z.object({
        level: z.enum(["ประถม", "มัธยม", "ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก", "อื่นๆ"], {
          required_error: "กรุณาเลือกคำนำหน้า",
        }),
        school: z.string({ required_error: "กรุณากรอกสถานศึกษา" }).nonempty({ message: "กรุณากรอกสถานศึกษา" }),
        major: z
          .string({ required_error: "กรุณากรอกแผนกการเรียน/สาขา" })
          .nonempty({ message: "กรุณากรอกแผนกการเรียน/สาขา" }),
        gpa: z.string({ required_error: "กรุณากรอกเกรด" }).refine(
          (val) => {
            try {
              Number.parseFloat(val)
              return true
            } catch (err) {
              return false
            }
          },
          { message: "กรุณากรอกตัวเลข" },
        ),
      }),
    )
    .min(1, "กรุณากรอกประวัติการศึกษา"),
  preferred_job_level_list: z.array(z.object({ label: z.string(), value: z.string() }), {
    required_error: "กรุณาเลือกระดับชั้น",
  }),
  preferred_job_level: z.string().optional(),
  preferred_job_subject_list: z.array(z.object({ label: z.string(), value: z.string() }), {
    required_error: "กรุณาเลือกวิชา",
  }),
  preferred_job_subject: z
    .array(z.number().optional(), {
      required_error: "",
    })
    .optional(),
  accolade: z.string().nullable().optional(),
})

export const tutorProfileFormSchemaForUpdate = schema.refine(
  (values) => {
    return (values.educational_cert_img_file?.length ?? 0) + (values.educational_cert_img?.length ?? 0) > 0
  },
  { message: "กรุณาเลือกอย่างน้อย 1 ไฟล์", path: ["educational_cert_img_file"] },
)

// no need to choose file during update.
export const tutorProfileFormSchemaForSignUp = schema
  .extend({
    password: z.string({ required_error: errorMessages.password }).nonempty(errorMessages.password),
    confirm_password: z
      .string({ required_error: errorMessages.confirm_password })
      .nonempty(errorMessages.confirm_password),
    id_card_img_file: z
      .instanceof(File, {
        message: "กรุณาเลือกไฟล์",
      })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: "ขนาดของไฟล์ต้องเล็กกว่า 5MB",
      }),
    accept_terms_and_conditions: z
      .boolean({
        required_error: "กรุณาอ่านและยอมรับเงื่อนไขการให้บริการ",
      })
      .refine((val) => val, {
        message: "กรุณาอ่านและยอมรับเงื่อนไขการให้บริการ",
      }),
    want_news_via_email: z.boolean().optional(),
  })
  .refine(
    (values) => {
      return (values.educational_cert_img_file?.length ?? 0) + (values.educational_cert_img?.length ?? 0) > 0
    },
    { message: "กรุณาเลือกอย่างน้อย 1 ไฟล์", path: ["educational_cert_img_file"] },
  )

type TutorProfileFormProps = {
  form: any
  refetch?: Function
  onSubmit?: Function
  readOnly?: boolean
  setReadOnly?: Dispatch<SetStateAction<boolean>>
  pendingEditPage?: boolean
  profilePage?: boolean // hide certain fields on profile page
  header: string
  loading: boolean
  isSubmitting?: boolean
  allowEdit?: boolean
}

export default function TutorProfileForm({
  form,
  refetch,
  onSubmit = () => {},
  readOnly = false,
  setReadOnly,
  profilePage = false,
  pendingEditPage = false,
  header,
  loading,
  isSubmitting = false,
  allowEdit = true,
}: TutorProfileFormProps) {
  const { subjects, isLoadingSubjects } = useSharedConstants()
  const [openTermsAndConditionModal, setOpenTermsAndConditionModal] = useState(false)

  const [openEditTour, setOpenEditTour] = useState(false)
  const editButtonRef = useRef(null)
  const searchParams = useSearchParams()

  const { tutor } = useLoggedIn()

  const steps: TourProps["steps"] = [
    {
      title: "แก้ไขโปรไฟล์",
      description: "คลิกที่นี่เพื่อแก้ไขโปรไฟล์",
      target: () => editButtonRef.current,
      nextButtonProps: {
        children: ["ok"],
      },
    },
  ]

  useEffect(() => {
    if (searchParams.get("edit_tour") === "true") {
      setOpenEditTour(true)
    }
  }, [searchParams])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educational_background_list", // Name of the array
  })

  const onError = (formErrors: any) => {
    toast.error("กรุณาเลื่อนขึ้นไปด้านบนและกรอกข้อมูลให้ครบ")
    console.log("Zod Validation Errors:", formErrors)
  }

  // form.watch((values) => {
  //   console.log("kbd values", values)
  // })

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const debouncedSubmit = useCallback(
    _.debounce(async (values) => {
      await onSubmit(values)
    }, 1000),
    [],
  )

  return (
    <Form {...form}>
      {!pendingEditPage && allowEdit && (
        <Tour open={openEditTour} onClose={() => setOpenEditTour(false)} steps={steps} />
      )}
      {!readOnly && profilePage && (
        <div className="flex justify-center mb-6">
          <Alert
            className="lg:w-[50%]"
            message="การแก้ไขโปรไฟล์จะต้องได้รับการยืนยันจาก admin ก่อนที่โปรไฟล์ที่ถูกอัพเดทจะแสดงให้กับนักเรียน/ผู้ปกครอง ระหว่างที่รอแอดมินรีวิว ท่านสามารถจองงานได้ตามปกติ"
            type="warning"
            showIcon
          />
        </div>
      )}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
      <form className="max-w-4xl mx-auto p-4 md:p-6" onSubmit={form.handleSubmit(debouncedSubmit, onError)}>
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-teal-100">
          <h1 className="text-2xl font-bold text-teal-700">{header}</h1>
          {readOnly && allowEdit && (
            <button
              ref={editButtonRef}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                loading
                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                  : "cursor-pointer bg-teal-50 text-teal-700 hover:bg-teal-100",
              )}
              disabled={loading}
              onClick={() => {
                if (loading || !allowEdit) return
                if (setReadOnly) {
                  setReadOnly(false)
                }
              }}
            >
              <EditOutlined /> แก้ไข
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-6 mb-4">
            <Skeleton active />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col items-center">
              <ProfilePictureUploader
                onSave={(data) => {
                  form.setValue("profile_pic_original", data.originalImage)
                  form.setValue("profile_pic_crop_setting", JSON.stringify(data.cropSettings))
                }}
                defaultOriginalImage={form.getValues("profile_pic_original") || undefined}
                defaultCropSettings={JSON.parse(form.getValues("profile_pic_crop_setting") ?? "null")}
                size="xl"
                readOnly={readOnly}
                profilePage={profilePage}
              />
              {form.formState.errors["profile_pic_original"] && (
              <p className="text-red-500 text-sm mt-2">
                {form.formState.errors["profile_pic_original"].message as string}
              </p>
            )}
            </div>
            <motion.div variants={fadeIn} className="mb-2 p-4 border-l-4 border-teal-200">
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
                          options={["นาย", "นางสาว", "เด็กชาย", "เด็กหญิง", "นาง"]}
                          mode="VALUE_ONLY"
                          isDisabled={profilePage && tutor?.admin_verified}
                          selectStyles={selectStyles}
                        />
                      </div>
                    )
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
                    )
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
                    )
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
                    )
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
                    )
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
                        disabled={profilePage}
                        placeholder="กรุณาใส่อีเมล"
                        type="email"
                        {...field}
                        className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                      />
                    )
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
                    )
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
                  profilePage={profilePage}
                  selectStyles={selectStyles}
                  className="border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  popOverDisabled={profilePage && tutor?.admin_verified}
                />
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-2 p-4 border-l-4 border-teal-200">
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
                    )
                  }}
                  readOnly={readOnly}
                />
              </div>
              <div className="mt-4">
                <AddressComponent form={form} readOnly={readOnly} selectStylesProps={selectStyles}/>
              </div>
            </motion.div>

            {!profilePage && (
              <motion.div variants={fadeIn} className="mb-2 p-4 border-l-4 border-teal-200">
                <h2 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                  รหัสผ่าน
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field
                    form={form}
                    label="รหัสผ่าน"
                    required
                    name="password"
                    shadCNComponent={({ onChange, ...field }) => {
                      return (
                        <Input
                          type="password"
                          placeholder="กรุณากรอกรหัสผ่าน"
                          onChange={(e) => {
                            const data = form.getValues()
                            if (e.target.value !== data.confirm_password) {
                              form.setError("confirm_password", {
                                message: "รหัสผ่านไม่ตรงกัน",
                              })
                            } else {
                              form.clearErrors("confirm_password")
                            }
                            form.setValue("password", e.target.value)
                          }}
                          {...field}
                          className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                        />
                      )
                    }}
                  />
                  <Field
                    form={form}
                    label="ยืนยันรหัสผ่าน"
                    required
                    name="confirm_password"
                    shadCNComponent={({ onChange, ...field }) => {
                      return (
                        <Input
                          onChange={(e) => {
                            const data = form.getValues()
                            if (e.target.value !== data.password) {
                              form.setError("confirm_password", { message: "รหัสผ่านไม่ตรงกัน" }, { shouldFocus: true })
                            } else {
                              form.clearErrors("confirm_password")
                            }
                            form.setValue("confirm_password", e.target.value)
                          }}
                          type="password"
                          placeholder="กรุณายืนยันรหัสผ่าน"
                          {...field}
                          className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                        />
                      )
                    }}
                  />
                </div>
              </motion.div>
            )}

            <motion.div variants={fadeIn} className="mb-2 p-4 border-l-4 border-teal-200">
              <h2 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                เอกสารยืนยันตัวตน
              </h2>
              <div>
                <RequiredLabel readOnly={readOnly} label={<Label className="text-teal-700">บัตรประชาชน</Label>} />
                <div className="border border-dashed border-teal-200 rounded-lg p-5 text-center bg-gray-50 hover:bg-white transition-colors">
                  <UploadFormSingle
                    form={form}
                    readOnly={readOnly}
                    description="กรุณาแนบบัตรประชาชน กรุณาขีดคร่อมภาพบัตร และเขียนว่า '#ใช้เพื่อสมัครติวเตอร์กับ Chula Tutor Dream เท่านั้น#'"
                    name="id_card_img_file"
                    existingFileNamePath="id_card_img_original"
                    existingFileUrlPath="id_card_img"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-2 p-4 border-l-4 border-teal-200">
              <h2 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                ประวัติการศึกษา
              </h2>

              {fields.map((field, index) => {
                return (
                  <div key={index} className="mb-6 p-4 bg-white/80 rounded-lg border border-teal-100">
                    <EducationHistory index={index} onDelete={() => remove(index)} form={form} readOnly={readOnly} selectStyles={selectStyles} />
                  </div>
                )
              })}

              {!readOnly && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({})}
                  className="w-full mt-4 border-teal-300 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
                >
                  + เพิ่มประวัติการศึกษา
                </Button>
              )}

              <div className="mt-6">
                <RequiredLabel readOnly={readOnly} label={<Label className="text-teal-700">หลักฐานการศึกษา</Label>} />
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

            <motion.div variants={fadeIn} className="mb-2 p-4 border-l-4 border-teal-200">
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
                              styles={selectStyles}
                            />
                          </div>
                        )
                      }}
                      readOnly={readOnly}
                      customReadOnly={() => {
                        const value = form
                          ?.getValues("preferred_job_level_list")
                          ?.map((obj) => obj.label)
                          ?.join(", ")
                        return <ReadOnlyFormItem form={form} name="preferred_job_level_list" value={value} />
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
                              isLoading={isLoadingSubjects}
                              menuPlacement="auto"
                              placeholder="กรุณาเลือกวิชา (เลือกได้มากกว่า 1)"
                              {...field}
                              options={toReactSelectOptions(subjects)}
                              isMulti
                              closeMenuOnSelect={false}
                              className="text-black"
                              styles={selectStyles}
                            />
                          </div>
                        )
                      }}
                      readOnly={readOnly}
                      customReadOnly={() => {
                        const value = form
                          ?.getValues("preferred_job_subject_list")
                          ?.map((obj) => obj.label)
                          ?.join(", ")
                        return <ReadOnlyFormItem form={form} name="preferred_job_subject_list" value={value} />
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
                      )
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

            {!profilePage && (
              <motion.div variants={fadeIn} className="mb-2 p-4 border-l-4 border-teal-200">
                <h2 className="text-lg font-semibold text-teal-700 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-500" />
                  ข้อตกลงและเงื่อนไข
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Field
                      form={form}
                      name="accept_terms_and_conditions"
                      shadCNComponent={(field) => {
                        return (
                          <>
                            <Checkbox
                              id="terms"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-teal-400 data-[state=checked]:bg-teal-600"
                            />
                            &nbsp;
                            <label htmlFor="terms" className="text-sm">
                              ยอมรับ
                            </label>
                             &nbsp;
                            <span
                              className="text-teal-600 font-medium cursor-pointer hover:underline"
                              onClick={() => {
                                setOpenTermsAndConditionModal(true)
                              }}
                            >
                               เงื่อนไขการใช้บริการ <span className="text-red-500">*</span>
                            </span>
                          </>
                        )
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Field
                      form={form}
                      name="want_news_via_email"
                      shadCNComponent={(field) => {
                        return (
                          <>
                            <Checkbox
                              id="want_news_via_email"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-teal-400 data-[state=checked]:bg-teal-600"
                            />{" "}
                            <label htmlFor="want_news_via_email" className="text-sm">
                              ยินยอมรับแจ้งเตือนงานใหม่ผ่านอีเมล
                            </label>
                          </>
                        )
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {!readOnly && (
              <div className={`grid ${profilePage ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                {profilePage && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setReadOnly && setReadOnly(true)
                        refetch && refetch()
                        scrollToTop()
                      }}
                      className="w-full border-teal-300 text-teal-700 hover:bg-teal-50"
                    >
                      ยกเลิก
                    </Button>
                    <Popconfirm
                      title="ยืนยันการแก้ไขโปรไฟล์"
                      description="คุณต้องการแก้ไขโปรไฟล์หรือไม่"
                      onConfirm={form.handleSubmit(debouncedSubmit, onError)}
                      okButtonProps={{
                        htmlType: "submit",
                        disabled: isSubmitting,
                        className: "!bg-emerald-500 !hover:bg-emerald-600",
                      }}
                      okText="ยืนยัน"
                      cancelText="ยกเลิก"
                    >
                      <AntdButton
                        disabled={isSubmitting}
                        className="w-full h-full !bg-gradient-to-r !from-teal-500 !to-emerald-500 !text-white !border-none !shadow-md !hover:shadow-lg !transition-all"
                      >
                        บันทึก
                      </AntdButton>
                    </Popconfirm>
                  </>
                )}
                {!profilePage && (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </form>
      </motion.div>
      <TermsAndConditionsModal isOpen={openTermsAndConditionModal} setIsOpen={setOpenTermsAndConditionModal} />
    </Form>
  )
}

const TermsAndConditionsModal = (props: any) => {
  return (
    <Modal
      title={<span className="text-teal-700 font-bold">เงื่อนไขการใช้บริการ</span>}
      open={props.isOpen}
      onOk={() => props.setIsOpen(false)}
      cancelButtonProps={{ hidden: true }}
      onCancel={() => props.setIsOpen(false)}
      width={"50%"}
      okButtonProps={{
        className: "!bg-teal-500 !hover:bg-teal-600",
      }}
    >
      <div className="overflow-y-auto max-h-[60vh] p-4 bg-teal-50 rounded-lg">
        <p className="space-y-4 text-gray-700">
          <b className="text-teal-700">1.</b> ในกรณีที่น้องเรียนไม่ครบค่าแนะนำ ทางเรายินดีคืนค่าแนะนำให้ดังต่อไปนี้ <br />
          เช่น กรณีโอนค่าแนะนำการสอนมาเท่ากับค่าสอน 3 ชั่วโมง สอนไป 1 ชั่วโมง จะคืนค่าแนะนำ ดังนี้คือ <br /> <br />- 2 ชั่วโมงที่ยังไม่ได้สอน
          >> คืนค่าแนะนำ <br /> <br />- 1 ชั่วโมงที่ติวเตอร์สอนและได้เงินไปแล้ว >> เราแบ่งคนละครึ่งกับติวเตอร์ โดยเราจะคืนค่าแนะนำให้ 0.5
          เท่าของส่วนนี้ เพื่อให้ติวเตอร์ไม่ขาดทุนและมีกำลังใจในการสอนต่อไป >> คืนค่าแนะนำ 0.5 ชั่วโมง รวมกรณีนี้ คืนค่าแนะนำ 2.5 ชั่วโมง <br />{" "}
          <br />
          <br />
          <b className="text-teal-700">2.</b> การเสนอราคาและการคืนเงิน <br /> <br />
          <b className="text-teal-700">2.1</b> ติวเตอร์สามารถเสนอราคาสูงขึ้นจากที่ผู้ปกครองกำหนดได้ เช่น ผู้ปกครองเสนอค่าสอนชั่วโมงละ
          350 บาท ติวเตอร์สามารถเสนอได้ชม.ละ 500 บาท เป็นต้น หรือจะสามารถเสนอราคาต่ำกว่าที่ผู้ปกครองเสนอ เช่น ผู้ปกครองเสนอค่าสอนชั่วโมงละ
          350 บาท ติวเตอร์สามารถเสนอ ชั่วโมงละ 100 บาทก็ได้ <br /> <br />
          <b className="text-teal-700">2.2</b> หากผู้ปกครองตอบรับค่าสอนที่สูงกว่าราคาที่ผู้ปกครองกำหนดในตอนแรก ค่าแนะนำจะเป็น 1.5
          เท่าคูณด้วยอัตราค่าสอนที่ตกลงต่อครั้ง ไม่ใช่จากราคาเดิมที่ผู้ปกครองเสนอ
          แต่หากผู้ปกครองตอบรับค่าสอนในอัตราที่ต่ำกว่าค่าสอนที่ผู้ปกครองเสนอในตอนแรก ค่าแนะนำจะเป็นคำนวณจากราคาเดิมที่ผู้ปกครองเสนอ
          ไม่ใช่จากราคาที่ต่ำกว่า ตัวอย่างเช่น สอนวันเสาร์ ครั้งละ 2 ชั่วโมง 500 บาท ปกติจะค่าแนะนำเป็น 750 บาท
          หากผู้ปกครองยอมรับราคาที่ติวเตอร์เสนอ เป็น 2 ชั่วโมง 1,000 บาท ค่าแนะนำจะเป็น 1,500 บาท (1.5 เท่าของรายได้ที่ได้ต่อสัปดาห์)
          แต่หากติวเตอร์เสนอ 2 ชั่วโมง 200 บาท ค่าแนะนำจะเป็น 750 บาท เช่นเดิม เนื่องจากติวเตอร์มีการเสนอราคาที่ต่ำกว่าที่กำหนด
          ซึ่งทางแพลตฟอร์มขอแนะนำให้ติวเตอร์ไม่ตั้งราคาต่ำกว่าที่ผู้ปกครองกำหนด เพื่อประโยชน์ของทางติวเตอร์เอง
          <br /> <br />
          <b className="text-teal-700">3.</b> หากรับงานแล้วนำไปขายต่อหรือมอบหมายให้ผู้อื่นสอนโดยไม่ได้แจ้งทางศูนย์
          ทางศูนย์ขอสงวนสิทธิ์ในการยกเลิกสถานะติวเตอร์ของท่าน และจะไม่รับผิดชอบต่อปัญหาที่อาจเกิดขึ้นในทุกกรณี <br /> <br />
          <b className="text-teal-700">4.</b> หากผู้ปกครองยกเลิกการเรียนเนื่องจากติวเตอร์ขาดความรับผิดชอบ เช่น ไปสอนสาย ติดต่อยาก
          ขาดการเตรียมตัว ประพฤติตัวไม่เหมาะสม หรือขาดสอนโดยไม่แจ้งล่วงหน้า ทางศูนย์ขออนุญาตหักค่าแนะนำ 50% ของค่าแนะนำทั้งหมด <br />{" "}
          <br />
          <b className="text-teal-700">5.</b> หากติวเตอร์รับงานไปแล้วแต่ไม่สามารถสอนได้ตามวัน เวลา หรือสถานที่ที่ระบุไว้
          เนื่องจากตรวจสอบรายละเอียดผิดพลาด ทางศูนย์ขออนุญาตหักค่าแนะนำ 30% ของค่าแนะนำทั้งหมด <br /> <br />
          <b className="text-teal-700">6.</b> หลังติวเตอร์จ่ายเงินค่าแนะนำแล้ว ระบบจะส่งเบอร์โทรผู้ปกครองให้ทาง Account
          ในเว็บของติวเตอร์ทันที พร้อมทั้งส่งเมลแจ้งเตือนท่านและผู้ปกครองด้วย ขอให้ติวเตอร์รีบทำการต่อผู้ปกครองทันที
          หากติวเตอร์ติดต่อช้ากว่านั้นและผู้ปกครองได้ติวเตอร์จากที่อื่นแล้ว ทางศูนย์ขออนุญาตหักค่าแนะนำ 25% ของค่าแนะนำทั้งหมดเป็นค่าบริการ <br />{" "}
          <br />
          <b className="text-teal-700">7.</b> ไม่อนุญาตให้เก็บค่าสอนล่วงหน้ากับนักเรียนหรือผู้ปกครองไม่ว่ากรณีใดๆ <br /> <br />
        </p>
      </div>
    </Modal>
  )
}



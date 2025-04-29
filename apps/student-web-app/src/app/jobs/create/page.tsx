"use client";

import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useCallback, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Field } from "@/chulatutordream/components/shared/form-item";
import SelectField from "@/chulatutordream/components/shared/select";
import _ from "lodash";
import Select from "react-select";
import { DatePickerComponent } from "@/chulatutordream/components/shared/date-picker";
import { TooltipComponent } from "@/chulatutordream/components/shared/tooltip";
import { jobController } from "@/chulatutordream/services/controller/job";
import { useSharedConstants } from "@/chulatutordream/components/hooks/constant-context";
import { Input } from "@/components/ui/input";
import { Checkbox, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";

const errMsg = {
  name: "กรุณากรอกชื่อของท่าน",
  surname: "กรุณากรอกนามสกุลของท่าน",
  subjectsId: "กรุณาเลือกวิชา",
  note: "กรุณากรอกเรื่อง/หัวข้อที่ต้องการเรียน",
  fundamental: "กรุณาเลือกพื้นฐาน",
  level1: "กรุณาเลือกระดับชั้น",
  want_to_learn_level1: "กรุณากรอกระดับชั้นที่ต้องการเรียน",
  learn_language: "กรุณากรอกภาษาที่ต้องการให้ติวเตอร์ใช้สอน",
  learner_number: "กรุณาระบุจำนวนผู้เรียน",
  school: "กรุณากรอกโรงเรียน/มหาวิทยาลัย",
  available_date_time: "กรุณากรอกวันและเวลาที่สะดวก",
  starting_date: "กรุณาเลือกวันที่ต้องการเริ่มเรียน",
  session_count_per_week: "กรุณากรอกจำนวนครั้งที่ต้องการเรียนต่อสัปดาห์",
  total_session_count: "กรุณากรอกจำนวนครั้งที่ต้องการเรียนทั้งหมด",
  hours_per_session: "กรุณากรอกจำนวนชั่วโมงต่อการเรียนหนึ่งครั้ง",
  location: "กรุณากรอกสถานที่เรียน",
  fee: "กรุณากรอกค่าเรียนที่ต้องการ",
  contact_preference: "กรุณาเลือกช่องทางติดต่อ",
};

const formSchema = z.object({
  name: z
    .string({ required_error: errMsg.name })
    .nonempty({ message: errMsg.name }),
  surname: z
    .string({ required_error: errMsg.surname })
    .nonempty({ message: errMsg.surname }),
  nickname: z.string().optional(),
  subject: z.object(
    { label: z.string(), value: z.string() },
    { required_error: errMsg.subjectsId }
  ),
  note: z
    .string({ required_error: errMsg.note })
    .nonempty({ message: errMsg.note }),
  fundamental: z
    .string({ required_error: errMsg.fundamental })
    .nonempty({ message: errMsg.fundamental }),
  level1: z
    .string({ required_error: errMsg.level1 })
    .nonempty({ message: errMsg.level1 }),
  level2: z
    .object({ label: z.string(), value: z.number() })
    .optional()
    .nullable(),
  want_to_learn_level1: z
    .string({
      required_error: errMsg.want_to_learn_level1,
    })
    .nonempty({ message: errMsg.want_to_learn_level1 }),
  want_to_learn_level2: z
    .object({ label: z.string(), value: z.number() })
    .optional()
    .nullable(),
  learn_language: z
    .string({ required_error: errMsg.learn_language })
    .nonempty({ message: errMsg.learn_language }),
  learner_number: z
    .string({ required_error: errMsg.learner_number })
    .nonempty({ message: errMsg.learner_number }),
  school: z
    .string({ required_error: errMsg.school })
    .nonempty({ message: errMsg.school }),
  available_date_time: z
    .string({
      required_error: errMsg.available_date_time,
    })
    .nonempty({ message: errMsg.available_date_time }),
  starting_date: z.date({
    required_error: errMsg.starting_date,
  }),
  session_count_per_week: z
    .string({
      required_error: errMsg.session_count_per_week,
    })
    .nonempty({ message: errMsg.session_count_per_week }),
  total_session_count: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    { message: errMsg.total_session_count }
  ),
  hours_per_session: z
    .string({
      required_error: errMsg.hours_per_session,
    })
    .nonempty({ message: errMsg.hours_per_session }),
  location: z
    .string({ required_error: errMsg.location })
    .nonempty({ message: errMsg.location }),
  online: z.boolean(),
  fee: z
    .string({ required_error: errMsg.fee })
    .nonempty({ message: errMsg.fee }),
  additional_info: z.string().optional(),
  contact_preference: z.array(
    z.object({ label: z.string(), value: z.string() }),
    {
      required_error: errMsg.contact_preference,
    }
  ),
  phone: z
    .string({ required_error: "กรุณากรอกเบอร์โทรศัพท์" })
    .length(10, { message: "เบอร์โทรศัพท์ต้องมี 10 ตัวเลข" })
    .regex(/^0\d+$/, {
      message:
        "เบอร์โทรศัพท์ต้องประกอบด้วยตัวเลขเท่านั้น และ ต้องขึ้นต้นด้วยเลข 0",
    })
    .optional(),
  creator_email: z
    .string({ required_error: "กรุณากรอกอีเมล" })
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  line_id: z.string({ required_error: "กรุณากรอกไลน์ ID" }),
  tags: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
});

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const selectStyles = {
  control: (base) => ({
    ...base,
    borderColor: "#f9a8d4",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#ec4899",
    },
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#fce7f3",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#be185d",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#be185d",
    "&:hover": {
      backgroundColor: "#fbcfe8",
      color: "#9d174d",
    },
  }),
};

function JobCreationForm() {
  const tokenRef = useRef<string | null>(null);
  const urlSearchParams = useSearchParams();

  const code = urlSearchParams.get("utm_ref") ?? undefined;
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [level2Options, setLevel2Options] = useState<any[]>([]);
  const [wantToLearnLevel2Options, setWantToLearnLevel2Options] = useState<
    any[]
  >([]);
  const [disableLocation, setDisableLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      name: undefined,
      surname: undefined,
      nickname: undefined,
      subject: undefined,
      note: undefined,
      fundamental: undefined,
      level1: undefined,
      level2: undefined,
      want_to_learn_level1: undefined,
      want_to_learn_level2: undefined,
      learner_number: undefined,
      school: undefined,
      available_date_time: undefined,
      starting_date: undefined,
      session_count_per_week: undefined,
      hours_per_session: undefined,
      total_session_count: undefined,
      location: undefined,
      online: false,
      fee: undefined,
      additional_info: undefined,
      contact_preference: undefined,
      phone: undefined,
      creator_email: undefined,
      line_id: undefined,
      tags: undefined,
    },
  });

  form.watch((values) => {
    console.log("kbd values", values);
  });

  const contact_preference = useWatch({
    control: form.control,
    name: "contact_preference",
  });

  const { subjects, tags, isLoadingTags } = useSharedConstants();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>, token: string) {
    setIsLoading(true);
    let requestBody = _.cloneDeep(values);
    const numberFields = [
      "fee",
      "hours_per_session",
      "learner_number",
      "session_count_per_week",
    ];

    for (const fieldName of numberFields) {
      // @ts-expect-error
      if (
        Number.parseFloat(values[fieldName]) ==
        Number.parseInt(values[fieldName])
      ) {
        // only use == here.
        // it's Int
        // @ts-expect-error
        requestBody[fieldName] = Number.parseInt(values[fieldName]);
        continue;
      }
      // @ts-expect-error
      requestBody[fieldName] = Number.parseFloat(values[fieldName]);
      // @ts-expect-error
      requestBody[fieldName] = isNaN(requestBody[fieldName])
        ? undefined
        : // @ts-expect-error
          requestBody[fieldName];
    }
    // @ts-expect-error
    requestBody.contact_preference = requestBody.contact_preference
      .map((it) => it.value)
      .join(",");
    // @ts-expect-error
    requestBody.tags = requestBody.tags?.map((tag) =>
      Number.parseInt(tag.value)
    );
    // @ts-expect-error
    requestBody.subjectsId = Number.parseInt(requestBody.subject.value);
    requestBody.level2 = requestBody.level2?.value;
    requestBody.want_to_learn_level2 = requestBody.want_to_learn_level2?.value;

    requestBody.total_session_count = Number.parseInt(
      requestBody.total_session_count.value
    );
    requestBody.token = token;
    requestBody.referral_code = code;
    requestBody = _.omit(requestBody, ["subject"]);
    await jobController.CreateJob(requestBody).finally(() => {
      setIsLoading(false);
    });
  }

  const debouncedSubmit = useCallback(
    _.debounce(async (values) => {
      if (!tokenRef.current) return;
      await onSubmit(values, tokenRef.current);
      setShowSuccessModal(true);
    }, 1000),
    []
  );

  return (
    <Form {...form}>
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
        className="bg-gradient-to-br from-pink-50 to-white min-h-screen py-8"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!executeRecaptcha) {
              return;
            }
            const token = await executeRecaptcha();
            tokenRef.current = token;
            await form.handleSubmit(debouncedSubmit, (error) => {
              console.log("form validation error", error);
            })(e);
          }}
          className="max-w-3xl mx-auto mb-4 px-4 sm:px-6"
        >
          <motion.div variants={fadeIn} className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-2 bg-pink-100 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-pink-500" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              กรอกข้อมูลผู้เรียน
            </h1>
            <p className="text-gray-500 mt-2">
              เพื่อให้เราจัดหาติวเตอร์ที่เหมาะสมที่สุดสำหรับคุณ
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              variants={fadeIn}
              className="bg-white rounded-xl shadow-lg p-6 border border-pink-100"
            >
              <div className="flex items-center mb-4">
                <Heart className="h-5 w-5 text-pink-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">
                  ข้อมูลส่วนตัว
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
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
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />

                <Field
                  form={form}
                  label="ชื่อเล่น"
                  name="nickname"
                  shadCNComponent={(field) => {
                    return (
                      <Input
                        placeholder="โปรดกรอกชื่อเล่น"
                        {...field}
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
                <Field
                  form={form}
                  label="อีเมล"
                  required
                  name="creator_email"
                  description="เราจะส่ง list ของติวเตอร์ไปทางอีเมลนี้ เพื่อให้ท่านเลือกเมื่อติวเตอร์มาสมัครงานแล้ว"
                  shadCNComponent={(field) => {
                    return (
                      <Input
                        type="email"
                        placeholder="กรุณาระบุอีเมล"
                        {...field}
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
                <Field
                  form={form}
                  label="Line ID"
                  required
                  name="line_id"
                  description="หากมีความจำเป็น แอดมิน จะติดต่อท่านผ่าน line id"
                  shadCNComponent={(field) => {
                    return (
                      <Input
                        placeholder="กรุณาระบุไลน์ ID"
                        {...field}
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white rounded-xl shadow-lg p-6 border border-pink-100"
            >
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-pink-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">
                  ข้อมูลการเรียน
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field
                  form={form}
                  label="วิชา"
                  name="subject"
                  required
                  shadCNComponent={(field) => {
                    return (
                      <div className="w-full max-w-sm">
                        <SelectField
                          placeholder="กรุณาเลือกวิชา"
                          field={field}
                          options={Object.entries(subjects).map(
                            ([key, value]) => ({
                              label: value,
                              value: key.toString(),
                            })
                          )}
                          className="border-pink-200"
                          selectStyles={selectStyles}
                        />
                      </div>
                    );
                  }}
                />
                <Field
                  form={form}
                  label="เรื่อง/หัวข้อที่เรียน+วัตถุประสงค์"
                  required
                  name="note"
                  shadCNComponent={(field) => {
                    return (
                      <Textarea
                        placeholder="เช่น 'เวกเตอร์ ม.5'/'สอบเข้ามหาลัย'"
                        {...field}
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
                <Field
                  form={form}
                  label="ต้องการให้ติวเตอร์สอนเป็นภาษา"
                  required
                  name="learn_language"
                  shadCNComponent={(field) => {
                    return (
                      <div className="w-full max-w-sm">
                        <SelectField
                          placeholder="กรุณาเลือกพื้นฐาน"
                          field={field}
                          options={["ไทย", "อังกฤษ", "จีน"]}
                          className="border-pink-200"
                          mode="VALUE_ONLY"
                          selectStyles={selectStyles}
                        />
                      </div>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <Field
                  form={form}
                  label="ระดับชั้น"
                  required
                  name="level1"
                  description="ระดับชั้นที่กำลังศึกษา"
                  shadCNComponent={({ onChange, ...field }) => {
                    return (
                      <SelectField
                        placeholder="กรุณาเลือกระดับชั้น"
                        field={{
                          ...field,
                          onChange: (value: any) => {
                            onChange(value);
                            if (value === "ประถม") {
                              setLevel2Options([
                                { label: "ป.1", value: 1 },
                                { label: "ป.2", value: 2 },
                                { label: "ป.3", value: 3 },
                                { label: "ป.4", value: 4 },
                                { label: "ป.5", value: 5 },
                                { label: "ป.6", value: 6 },
                              ]);
                            } else if (value === "มัธยมต้น") {
                              setLevel2Options([
                                { label: "ม.1", value: 1 },
                                { label: "ม.2", value: 2 },
                                { label: "ม.3", value: 3 },
                              ]);
                            } else if (value === "มัธยมปลาย") {
                              setLevel2Options([
                                { label: "ม.4", value: 4 },
                                { label: "ม.5", value: 5 },
                                { label: "ม.6", value: 6 },
                              ]);
                            } else {
                              setLevel2Options([]);
                            }
                            onChange(value);
                          },
                        }}
                        options={[
                          "ก่อนอนุบาล",
                          "อนุบาล",
                          "ประถม",
                          "มัธยมต้น",
                          "มัธยมปลาย",
                          "มหาลัย",
                          "วัยทำงาน",
                        ]}
                        className="border-pink-200"
                        mode="VALUE_ONLY"
                        selectStyles={selectStyles}
                      />
                    );
                  }}
                />
                {level2Options.length > 0 ? (
                  <Field
                    form={form}
                    label="ชั้น"
                    required
                    name="level2"
                    shadCNComponent={(field) => {
                      return (
                        <SelectField
                          placeholder="กรุณาเลือกระดับชั้น"
                          field={field}
                          options={level2Options}
                          className="border-pink-200"
                          selectStyles={selectStyles}
                        />
                      );
                    }}
                  />
                ) : (
                  <div className="space-x"></div>
                )}
                <Field
                  form={form}
                  label="ระดับชั้นที่ต้องการเรียน"
                  required
                  name="want_to_learn_level1"
                  shadCNComponent={({ onChange, ...field }) => {
                    return (
                      <SelectField
                        placeholder="กรุณาเลือกระดับชั้น"
                        field={{
                          ...field,
                          onChange: (value: any) => {
                            onChange(value);
                            if (value === "ประถม") {
                              setWantToLearnLevel2Options([
                                { label: "ป.1", value: 1 },
                                { label: "ป.2", value: 2 },
                                { label: "ป.3", value: 3 },
                                { label: "ป.4", value: 4 },
                                { label: "ป.5", value: 5 },
                                { label: "ป.6", value: 6 },
                              ]);
                            } else if (value === "มัธยมต้น") {
                              setWantToLearnLevel2Options([
                                { label: "ม.1", value: 1 },
                                { label: "ม.2", value: 2 },
                                { label: "ม.3", value: 3 },
                              ]);
                            } else if (value === "มัธยมปลาย") {
                              setWantToLearnLevel2Options([
                                { label: "ม.4", value: 4 },
                                { label: "ม.5", value: 5 },
                                { label: "ม.6", value: 6 },
                              ]);
                            } else {
                              setWantToLearnLevel2Options([]);
                            }
                            onChange(value);
                          },
                        }}
                        options={[
                          "ก่อนอนุบาล",
                          "อนุบาล",
                          "ประถม",
                          "มัธยมต้น",
                          "มัธยมปลาย",
                          "มหาลัย",
                          "วัยทำงาน",
                        ]}
                        className="border-pink-200"
                        mode="VALUE_ONLY"
                        selectStyles={selectStyles}
                      />
                    );
                  }}
                />
                {wantToLearnLevel2Options.length > 0 ? (
                  <Field
                    form={form}
                    label="ชั้นที่ต้องการเรียน"
                    required
                    name="want_to_learn_level2"
                    shadCNComponent={(field) => {
                      return (
                        <SelectField
                          placeholder="กรุณาเลือกระดับชั้น"
                          field={field}
                          options={wantToLearnLevel2Options}
                          className="border-pink-200"
                          selectStyles={selectStyles}
                        />
                      );
                    }}
                  />
                ) : (
                  <div className="space-x"></div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Field
                  form={form}
                  label="จำนวนผู้เรียน"
                  required
                  name="learner_number"
                  shadCNComponent={(field) => {
                    return (
                      <Input
                        type="number"
                        {...field}
                        min={1}
                        step={1}
                        placeholder="กรุณาระบุจำนวนผู้เรียน"
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
                <Field
                  form={form}
                  label="โรงเรียน/มหาวิทยาลัย"
                  required
                  name="school"
                  shadCNComponent={(field) => {
                    return (
                      <Input
                        {...field}
                        placeholder="กรุณาระบุโรงเรียน"
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
                <Field
                  form={form}
                  label="วันเวลาที่สะดวก"
                  required
                  name="available_date_time"
                  description="เช่น ทุกวันอาทิตย์ เวลา 13.00น - 15.00น"
                  shadCNComponent={(field) => {
                    return (
                      <Input
                        {...field}
                        placeholder="กรุณาระบุวันเวลาที่สะดวก"
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
                <Field
                  form={form}
                  label="พื้นฐานผู้เรียน"
                  required
                  name="fundamental"
                  shadCNComponent={(field) => {
                    return (
                      <div className="w-full max-w-sm">
                        <SelectField
                          placeholder="กรุณาเลือกพื้นฐาน"
                          field={field}
                          options={[
                            "ดีมาก",
                            "ดี",
                            "ปานกลาง",
                            "ค่อนข้างอ่อน",
                            "อ่อน",
                          ]}
                          className="border-pink-200"
                          mode="VALUE_ONLY"
                          selectStyles={selectStyles}
                        />
                      </div>
                    );
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white rounded-xl shadow-lg p-6 border border-pink-100"
            >
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-pink-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">
                  รายละเอียดคอร์สเรียน
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePickerComponent
                  form={form}
                  name="starting_date"
                  label="วันที่ต้องการเริ่มเรียนวันแรก"
                  required
                  placeholder="กรุณาระบุวันที่ต้องการเริ่มเรียนวันแรก"
                  disable={(date) => date < new Date()}
                  className="border-pink-200"
                  readOnly={false}
                />
                <Field
                  form={form}
                  label="จำนวนครั้งที่ต้องการเรียนต่อสัปดาห์"
                  required
                  name="session_count_per_week"
                  shadCNComponent={(field) => {
                    return (
                      <Input
                        type="number"
                        {...field}
                        min={1}
                        step={1}
                        placeholder="กรุณาระบุจำนวนครั้งที่ต้องการเรียนต่อสัปดาห์"
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Field
                  form={form}
                  label="จำนวนครั้งที่ต้องการเรียนทั้งหมด"
                  required
                  name="total_session_count"
                  shadCNComponent={(field) => {
                    return (
                      <Select
                        menuPlacement="auto"
                        placeholder="กรุณาเลือก จำนวนครั้งที่ต้องการเรียนทั้งหมด(โดยประมาณ)"
                        {...field}
                        options={[
                          {
                            label: "1",
                            value: "1",
                          },
                          {
                            label: "2",
                            value: "2",
                          },
                          {
                            label: "3",
                            value: "3",
                          },
                          {
                            label: "4",
                            value: "4",
                          },
                          {
                            label: "5",
                            value: "5",
                          },
                          {
                            label: "มากกว่า 5 ครั้ง",
                            value: "6",
                          },
                        ]}
                        className="text-black"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: "#f9a8d4",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: "#ec4899",
                            },
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                              ? "#fce7f3"
                              : "white",
                            color: "black",
                          }),
                        }}
                      />
                    );
                  }}
                />
                <Field
                  form={form}
                  label="จำนวนชั่วโมงต่อการเรียน 1 ครั้ง"
                  required
                  name="hours_per_session"
                  shadCNComponent={(field) => {
                    return (
                      <Input
                        type="number"
                        {...field}
                        min={0.5}
                        step={0.5}
                        placeholder="กรุณาระบุจำนวนชั่วโมงเรียนต่อครั้ง"
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
                <Field
                  form={form}
                  label="สถานที่เรียน"
                  required
                  name="location"
                  shadCNComponent={(field) => {
                    return (
                      <>
                        <Textarea
                          placeholder="กรุณาระบุสถานที่เรียน"
                          disabled={disableLocation}
                          {...field}
                          className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                        />
                        <Field
                          form={form}
                          name="online"
                          shadCNComponent={(field) => {
                            return (
                              <div className="flex items-center mt-2">
                                <Checkbox
                                  checked={field.value}
                                  onChange={(e) => {
                                    field.onChange(e.target.checked);
                                    // if checked, clear location and disable the field
                                    if (e.target.checked) {
                                      form.setValue("location", "ออนไลน์");
                                      setDisableLocation(true);
                                    } else {
                                      form.setValue("location", "");
                                      setDisableLocation(false);
                                    }
                                  }}
                                  className="text-pink-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                  เรียนออนไลน์
                                </span>
                              </div>
                            );
                          }}
                        />
                      </>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Field
                  form={form}
                  label="ค่าเรียนต่อชั่วโมงที่ต้องการ (รวมทุกคน)"
                  required
                  name="fee"
                  shadCNComponent={(field) => {
                    return (
                      <Input
                        type="number"
                        {...field}
                        min={175}
                        placeholder="กรุณาระบุค่าเรียนที่ต้องการ"
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
                <Field
                  form={form}
                  label="รายละเอียดเพิ่มเติม"
                  name="additional_info"
                  shadCNComponent={(field) => {
                    return (
                      <Textarea
                        {...field}
                        placeholder="เช่น ขอติวเตอร์ผู้ชาย ไม่ดุ"
                        className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                      />
                    );
                  }}
                />
                <Field
                  form={form}
                  label="Tags"
                  name="tags"
                  description="ควรติดแท็กเพื่อให้หาติวเตอร์ได้ง่ายขึ้น"
                  shadCNComponent={(field) => {
                    return (
                      <div className="w-full max-w-sm">
                        <Select
                          isLoading={isLoadingTags}
                          menuPlacement="auto"
                          placeholder="กรุณาเลือก Tag (เลือกได้มากกว่า 1)"
                          {...field}
                          options={Object.entries(tags).map(([key, value]) => ({
                            label: value,
                            value: key.toString(),
                          }))}
                          isMulti
                          closeMenuOnSelect={false}
                          className="text-black"
                          styles={selectStyles}
                        />
                      </div>
                    );
                  }}
                />
              </div>
              <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200 text-sm text-pink-800">
                <p>
                  *ไม่ควรจ่ายค่าสอนล่วงหน้าให้ติวเตอร์ก่อนทำการเรียนจริงไม่ว่าเป็นคอร์สหรือรายครั้ง
                  โดยไม่ผ่านสถาบัน ไม่เช่นนั้นสถาบันขอไม่รับผิดชอบไม่ว่ากรณีใดๆ
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white rounded-xl shadow-lg p-6 border border-pink-100"
            >
              <div className="flex items-center mb-4">
                <Phone className="h-5 w-5 text-pink-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">
                  ช่องทางการติดต่อ
                </h2>
              </div>
              <div className="grid grid-cols-1">
                <Field
                  form={form}
                  label="ช่องทางติดต่อที่ต้องการ"
                  name="contact_preference"
                  description="ติวเตอร์จะติดต่อผ่านช่องทางติดต่อลำดับแรกก่อน และ หากติดต่อไม่ได้จะติดต่อผ่านช่องทางติดต่อลำดับสองและสาม ตามลำดับ"
                  required
                  shadCNComponent={(field) => {
                    return (
                      <div className="w-full max-w-sm">
                        <Select
                          menuPlacement="auto"
                          placeholder="กรุณาเลือกช่องทางการติดต่อ (เลือกได้มากกว่า 1)"
                          {...field}
                          options={[
                            { label: "อีเมล", value: "email" },
                            { label: "โทรศัพท์", value: "phone" },
                            { label: "ไลน์", value: "line_id" },
                          ]}
                          isMulti
                          closeMenuOnSelect={false}
                          className="text-black"
                          styles={selectStyles}
                        />
                      </div>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {contact_preference?.map((it) => {
                  switch (it.value) {
                    case "email":
                      return (
                        <div
                          key={it.value}
                          className="bg-pink-50 p-4 rounded-lg border border-pink-100"
                        >
                          <div className="flex items-center mb-2">
                            <Mail className="h-4 w-4 text-pink-500 mr-2" />
                            <span className="text-sm font-medium text-pink-700">
                              อีเมล
                            </span>
                          </div>
                          <Field
                            form={form}
                            label="อีเมล"
                            required
                            name="creator_email"
                            description="*อีเมลเดียวกับที่กรอกด้านบน"
                            shadCNComponent={(field) => {
                              return (
                                <Input
                                  placeholder="กรุณาใส่อีเมล"
                                  type="email"
                                  disabled
                                  {...field}
                                  className="border-pink-200 bg-white"
                                />
                              );
                            }}
                          />
                        </div>
                      );
                    case "phone":
                      return (
                        <div
                          key={it.value}
                          className="bg-pink-50 p-4 rounded-lg border border-pink-100"
                        >
                          <div className="flex items-center mb-2">
                            <Phone className="h-4 w-4 text-pink-500 mr-2" />
                            <span className="text-sm font-medium text-pink-700">
                              เบอร์มือถือ
                            </span>
                          </div>
                          <Field
                            form={form}
                            label="เบอร์มือถือ"
                            required
                            name="phone"
                            shadCNComponent={(field) => {
                              return (
                                <Input
                                  placeholder="โปรดกรอกเบอร์โทรศัพท์"
                                  {...field}
                                  className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                                />
                              );
                            }}
                            tooltip={
                              <TooltipComponent content="กรุณากรอกแต่เบอร์ตัวเลข 10 หลักเท่านั้น เช่น 0650631323 หากอยู่ต่างประเทศให้ใส่ country code ด้วย เช่น +65 93958849" />
                            }
                          />
                        </div>
                      );
                    case "line_id":
                      return (
                        <div
                          key={it.value}
                          className="bg-pink-50 p-4 rounded-lg border border-pink-100"
                        >
                          <div className="flex items-center mb-2">
                            <MessageSquare className="h-4 w-4 text-pink-500 mr-2" />
                            <span className="text-sm font-medium text-pink-700">
                              ไลน์ ID
                            </span>
                          </div>
                          <Field
                            form={form}
                            label="ไลน์ ID"
                            required
                            name="line_id"
                            description="ไลน์ ID เดียวกับที่กรอกด้านบน"
                            shadCNComponent={(field) => {
                              return (
                                <Input
                                  placeholder="กรุณาใส่ line ID"
                                  {...field}
                                  disabled
                                  className="border-pink-200 focus:border-pink-500 transition-all duration-300"
                                />
                              );
                            }}
                          />
                        </div>
                      );
                  }
                })}
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="mt-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังส่งข้อมูล...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Sparkles className="mr-2 h-5 w-5" />
                    ส่งข้อมูล
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </motion.div>
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
            สร้างงานสำเร็จ
          </h3>
          <p className="text-gray-600 text-center mb-4">
            ขอบคุณที่ใช้บริการ Chula Tutor Dream
          </p>
          <p className="text-gray-600 text-center">
            เมื่อมีติวเตอร์ตอบรับงานเราจะส่งการแจ้งเตือนไปทางอีเมลของท่าน
          </p>
        </div>
      </Modal>
    </Form>
  );
}

export default function JobCreationFormWithCaptcha() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6Lc7V-YqAAAAAJw36pCOOdN0Bl9hxSloNY0guCaq"
      language="th"
    >
      <JobCreationForm />
    </GoogleReCaptchaProvider>
  );
}

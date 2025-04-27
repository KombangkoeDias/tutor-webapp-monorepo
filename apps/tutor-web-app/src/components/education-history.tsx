"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "./shared/form-item";
import SelectField from "./shared/select";

interface EducationHistoryProps {
  form: any;
  index: number;
  onDelete?: () => void;
  readOnly: boolean;
  selectStyles: any;
}

export function EducationHistory({
  form,
  index,
  onDelete,
  readOnly,
  selectStyles,
}: EducationHistoryProps) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">ประวัติการศึกษา #{index + 1}</h3>
        {onDelete && !readOnly && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          form={form}
          label="ระดับการศึกษา"
          required
          name={`educational_background_list[${index}].level`}
          shadCNComponent={(field) => {
            return (
              <SelectField
                placeholder="เลือกระดับการศึกษา"
                options={[
                  "ประถม",
                  "มัธยม",
                  "ปริญญาตรี",
                  "ปริญญาโท",
                  "ปริญญาเอก",
                  "อื่นๆ",
                ]}
                field={field}
                mode="VALUE_ONLY"
                selectStyles={selectStyles}
              />
            );
          }}
          readOnly={readOnly}
        />

        <Field
          form={form}
          label="สถานศึกษา"
          required
          name={`educational_background_list[${index}].school`}
          shadCNComponent={(field) => {
            return (
              <Input
                placeholder="กรอกสถานศึกษาของท่าน"
                className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                {...field}
              />
            );
          }}
          readOnly={readOnly}
        />
        <Field
          form={form}
          label="แผนกการเรียน/สาขา"
          required
          name={`educational_background_list[${index}].major`}
          shadCNComponent={(field) => {
            return (
              <Input
                placeholder="กรอกแผนกการเรียน/สาขา"
                className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                {...field}
              />
            );
          }}
          readOnly={readOnly}
        />
        <Field
          form={form}
          label="เกรด"
          required
          name={`educational_background_list[${index}].gpa`}
          shadCNComponent={(field) => {
            return (
              <Input
                placeholder="กรอกเกรด"
                type="number"
                min={0.01}
                step={0.01}
                {...field}
                className="bg-white/80 border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              />
            );
          }}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

"use client";

import { theme } from "antd";
import { Input } from "../ui/input";
import { Field } from "@/chulatutordream/components/shared/form-item";

type AddressComponentProps = {
  form: any;
  readOnly: boolean;
  selectStylesProps?: any;
};

export const AddressComponent = ({
  form,
  readOnly,
  selectStylesProps = {},
}: AddressComponentProps) => {
  const { token } = theme.useToken();

  const emptySelectOption = { label: undefined, value: undefined };

  // Custom styles to ensure dropdowns appear on top of other elements
  const selectStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // High z-index to ensure it's on top
      position: "absolute",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    container: (provided) => ({
      ...provided,
      position: "relative",
    }),
    ...selectStylesProps,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Field
        form={form}
        label="จังหวัด"
        required
        name="province"
        shadCNComponent={({ onChange, ...field }) => {
          return <></>;
        }}
        customReadOnly={() => {
          return (
            <div
              className="p-3 "
              style={{
                backgroundColor: token.colorFillAlter,
                borderRadius: token.borderRadius,
              }}
            >
              <p>{form.getValues("province")}</p>
            </div>
          );
        }}
        readOnly={readOnly}
      />
      <Field
        form={form}
        label="อำเภอ"
        required
        name="amphoe"
        shadCNComponent={({ onChange, ...field }) => {
          return <></>;
        }}
        readOnly={readOnly}
        customReadOnly={() => {
          return (
            <div
              className="p-3"
              style={{
                backgroundColor: token.colorFillAlter,
                borderRadius: token.borderRadius,
              }}
            >
              <p>{form.getValues("amphoe")}</p>
            </div>
          );
        }}
      />
      <Field
        form={form}
        label="ตำบล"
        required
        name="tambon"
        shadCNComponent={({ onChange, ...field }) => {
          return <></>;
        }}
        readOnly={readOnly}
        customReadOnly={() => {
          return (
            <div
              className="p-3"
              style={{
                backgroundColor: token.colorFillAlter,
                borderRadius: token.borderRadius,
              }}
            >
              <p>{form.getValues("tambon")}</p>
            </div>
          );
        }}
      />
      <Field
        form={form}
        label="เลขไปรษณีย์"
        required
        name="postcode"
        shadCNComponent={(field) => {
          return <Input disabled {...field} />;
        }}
        readOnly={readOnly}
        customReadOnly={() => {
          return (
            <div
              className="p-3"
              style={{
                backgroundColor: token.colorFillAlter,
                borderRadius: token.borderRadius,
              }}
            >
              <p>{form.getValues("postcode")}</p>
            </div>
          );
        }}
      />
    </div>
  );
};

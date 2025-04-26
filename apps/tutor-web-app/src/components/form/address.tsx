"use client";

import { theme } from "antd";
import { useLocationConstants } from "../hooks/location-context";
import { Input } from "../ui/input";
import { Field } from "./form-item";
import Select from "react-select";

type AddressComponentProps = {
  form: any;
  readOnly: boolean;
  selectStylesProps: any;
};

export const AddressComponent = ({
  form,
  readOnly,
  selectStylesProps,
}: AddressComponentProps) => {
  const {
    provinces,
    amphoes,
    tambons,
    isLoadingProvinces,
    setProvinceId,
    provinceId,
    setAmphoeId,
    amphoeId,
    setTambonId,
    isLoadingAmphoes,
    isLoadingTambons,
  } = useLocationConstants();

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
          return (
            <Select
              isLoading={isLoadingProvinces}
              menuPlacement="auto"
              menuPortalTarget={document.body} // This renders the menu in a portal at the end of the document body
              menuPosition="fixed" // Use fixed positioning
              styles={selectStyles}
              placeholder="กรุณาเลือกจังหวัด"
              onChange={(e) => {
                onChange(e);
                setProvinceId(e.value);
                form.setValue("amphoe", emptySelectOption);
                setAmphoeId(undefined);
                form.setValue("tambon", emptySelectOption);
                setTambonId(undefined);
                form.setValue("postcode", undefined);
              }}
              {...field}
              options={provinces.map((p) => ({
                label: p.name,
                value: p.id,
              }))}
              className="text-black"
            />
          );
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
              <p>{form.getValues("province")?.label}</p>
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
          return (
            <Select
              isLoading={isLoadingAmphoes}
              isDisabled={provinceId === undefined}
              menuPlacement="auto"
              menuPortalTarget={document.body}
              menuPosition="fixed"
              styles={selectStyles}
              placeholder="กรุณาเลือกอำเภอ"
              {...field}
              value={form.getValues("amphoe")}
              onChange={(e) => {
                onChange(e);
                setAmphoeId(e.value);
                form.setValue("tambon", emptySelectOption);
                setTambonId(undefined);
                form.setValue("postcode", undefined);
              }}
              options={amphoes.map((e) => ({
                label: e.name_th,
                value: e.id,
              }))}
              className="text-black"
            />
          );
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
              <p>{form.getValues("amphoe")?.label}</p>
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
          return (
            <Select
              isLoading={isLoadingTambons}
              isDisabled={amphoeId === undefined}
              menuPlacement="auto"
              menuPortalTarget={document.body}
              menuPosition="fixed"
              styles={selectStyles}
              placeholder="กรุณาเลือกตำบล"
              onChange={(e) => {
                onChange(e);
                setTambonId(e.value);
                const postcode = tambons.find((o) => o.id == e.value)?.zip_code;
                form.setValue("postcode", postcode);
              }}
              {...field}
              options={tambons.map((e) => ({
                label: e.name_th,
                value: e.id,
              }))}
              className="text-black"
            />
          );
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
              <p>{form.getValues("tambon")?.label}</p>
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

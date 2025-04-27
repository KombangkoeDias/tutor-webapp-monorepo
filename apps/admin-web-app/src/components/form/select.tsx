import { cn } from "@/lib/utils";
import Select from "react-select";

type selectItem =
  | {
      label: string;
      value?: string;
    }
  | string;

type SelectFieldProps = {
  placeholder: string;
  options: selectItem[];
  field: any;
  onChange?: (value: any) => void;
  isDisabled?: boolean;
  mode?: "VALUE_ONLY" | "SELECT_OBJECT";
};

const SelectField = (props: SelectFieldProps) => {
  const { value, onChange, ...field } = props.field;

  const genOptions = () => {
    if (props.options.length > 0) {
      if (props.mode === "VALUE_ONLY") {
        return props.options.map((o) => ({ label: o, value: o }));
      }
    }
    return props.options;
  };

  return (
    <Select
      isDisabled={props.isDisabled ?? false}
      menuPlacement="auto"
      placeholder={props.placeholder}
      {...field}
      value={typeof value === "string" ? { label: value, value: value } : value}
      onChange={(value) => {
        if (props.mode === "VALUE_ONLY") {
          onChange(value.value);
        } else {
          onChange(value);
        }
      }}
      options={genOptions()}
      className="text-black"
    />
  );
};

export default SelectField;

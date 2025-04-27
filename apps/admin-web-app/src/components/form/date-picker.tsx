import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReactNode } from "react";
import { LabelComponent } from "./label";
import ReadOnlyFormItem from "./read-only-item";

type DatePickerProps = {
  form: any;
  name: string;
  description?: string;
  label: ReactNode;
  required: boolean;
  tooltip?: ReactNode;
  placeholder: string;
  readOnly: boolean;
};

export const DatePickerComponent = (props: DatePickerProps) => {
  const dateValue = new Date(props.form.getValues(props.name));
  const dateString = `${dateValue.toLocaleDateString("th-TH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })} ${dateValue.getFullYear()}`;
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <LabelComponent
              required={props.required}
              label={props.label}
              readOnly={props.readOnly}
            />
          </FormLabel>
          <ReadOnlyFormItem
            form={props.form}
            name={props.name}
            value={dateString}
          />
          <FormMessage />
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};

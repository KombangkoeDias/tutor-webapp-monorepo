import { FC, ReactNode } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from "react-hook-form";
import { LabelComponent, RequiredLabel } from "./label";
import { theme } from "antd";
import ReadOnlyFormItem from "./read-only-item";

type FieldProps = {
  form: any;
  label?: ReactNode;
  required?: boolean;
  name: string;
  shadCNComponent: (
    field: ControllerRenderProps<FieldValues, string>
  ) => ReactNode;
  description?: ReactNode;
  tooltip?: ReactNode;
  render?: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<any, any>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<any>;
  }) => React.ReactElement;
  readOnly?: boolean;
  customReadOnly?: () => ReactNode;
};

export const Field: FC<FieldProps> = ({
  form,
  label,
  required = false,
  name,
  shadCNComponent,
  description = "",
  tooltip,
  render = undefined,
  readOnly = false,
  customReadOnly,
}) => {
  const defaultRenderFunc = ({ field }) => {
    const { token } = theme.useToken();
    return (
      <FormItem>
        <FormLabel>
          <div style={{ display: "flex" }}>
            <LabelComponent
              required={required}
              label={label}
              tooltip={tooltip}
              readOnly={readOnly}
            />
          </div>
        </FormLabel>
        {readOnly ? (
          customReadOnly ? (
            customReadOnly()
          ) : (
            <ReadOnlyFormItem form={form} name={name} />
          )
        ) : (
          <FormControl>{shadCNComponent(field)}</FormControl>
        )}

        {!readOnly && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  };
  const renderFunc = render ?? defaultRenderFunc;

  return <FormField control={form.control} name={name} render={renderFunc} />;
};

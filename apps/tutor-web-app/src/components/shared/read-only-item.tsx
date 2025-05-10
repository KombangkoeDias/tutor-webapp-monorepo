import { theme } from "antd";
import { ReactNode } from "react";

type ReadOnlyFormItemProps = {
  form: any;
  name: string;
  value?: ReactNode;
};

export default function ReadOnlyFormItem({
  form,
  name,
  value = null,
}: ReadOnlyFormItemProps) {
  const { token } = theme.useToken();
  return (
    <div
      className="p-3 "
      style={{
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadius,
      }}
    >
      <p>
        {(value
          ? value
          : typeof form.getValues(name) == "object"
            ? form.getValues(name)?.label
            : form.getValues(name)) ?? "-"}
      </p>
    </div>
  );
}

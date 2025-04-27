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
      className="p-3 whitespace-pre"
      style={{
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadius,
      }}
    >
      <p>{value ? value : form.getValues(name) ?? "-"}</p>
    </div>
  );
}

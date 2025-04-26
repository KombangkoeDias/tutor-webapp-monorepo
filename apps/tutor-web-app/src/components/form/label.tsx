import { FC, ReactNode } from "react";

type LabelProps = {
  required: boolean;
  label: ReactNode;
  tooltip?: any;
  readOnly?: boolean;
};

export const LabelComponent: FC<LabelProps> = ({
  required = false,
  label,
  tooltip = undefined,
  readOnly = false,
}) => {
  if (required) {
    if (!!tooltip) {
      return (
        <>
          <RequiredLabel label={label} readOnly={readOnly} /> &nbsp;{" "}
          {!readOnly && tooltip}
        </>
      );
    }
    return (
      <>
        <RequiredLabel label={label} readOnly={readOnly} />
      </>
    );
  }
  return (
    <span>
      {label} &nbsp; {tooltip}
    </span>
  );
};

export function RequiredLabel({
  label,
  readOnly = false,
}: {
  label: ReactNode;
  readOnly: boolean;
}) {
  return (
    <label className="block text-sm font-medium mb-1">
      {label} {!readOnly && <span className="text-red-500">*</span>}
    </label>
  );
}

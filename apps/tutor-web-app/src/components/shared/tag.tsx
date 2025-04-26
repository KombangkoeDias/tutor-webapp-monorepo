import { ReactNode } from "react";

export const Tag = ({
  color,
  content,
}: {
  content: ReactNode;
  color:
    | "blue"
    | "gray"
    | "red"
    | "green"
    | "yellow"
    | "indigo"
    | "purple"
    | "pink"
    | "orange";
}) => {
  return (
    <span
      className={`bg-${color}-100 text-${color}-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-${color}-700 dark:text-${color}-400 border border-${color}-400`}
    >
      {content}
    </span>
  );
};

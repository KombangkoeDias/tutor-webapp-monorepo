import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ReactNode } from "react";
import { LabelComponent } from "./label";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import ReadOnlyFormItem from "./read-only-item";
import { th } from "date-fns/locale";

type DatePickerProps = {
  form: any;
  name: string;
  description?: string;
  label: ReactNode;
  required: boolean;
  tooltip?: ReactNode;
  placeholder: string;
  readOnly: boolean;
  profilePage?: boolean;
  selectStyles?: any;
  disable?: (date: any) => any;
  className?: string;
  popOverDisabled?: boolean;
  startMonth?: Date;
  endMonth?: Date;
};

export const DatePickerComponent = ({
  form,
  name,
  description = "",
  label,
  required = false,
  tooltip,
  placeholder,
  readOnly = false,
  profilePage = false,
  selectStyles = {},
  disable = undefined,
  className = "",
  popOverDisabled = false,
  startMonth,
  endMonth,
}: DatePickerProps) => {
  const dateValue = new Date(form.getValues(name));
  const dateString = `${dateValue.toLocaleDateString("th-TH", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })} ${dateValue.getFullYear()}`;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>
              <LabelComponent
                required={required}
                label={label}
                readOnly={readOnly}
              />
            </FormLabel>
            {readOnly ? (
              <ReadOnlyFormItem form={form} name={name} value={dateString} />
            ) : (
              <Popover>
                <PopoverTrigger asChild disabled={popOverDisabled}>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                        className
                      )}
                    >
                      {field.value ? (
                        format(field.value, "EEE, MMM dd, yyyy")
                      ) : (
                        <span>{placeholder}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-5" align="start">
                  <DayPicker
                    locale={th}
                    mode="single"
                    captionLayout="dropdown"
                    selected={field.value}
                    onSelect={field.onChange}
                    {...(startMonth && { startMonth })}
                    {...(endMonth && { endMonth })}
                    disabled={
                      disable
                        ? disable
                        : (date: any) =>
                            date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
            <FormMessage />
            <FormDescription>{description}</FormDescription>
          </FormItem>
        );
      }}
    />
  );
};

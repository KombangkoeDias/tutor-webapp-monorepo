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
import { Calendar } from "@/components/ui/calendar";
import { ReactNode } from "react";
import { LabelComponent, RequiredLabel } from "./label";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import ReadOnlyFormItem from "./read-only-item";
import { th } from "date-fns/locale";
import { useLoggedIn } from "../hooks/login-context";

type DatePickerProps = {
  form: any;
  name: string;
  description?: string;
  label: ReactNode;
  required: boolean;
  tooltip?: ReactNode;
  placeholder: string;
  readOnly: boolean;
  profilePage: boolean;
  selectStyles: any;
};

export const DatePickerComponent = (props: DatePickerProps) => {
  const { tutor } = useLoggedIn();
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
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>
              <LabelComponent
                required={props.required}
                label={props.label}
                readOnly={props.readOnly}
              />
            </FormLabel>
            {props.readOnly ? (
              <ReadOnlyFormItem
                form={props.form}
                name={props.name}
                value={dateString}
              />
            ) : (
              <Popover>
                <PopoverTrigger
                  asChild
                  disabled={props.profilePage && tutor?.admin_verified}
                >
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                        "border-teal-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "EEE, MMM dd, yyyy")
                      ) : (
                        <span>{props.placeholder}</span>
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
                    disabled={(date: any) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
            )}
            <FormMessage />
            <FormDescription>{props.description}</FormDescription>
          </FormItem>
        );
      }}
    />
  );
};

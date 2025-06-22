import { Collapse, CollapseProps, Drawer, Tag, Checkbox } from "antd";
import { jobController, Proposition } from "@/services/controller/job";
import { useQuery } from "@tanstack/react-query";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input, theme } from "antd";
import FormItem from "antd/es/form/FormItem";
import { CaretRightOutlined, RightOutlined } from "@ant-design/icons";
import { useLoggedIn } from "@/components/hooks/login-context";
import {
  Action,
  canUserMakeAction,
  VerifyActionAlert,
} from "@/components/shared/verify_action_alert";
import _ from "lodash";

type JobDrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedJobId: number;
  subjects: any;
  readOnly: boolean;
  refetch?: () => void;
  setShowSuccessModal: (v: boolean) => void;
};

const JobDrawer: FC<JobDrawerProps> = ({
  open,
  setOpen,
  selectedJobId,
  subjects,
  readOnly,
  refetch,
  setShowSuccessModal,
}) => {
  const { token } = theme.useToken();
  const [proposition, setProposition] = useState<Proposition>({});
  const { loggedIn, tutor, isTutorAllVerified } = useLoggedIn();
  const { data: job, isFetching } = useQuery({
    queryKey: ["job", selectedJobId],
    queryFn: async () => {
      return jobController.GetJob(selectedJobId);
    },
    initialData: {},
    enabled: selectedJobId !== 0,
  });

  useEffect(() => {
    setProposition({});
  }, [selectedJobId]);

  const collapseStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <b className="text-[16px]">เสนอค่าสอน</b>,
      headerClass: "bg-[#eaddff] h-[50px]",
      children: (
        <>
          หากท่านต้องการได้ค่าสอนมากกว่าที่ระบุสามารถเสนอได้
          <FormItem>
            <Input
              type="number"
              min={1}
              placeholder="เสนอค่าสอน"
              addonAfter="บาทต่อชั่วโมง"
              onChange={(e) => {
                setProposition({
                  ...proposition,
                  fee: parseInt(e.target.value),
                });
              }}
            />
          </FormItem>
        </>
      ),
      style: collapseStyle,
    },
  ];

  const subject = subjects[job.subjectId];

  const debouncedReserve = useCallback(
    _.debounce(async (selectedJobId: number, proposition: Proposition) => {
      await jobController.ReserveJob(selectedJobId, proposition);
      setOpen(false);
      setShowSuccessModal(true);
      refetch && refetch();
    }, 1000),
    []
  );
  return (
    <Drawer
      loading={isFetching}
      width={800}
      title={`จองงาน รหัสงาน: ${selectedJobId}`}
      onClose={() => setOpen(false)}
      open={open}
    >
      <main className="flex-1 container mx-auto px-8 py-4">
        <div className="grid grid-cols-1 mb-4">
          <h1 className={`text-4xl font-semibold`}>
            รหัสงาน: {selectedJobId} - {subject}, {job?.note}
          </h1>
        </div>
        <div className="grid grid-cols-1 flex items-center mb-4">
          <div>
            {isTutorAllVerified() && (
              <Tag className="text-lg" color="magenta">
                ค่าแนะนำ: {job?.referral_fee} บาท
              </Tag>
            )}
            {job?.tags?.length > 0 && (
              <>
                {job?.tags?.map((tag: any) => {
                  return <Tag color="blue">{tag.name}</Tag>;
                })}
              </>
            )}
          </div>
        </div>
        {!readOnly && (
          <>
            <VerifyActionAlert action="จองงาน" />
            {canUserMakeAction(loggedIn, tutor, Action.RESERVE_JOB) && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <Collapse
                    ghost
                    defaultActiveKey={["1"]}
                    items={items}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  />
                </div>
                <div className="md:col-span-1 flex items-center">
                  <FormItem>
                    <Checkbox
                      onChange={(e) => {
                        setProposition({
                          ...proposition,
                          online: e.target.checked,
                        });
                      }}
                      className="text-[14px] font-bold"
                      disabled={job.online}
                    >
                      เสนอเป็นสอนออนไลน์
                    </Checkbox>{" "}
                    {job.online && (
                      <p className="text-[14px] font-bold text-red-500">
                        งานนี้เป็นงานสอนออนไลน์
                      </p>
                    )}
                  </FormItem>
                </div>
                <div className="md:col-span-1 flex justify-end items-start ">
                  <Button
                    className="w-[120px] bg-[#4CAF50] text-white hover:bg-[#45a049]"
                    onClick={async () => {
                      await debouncedReserve(selectedJobId, proposition);
                    }}
                    disabled
                  >
                    จองงาน
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <JobDetailCard name="วิชา" content={subjects[job?.subjectId]} />
          <JobDetailCard
            name="ระดับชั้นผู้เรียน"
            content={job?.learner_level}
          />
          <JobDetailCard
            name="ระดับชั้นที่ต้องการเรียน"
            content={job?.want_to_learn_level}
          />
          <JobDetailCard name="สถานที่สอน" content={job?.location} />
          <JobDetailCard
            name="สอนเป็นภาษา"
            content={job?.learn_language ?? "ไทย"}
          />
          <JobDetailCard
            name="จำนวนผู้เรียน"
            content={`${job?.learner_number} คน`}
          />
          <JobDetailCard name="โรงเรียนผู้เรียน" content={job?.school} />
          <JobDetailCard name="พื้นฐานผู้เรียน" content={job?.fundamental} />
          <JobDetailCard
            name="ค่าเรียน (ต่อรองได้)"
            content={`${job?.fee} บาทต่อชั่วโมง ${
              job?.learner_number > 1
                ? `(ราคารวมทั้ง ${job.learner_number} คน)`
                : ""
            }`}
          />
          <JobDetailCard
            name="รายละเอียด"
            content={`${job?.note ?? ""} ${job?.additional_info ?? ""}`}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <JobDetailCard
            name="วันเวลาที่สะดวก"
            content={job?.available_date_time}
          />
        </div>
      </main>
    </Drawer>
  );
};

export default JobDrawer;

interface JobDetailCardProps {
  name: string;
  content: string;
}

export function JobDetailCard({ name, content }: JobDetailCardProps) {
  return (
    <div className="p-4 bg-[#F5F7FA] rounded-lg flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-[#eaddff] flex items-center justify-center text-[#4f378a]">
        <RightOutlined />
      </div>
      <div>
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}

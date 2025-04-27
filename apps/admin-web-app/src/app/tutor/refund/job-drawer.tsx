import { Drawer, Tag } from "antd";
import { jobController } from "@/services/controller";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, FC, SetStateAction } from "react";
import { theme } from "antd";
import { RightOutlined } from "@ant-design/icons";

type JobDrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedJobId: number;
  subjects: any;
  readOnly: boolean;
  refetch?: () => void;
};

const JobDrawer: FC<JobDrawerProps> = ({
  open,
  setOpen,
  selectedJobId,
  subjects,
  readOnly,
  refetch,
}) => {
  const { token } = theme.useToken();
  const { data: job, isFetching } = useQuery({
    queryKey: ["job", selectedJobId],
    queryFn: async () => {
      return jobController.GetJob(selectedJobId);
    },
    initialData: {},
    enabled: selectedJobId !== 0,
  });

  const collapseStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const subject = subjects[job.subjectId];
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
            {job?.tags?.length > 0 && (
              <>
                {job?.tags?.map((tag: any) => {
                  return <Tag color="blue">{tag.name}</Tag>;
                })}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <JobDetailCard name="วิชา" content={subjects[job?.subjectId]} />
          <JobDetailCard name="ระดับชั้น" content={job?.level} />
          <JobDetailCard name="สถานที่สอน" content={job?.location} />
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

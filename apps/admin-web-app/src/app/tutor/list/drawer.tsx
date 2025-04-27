import { Drawer } from "antd";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, FC, SetStateAction } from "react";
import TutorProfileForm from "@/components/shared/profile";
import { useForm } from "react-hook-form";
import { adminController } from "@/services/controller";
import { convertBackendToFormData } from "@/components/shared/form_data";

type TutorProfileDrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  tutorId: number | undefined;
  refetchTutorForReview: Function;
  isEditProfileTutor: boolean;
  allowReview: boolean;
};

const TutorProfileReviewDrawer: FC<TutorProfileDrawerProps> = ({
  open,
  setOpen,
  tutorId,
  refetchTutorForReview,
  isEditProfileTutor,
  allowReview,
}) => {
  const form = useForm({
    defaultValues: {
      title: undefined,
      name: undefined,
      surname: undefined,
      nickname: undefined,
      telephone: undefined,
      email: undefined,
      line_id: undefined,
      birthday: undefined,
      address: undefined,
      id_card_img_file: undefined,
      id_card_img: undefined,
      educational_background_list: [{}],
      educational_background: undefined,
      preferred_job_level_list: undefined,
      preferred_job_level: undefined,
      preferred_job_subject: undefined,
      preferred_job_subject_list: undefined,
      accolade: undefined,
    },
  });

  const {
    data: tutor,
    isFetching,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["tutorProfile", tutorId, isEditProfileTutor],
    queryFn: async () => {
      if (isEditProfileTutor) {
        const tutor = await adminController.GetTutorById(tutorId, true);
        form.reset(convertBackendToFormData(tutor));
        return tutor;
      }
      const tutor = await adminController.GetTutorById(tutorId, false);
      form.reset(convertBackendToFormData(tutor));
      return tutor;
    },
    initialData: {},
    enabled: tutorId != undefined,
  });

  return (
    <Drawer
      loading={isFetching}
      width={800}
      title={`รีวิวติวเตอร์`}
      onClose={() => setOpen(false)}
      open={open}
    >
      <TutorProfileForm
        form={form}
        readOnly={true}
        header=""
        loading={isFetching}
        adminComments={tutor.admin_comments}
        setOpen={setOpen}
        tutorId={tutorId ?? 0}
        refetch={refetchTutorForReview}
        pendingEditProfile={isEditProfileTutor}
        allowReview={allowReview}
      />
    </Drawer>
  );
};

export default TutorProfileReviewDrawer;

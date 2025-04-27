import _ from "lodash";

export const convertBackendToFormData = (tutor: any) => {
  tutor.preferred_job_level_list = tutor.preferred_job_level
    ?.split(",")
    .map((obj) => ({ label: obj, value: obj }));
  tutor.preferred_job_subject_list = tutor.preferred_job_subject.map((obj) => ({
    label: obj.name,
    value: obj.id?.toString(),
  }));
  tutor.preferred_job_subject = undefined;
  tutor.educational_background_list = JSON.parse(tutor.educational_background);
  tutor.birthday = new Date(tutor.birthday);
  return tutor;
};

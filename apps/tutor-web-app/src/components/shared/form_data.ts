import { tutorController } from "@/services/controller/tutor";
import _ from "lodash";
import {
  tutorProfileFormSchemaForSignUp,
  tutorProfileFormSchemaForUpdate,
} from "./profile";
import { z } from "zod";
import { sharedController } from "@/services/controller/shared";

export const convertBackendToFormData = async (tutor: any) => {
  if (!!!tutor) {
    return null;
  }
  var copiedTutor = _.cloneDeep(tutor);
  copiedTutor.preferred_job_level_list = copiedTutor.preferred_job_level
    ?.split(",")
    .map((obj) => ({ label: obj, value: obj }));
  copiedTutor.preferred_job_subject_list =
    copiedTutor.preferred_job_subject.map((obj) => ({
      label: obj.name,
      value: obj.id?.toString(),
    }));
  copiedTutor.preferred_job_subject = undefined;
  copiedTutor.educational_background_list = JSON.parse(
    copiedTutor.educational_background
  );
  copiedTutor.birthday = new Date(copiedTutor.birthday);
  copiedTutor.profile_pic_original_url = copiedTutor.profile_pic_original;
  copiedTutor = setAddress(copiedTutor);
  return copiedTutor;
};

const setAddress = async (tutor: any) => {
  const provinces = (await sharedController.GetAllProvinces()).provinces;
  const province = provinces.find((p) => p.name === tutor.province);
  const amphoes = (await sharedController.GetAmphoesByProvinceId(province.id))
    .amphoes;
  const amphoe = amphoes.find((a) => a.name_th === tutor.amphoe);
  const tambons = (await sharedController.GetTambonsByAmphoeId(amphoe.id))
    .tambons;
  const tambon = tambons.find((t) => t.name_th === tutor.tambon);
  tutor.province = {
    label: province.name,
    value: province.id,
  };
  tutor.amphoe = {
    label: amphoe.name_th,
    value: amphoe.id,
  };
  tutor.tambon = {
    label: tambon.name_th,
    value: tambon.id,
  };
  return tutor;
};

export const convertFormDataToBackend = (values: any) => {
  values.province = values.province.label;
  values.amphoe = values.amphoe.label;
  values.tambon = values.tambon.label;
  values.postcode = values.postcode;
  const clonedValues = _.cloneDeep(values);
  clonedValues.educational_background = JSON.stringify(
    clonedValues.educational_background_list
  );
  clonedValues.preferred_job_level = clonedValues.preferred_job_level_list
    .map((obj) => obj.value)
    .join(",");
  clonedValues.preferred_job_subject =
    clonedValues.preferred_job_subject_list.map((obj) => parseInt(obj.value));
  const requestBody = _.omit(clonedValues, [
    "id_card_img_file",
    "confirm_password",
    "accept_terms_and_conditions",
    "educational_background_list",
    "preferred_job_level_list",
    "preferred_job_subject_list",
    "educational_cert_img_file",
    "accolade_cert_img_file",
    "profile_pic_original_url",
  ]);
  return requestBody;
};

export async function uploadAllFiles(
  values: z.infer<
    | typeof tutorProfileFormSchemaForSignUp
    | typeof tutorProfileFormSchemaForUpdate
  >
) {
  if (
    values.profile_pic_original &&
    values.profile_pic_original !== values.profile_pic_original_url
  ) {
    values.profile_pic_original = await uploadBase64(
      values.profile_pic_original,
      undefined
    );
  } else {
    values.profile_pic_original = getFileNameFromR2Link(
      values.profile_pic_original_url
    );
  }

  if (values.id_card_img_file) {
    values.id_card_img = await uploadImage(
      undefined,
      values.id_card_img_file,
      false
    );
    values.id_card_img_original = values.id_card_img_file?.name;
  } else {
    values.id_card_img = getFileNameFromR2Link(values.id_card_img ?? "");
  }

  // upload new files
  const newEducationalCertImgKey = await uploadImages(
    values.educational_cert_img_file
  );

  const existingEducationalCertImgKey =
    values.educational_cert_img?.map((link) => getFileNameFromR2Link(link)) ??
    [];

  // append new file names
  values.educational_cert_img_original = (
    values.educational_cert_img_original ?? []
  ).concat(values.educational_cert_img_file?.map((file) => file.name));

  // set new file keys
  values.educational_cert_img = (existingEducationalCertImgKey ?? []).concat(
    newEducationalCertImgKey
  );

  // upload new files
  const newAccoladeCertImgKey = await uploadImages(
    values.accolade_cert_img_file
  );
  const existingAccoladeCertImgKey =
    values.accolade_cert_img?.map((link) => getFileNameFromR2Link(link)) ?? [];

  // append new file names
  values.accolade_cert_img_original = (
    values.accolade_cert_img_original ?? []
  ).concat(values.accolade_cert_img_file?.map((file) => file?.name));

  // set new file keys
  values.accolade_cert_img = (existingAccoladeCertImgKey ?? []).concat(
    newAccoladeCertImgKey
  );
  return values;
}

export const uploadImages = async (files: File[] | undefined) => {
  if (files) {
    return await Promise.all(
      files.map(async (file) => {
        const fileName = await uploadImage(undefined, file, false);
        return fileName;
      })
    );
  }
  return undefined;
};

export const uploadImage = async (
  fileName: string | undefined,
  file: File,
  needToast: boolean
) => {
  var s3FileName: string | undefined = undefined;

  var file_name = fileName ? getFileNameFromR2Link(fileName) : undefined;
  if (file) {
    s3FileName = await tutorController.UploadImage(file, file_name, needToast);
  }
  return s3FileName;
};

export const uploadBase64 = async (
  base64: string,
  fileName: string | undefined
) => {
  function base64ToBlob(base64: string) {
    const [meta, data] = base64.split(",");
    const mime = meta.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
  }

  return tutorController.UploadBase64(base64ToBlob(base64), fileName);
};

export const getFileNameFromR2Link = (link: string | undefined) => {
  if (!link || link.split("?").length == 0) {
    return undefined;
  }
  const tmp = link.split("?")[0].split("/");
  return tmp[tmp.length - 1];
};

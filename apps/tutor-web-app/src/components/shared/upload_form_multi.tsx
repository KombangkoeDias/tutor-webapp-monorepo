"use client";
import { Field } from "@/components/shared/form-item";
import { useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Image } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { Button } from "../ui/button";
import { variantButtonClassName } from "@/lib/constants";
import { Download } from "lucide-react";
import _ from "lodash";
import { XCircle } from "lucide-react";
import { FormDescription } from "../ui/form";

type UploadFormProps = {
  form: any;
  readOnly: boolean;
  name: string;
  description?: string;
  existingFileUrlsPath: string;
  existingFileNamesPath: string;
};

export function UploadFormMulti({
  form,
  readOnly,
  name,
  description,
  existingFileUrlsPath,
  existingFileNamesPath,
}: UploadFormProps) {
  const getInitialFilePreview = () => {
    const urls = form.getValues(existingFileUrlsPath);
    const originalNames = form.getValues(existingFileNamesPath);

    return urls?.map((url: string, idx: number) => {
      return {
        url,
        name: originalNames[idx],
      };
    });
  };

  const [existingFilePreviews, setExistingFilePreviews] = useState<
    { url: string; name: string; type?: "image" | "pdf" }[]
  >(getInitialFilePreview() ?? []);

  const [newFilePreviews, setNewFilePreviews] = useState<
    { url: string; name: string; type?: "image" | "pdf" }[]
  >([]);

  return (
    <Controller
      name={name}
      control={form.control}
      defaultValue={[]}
      render={({ field }) => {
        const onDrop = (acceptedFiles: File[]) => {
          field.onChange([...(field.value || []), ...acceptedFiles]);
          const previews = acceptedFiles.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name,
            type: file.type === "application/pdf" ? "pdf" : "image",
          }));
          setNewFilePreviews((prev) => [...prev, ...previews]);
        };

        const { getRootProps, getInputProps } = useDropzone({
          onDrop,
          multiple: true,
          accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
            "application/pdf": [".pdf"],
          },
        });

        const imageFileSuffix = ["jpg", "png", "jpeg"];

        const filePreviews = existingFilePreviews.concat(newFilePreviews);

        // Handle deletion of existing files
        const handleDeleteExisting = (index: number) => {
          const previewToDelete = existingFilePreviews[index];
          const updatedPreviews = [...existingFilePreviews];
          updatedPreviews.splice(index, 1);
          setExistingFilePreviews(updatedPreviews);

          const currentFileUrls = form.getValues(existingFileUrlsPath);
          const currentFileNames = form.getValues(existingFileNamesPath);

          const updatedFileUrls = currentFileUrls?.filter((url: string) => {
            return url != previewToDelete.url;
          });
          const updatedFileNames = currentFileNames?.filter(
            (fileName: string) => {
              return fileName != previewToDelete.name;
            }
          );
          form.setValue(existingFileUrlsPath, updatedFileUrls);
          form.setValue(existingFileNamesPath, updatedFileNames);
        };

        // Handle deletion of new files
        const handleDeleteNew = (index: number) => {
          const updatedPreviews = [...newFilePreviews];
          const deletedPreview = updatedPreviews.splice(index, 1)[0];
          setNewFilePreviews(updatedPreviews);

          // Update form value by filtering out the deleted file
          const currentFiles = field.value || [];
          const updatedFiles = currentFiles.filter((file: File) => {
            // If file isn't a File object, it's not part of newFilePreviews
            if (!(file instanceof File)) return true;
            // Otherwise, check if name matches the deleted newFilePreview
            return file.name !== deletedPreview.name;
          });

          field.onChange(updatedFiles);

          // Revoke the object URL to prevent memory leaks
          URL.revokeObjectURL(deletedPreview.url);
        };

        return (
          <div>
            {!readOnly && (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer hover:bg-gray-50"
              >
                <input {...getInputProps()} />
                <p className="text-gray-500">
                  Drag & drop images here, or click to select
                </p>
              </div>
            )}

            {form.formState.errors[name] && (
              <p className="text-red-500 text-sm mt-2">
                {form.formState.errors[name].message as string}
              </p>
            )}

            {filePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {filePreviews.map((file, index) => {
                  const isExistingFile = index < existingFilePreviews.length;
                  const newFileIndex = index - existingFilePreviews.length;

                  var fileType = file.type;
                  if (file.url.includes("cloudflarestorage")) {
                    const tokens = file.url?.split("?")[0].split(".");
                    const fileSuffix = tokens?.at(tokens.length - 1);
                    if (fileSuffix) {
                      fileType = imageFileSuffix.includes(fileSuffix)
                        ? "image"
                        : "pdf";
                    }
                  }

                  if (fileType === "image") {
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center relative"
                      >
                        {!readOnly && (
                          <button
                            onClick={() => {
                              if (isExistingFile) {
                                handleDeleteExisting(index);
                              } else {
                                handleDeleteNew(newFileIndex);
                              }
                            }}
                            className="absolute top-0 right-3 text-red-500 rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 z-10"
                            type="button"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <div className="relative w-24 h-24 rounded overflow-hidden border">
                          <Image
                            src={file.url}
                            alt={`Preview ${index}`}
                            height={100}
                          />
                        </div>
                        <p className="text-sm mt-2 text-center break-words max-w-[96px]">
                          {file.name}
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="relative">
                        {!readOnly && (
                          <button
                            onClick={() => {
                              if (isExistingFile) {
                                handleDeleteExisting(index);
                              } else {
                                handleDeleteNew(newFileIndex);
                              }
                            }}
                            className="absolute top-0 right-3 text-red-500 rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 z-10"
                            type="button"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <div className="mb-1">
                          <FilePdfOutlined style={{ fontSize: 50 }} />
                        </div>
                        <div className="mb-1">{file.name}</div>
                        {readOnly && (
                          <div>
                            <Button
                              variant="outline"
                              className={variantButtonClassName}
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = file.url;
                                link.download = file.name; // Set the file name
                                link.target = "_blank";
                                document.body.appendChild(link);
                                link.click();
                              }}
                            >
                              <span>Download</span>
                              <Download size={20} />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            )}
            {!readOnly && (
              <FormDescription className="mt-4">{description}</FormDescription>
            )}
          </div>
        );
      }}
    />
  );
}

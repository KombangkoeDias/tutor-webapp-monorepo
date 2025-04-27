"use client";
import { useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";
import React, { useState } from "react";
import { Image } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { Button } from "../ui/button";
import { variantButtonClassName } from "../../lib/constants";
import { Download, XCircle } from "lucide-react";
import { FormDescription } from "../ui/form";

type UploadFormSingleProps = {
  form: any;
  readOnly: boolean;
  name: string;
  description?: string;
  existingFileUrlPath: string;
  existingFileNamePath: string;
};

export function UploadFormSingle({
  form,
  readOnly,
  name,
  description,
  existingFileUrlPath,
  existingFileNamePath,
}: UploadFormSingleProps) {
  const getInitialFilePreview = () => {
    const url = form.getValues(existingFileUrlPath);
    const originalName = form.getValues(existingFileNamePath);

    return url ? { url, name: originalName || "File" } : null;
  };

  const [existingFilePreview, setExistingFilePreview] = useState<{
    url: string;
    name: string;
    type?: "image" | "pdf";
  } | null>(getInitialFilePreview());

  const [newFilePreview, setNewFilePreview] = useState<{
    url: string;
    name: string;
    type?: "image" | "pdf";
  } | null>(null);

  return (
    <Controller
      name={name}
      control={form.control}
      defaultValue={null}
      render={({ field }) => {
        const onDrop = (acceptedFiles: File[]) => {
          if (acceptedFiles.length > 0) {
            // Take only the first file
            const file = acceptedFiles[0];
            field.onChange(file);

            // Clean up previous preview if exists
            if (newFilePreview) {
              URL.revokeObjectURL(newFilePreview.url);
            }

            // Create new preview
            const preview = {
              url: URL.createObjectURL(file),
              name: file.name,
              type: file.type === "application/pdf" ? "pdf" : "image",
            };

            setNewFilePreview(preview);
            // Clear existing file reference
            setExistingFilePreview(null);
            form.setValue(existingFileUrlPath, "");
            form.setValue(existingFileNamePath, "");
          }
        };

        const { getRootProps, getInputProps } = useDropzone({
          onDrop,
          multiple: false,
          accept: {
            "image/*": [".png", ".jpg", ".jpeg"],
            "application/pdf": [".pdf"],
          },
        });

        const imageFileSuffix = ["jpg", "png", "jpeg"];

        // The active file preview (either existing or new)
        const filePreview = existingFilePreview || newFilePreview;

        // Handle deletion of existing file
        const handleDeleteExisting = () => {
          setExistingFilePreview(null);
          form.setValue(existingFileUrlPath, "");
          form.setValue(existingFileNamePath, "");
        };

        // Handle deletion of new file
        const handleDeleteNew = () => {
          if (newFilePreview) {
            URL.revokeObjectURL(newFilePreview.url);
          }
          setNewFilePreview(null);
          field.onChange(null);
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
                  Drag & drop a file here, or click to select
                </p>
              </div>
            )}

            {form.formState.errors[name] && (
              <p className="text-red-500 text-sm mt-2">
                {form.formState.errors[name].message as string}
              </p>
            )}

            {filePreview && (
              <div className="mt-6">
                {(() => {
                  let fileType = filePreview.type;
                  if (filePreview.url.includes("cloudflarestorage")) {
                    const tokens = filePreview.url?.split("?")[0].split(".");
                    const fileSuffix = tokens?.at(tokens.length - 1);
                    if (fileSuffix) {
                      fileType = imageFileSuffix.includes(fileSuffix)
                        ? "image"
                        : "pdf";
                    }
                  }

                  if (fileType === "image") {
                    return (
                      <div className="flex flex-col items-center relative">
                        {!readOnly && (
                          <button
                            onClick={() => {
                              if (existingFilePreview) {
                                handleDeleteExisting();
                              } else {
                                handleDeleteNew();
                              }
                            }}
                            className="absolute top-0 right-3 text-red-500 rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 z-10"
                            type="button"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <div className="relative w-32 h-32 rounded overflow-hidden border">
                          <Image
                            src={filePreview.url}
                            alt="File preview"
                            height={128}
                          />
                        </div>
                        <p className="text-sm mt-2 text-center break-words max-w-[160px]">
                          {filePreview.name}
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex flex-col items-center relative">
                        {!readOnly && (
                          <button
                            onClick={() => {
                              if (existingFilePreview) {
                                handleDeleteExisting();
                              } else {
                                handleDeleteNew();
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
                        <div className="mb-1">{filePreview.name}</div>
                        {readOnly && (
                          <div>
                            <Button
                              variant="outline"
                              className={variantButtonClassName}
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = filePreview.url;
                                link.download =
                                  filePreview.name || "document.pdf";
                                link.target = "_blank";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
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
                })()}
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

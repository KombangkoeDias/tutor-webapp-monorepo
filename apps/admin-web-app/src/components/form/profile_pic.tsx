"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, X } from "lucide-react";
import { Spin } from "antd";

// Define types for crop settings and result data
export interface CropSettings {
  x: number;
  y: number;
  zoom: number;
  croppedAreaPixels?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ProfilePictureData {
  originalImage: string | null; // URL or base64 of original image
  cropSettings: CropSettings; // Stored crop settings for future editing
}

interface ProfilePictureUploaderProps {
  // Function that receives all data needed for storage
  onSave: (data: ProfilePictureData) => void;

  // Initial data from database
  defaultOriginalImage?: string; // S3 URL to original image
  defaultCropSettings?: CropSettings; // Saved crop settings

  size?: "sm" | "md" | "lg" | "xl";
  readOnly: boolean;
}

export default function ProfilePictureUploader({
  onSave,
  defaultOriginalImage,
  defaultCropSettings,
  size = "lg",
  readOnly,
}: ProfilePictureUploaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(
    defaultCropSettings?.croppedAreaPixels || null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!!defaultOriginalImage) {
      setIsLoading(true);
      getCroppedImg(defaultOriginalImage, croppedAreaPixels).then((img) => {
        setCroppedImage(img);
        setIsLoading(false);
      });
    }
  }, [defaultOriginalImage, defaultCropSettings]);

  // Size mapping for avatar
  const sizeMap = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40",
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <Avatar
          className={`${sizeMap[size]} ${
            readOnly
              ? `cursor-default`
              : `cursor-pointer hover:opacity-90  transition-opacity relative group`
          } `}
          onClick={() => {
            if (readOnly) {
              return;
            }
            setIsModalOpen(true);
          }}
        >
          <AvatarImage
            src={croppedImage || undefined}
            className={`${sizeMap[size]} rounded-full border-4 border-teal-500 shadow-lg`}
          />
          <AvatarFallback>
            {isLoading && <Spin size="large" />}
            {!isLoading && <User size={50} />}
          </AvatarFallback>
          {!readOnly && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              <Upload className="h-1/3 w-1/3 text-white" />
            </div>
          )}
        </Avatar>
        {!readOnly && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs"
            type="button"
          >
            Change Photo
          </Button>
        )}
      </div>
    </>
  );
}

/**
 * This function creates a cropped image from the source image
 * using the cropping coordinates
 */
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any
): Promise<string> => {
  // For S3 or other remote URLs, we need to handle them differently than base64 strings
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return imageSrc;
  }

  // Set canvas size to the desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As Base64 string
  return canvas.toDataURL("image/jpeg");
};

/**
 * Creates an image element from a source
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous"; // This helps avoid CORS issues with S3 URLs
    image.src = url;
  });

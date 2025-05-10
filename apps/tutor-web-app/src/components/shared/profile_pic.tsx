"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User, X } from "lucide-react";
import { Modal, Spin } from "antd";

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
  profilePage: boolean;
}

export default function ProfilePictureUploader({
  onSave,
  defaultOriginalImage,
  defaultCropSettings,
  size = "lg",
  readOnly,
  profilePage,
}: ProfilePictureUploaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(
    defaultOriginalImage || null
  );
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const [crop, setCrop] = useState({
    x: defaultCropSettings?.x || 0,
    y: defaultCropSettings?.y || 0,
  });
  const [zoom, setZoom] = useState(defaultCropSettings?.zoom || 1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(
    defaultCropSettings?.croppedAreaPixels || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  useEffect(() => {
    if (!!defaultOriginalImage) {
      setIsLoading(true);
      getCroppedImg(
        defaultOriginalImage,
        defaultCropSettings?.croppedAreaPixels
      ).then((img) => {
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setOriginalImage(reader.result as string);
        // Reset crop and zoom when a new image is uploaded
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setIsEditingExisting(false);
      });
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (!originalImage || !croppedAreaPixels) return;

      // Generate the cropped image
      const croppedImg = await getCroppedImg(originalImage, croppedAreaPixels);
      setCroppedImage(croppedImg);

      // Prepare the complete data object for storage
      const profileData: ProfilePictureData = {
        originalImage: originalImage, // This could be a base64 string or URL
        cropSettings: {
          x: crop.x,
          y: crop.y,
          zoom: zoom,
          croppedAreaPixels: croppedAreaPixels,
        },
      };

      // Pass all data to parent component for storage
      onSave(profileData);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
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
            {profilePage ? "เปลี่ยนรูปโปรไฟล์" : "อัพโหลดรูปโปรไฟล์"}
          </Button>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        title={profilePage ? "แก้ไขรูปโปรไฟล์" : "อัพโหลดรูปโปรไฟล์"}
        footer={[
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            type="button"
            className="mr-2"
          >
            ยกเลิก
          </Button>,
          <Button
            onClick={handleSave}
            disabled={isLoading || !originalImage}
            type="button"
          >
            {isLoading ? "กำลังบันทึกรูป..." : "บันทึก"}
          </Button>,
        ]}
        width={500}
        zIndex={1500} // Ensure it's higher than the drawer
      >
        {!originalImage ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium">
              {isDragActive
                ? "วางรูปภาพที่นี่"
                : "ลากและวางรูปภาพที่นี่, หรือคลิกเพื่อเลือกไฟล์"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              รองรับไฟล์สกุล .JPG, .PNG, และ .GIF
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Cropper
                image={originalImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>ขยาย</span>
                <span>{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOriginalImage(null);
                  setCroppedImage(null);
                  setIsEditingExisting(false);
                }}
                type="button"
              >
                <X className="h-4 w-4 mr-2" />
                ลบรูป
              </Button>
              <Button
                variant="outline"
                size="sm"
                {...getRootProps()}
                type="button"
              >
                <Upload className="h-4 w-4 mr-2" />
                เลือกรูปใหม่
                <input {...getInputProps()} />
              </Button>
            </div>
          </div>
        )}
      </Modal>
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

"use client";

import { useSharedConstants } from "@/components/hooks/constant-context";
import { useAuthRedirect } from "@/components/hooks/use-auth-redirect";
import { adminController } from "@/services/controller";
import { Skeleton, Tag, Input, Button } from "antd";
import { useState } from "react";

export default function ConstantsPage() {
  useAuthRedirect();
  const { isLoading, subjects, tags, refetchSubjects, refetchTags } =
    useSharedConstants();
  // show all subjects in one row
  const [subject, setSubject] = useState("");
  const [tag, setTag] = useState("");
  // show skeleton while loading
  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton active />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subjects ที่มีอยู่ตอนนี้</h1>
      <div className="flex flex-row gap-2">
        {Object.entries(subjects).map(([key, value]) => (
          <Tag color="blue" key={key} className="text-md">
            {value}
          </Tag>
        ))}
      </div>
      {/*  เพิ่ม subject */}
      <div className="grid grid-cols-12 gap-2">
        <Input
          placeholder="เพิ่ม subject"
          className="mt-4 col-span-5"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
          }}
          onPressEnter={async () => {
            await adminController.AddSubject(subject);
            refetchSubjects();
          }}
        />
        <Button
          type="primary"
          className="mt-4 col-span-2"
          onClick={async () => {
            await adminController.AddSubject(subject);
            refetchSubjects();
          }}
        >
          เพิ่ม subject
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4 mt-8">Tags ที่มีอยู่ตอนนี้</h1>
      <div className="flex flex-row gap-2">
        {Object.entries(tags).map(([key, value]) => (
          <Tag color="blue" key={key} className="text-md">
            {value}
          </Tag>
        ))}
      </div>
      {/* เพิ่ม tag */}
      <div className="grid grid-cols-12 gap-2">
        <Input
          placeholder="เพิ่ม tag"
          className="mt-4 col-span-5"
          value={tag}
          onChange={(e) => {
            setTag(e.target.value);
          }}
          onPressEnter={async () => {
            await adminController.AddTag(tag);
            refetchTags();
          }}
        />
        <Button
          type="primary"
          className="mt-4 col-span-2"
          onClick={async () => {
            await adminController.AddTag(tag);
            refetchTags();
          }}
        >
          เพิ่ม tag
        </Button>
      </div>
    </div>
  );
}

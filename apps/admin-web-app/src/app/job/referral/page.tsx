"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { adminController } from "@/services/controller";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Spin } from "antd";
import SelectField from "@/chulatutordream/components/shared/select";
import {
  handleGenerateLink,
  handleListReferredJobsLink,
  handleListReferredJobsLinkForTutor,
  handleSignUpLink,
} from "@/chulatutordream/lib/utils";

enum CreateCodeOptions {
  TUTOR = "ติวเตอร์ที่สมัครกับเรา",
  NOT_TUTOR = "คนทั่วไป",
}

export default function () {
  const [name, setName] = useState<string>("");
  const [tutor, setTutor] = useState<
    { label: string; value: number } | undefined
  >(undefined);

  const [mode, setMode] = useState<CreateCodeOptions>(CreateCodeOptions.TUTOR);

  const {
    data: codes,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["getAllCodes"],
    queryFn: async () => {
      const resp = await adminController.GetCodes();
      return resp.codes;
    },
    initialData: [],
  });

  const {
    data: tutors,
    refetch: refetchTutors,
    isFetching: isFetchingTutors,
  } = useQuery({
    queryKey: ["getAllTutors"],
    queryFn: async () => {
      const data = await adminController.GetAllTutors(false);
      const tutors = [
        ...(data.to_review?.sign_up || []),
        ...(data.to_review?.edit_profile || []),
        ...(data.pending || []),
        ...(data.others || []),
      ].map((tutor: any) => ({
        id: tutor.id,
        name: tutor.name,
      }));
      return tutors;
    },
    initialData: [],
  });

  const handleAddCode = async () => {
    await adminController.AddCode(name, tutor?.value);
    refetch();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">เพิ่ม Referral Code</h1>

      <div className="flex gap-2 items-end mb-4">
        <div className="flex-1">
          <Label>สร้างโค้ดให้</Label>
          <SelectField
            placeholder="Select Tutor"
            options={[CreateCodeOptions.TUTOR, CreateCodeOptions.NOT_TUTOR]}
            field={{
              value: mode,
              onChange: (value: any) => {
                setMode(value);
                if (value === CreateCodeOptions.NOT_TUTOR) {
                  setTutor(undefined);
                  setName("");
                }
              },
            }}
            className="mt-2 mb-2"
            mode="VALUE_ONLY"
          />
          {mode === CreateCodeOptions.TUTOR && (
            <>
              <Label>ติวเตอร์เจ้าของโค้ด</Label>
              <SelectField
                placeholder="Select Tutor"
                options={tutors.map((item) => ({
                  label: `${item.id} ${item.name}`,
                  value: item.id,
                }))}
                field={{
                  value: tutor,
                  onChange: (value: any) => {
                    setTutor(value);
                    setName(
                      tutors.find((t) => t.id === value.value)?.name ?? ""
                    );
                  },
                }}
                className="mt-2"
              />
            </>
          )}
          {mode === CreateCodeOptions.NOT_TUTOR && (
            <>
              <Label htmlFor="name">Code Name</Label>
              <Input
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
              />
            </>
          )}
        </div>
        <Button onClick={handleAddCode}>Add Code</Button>
      </div>

      <h1 className="text-2xl font-bold">Referral Code ทั้งหมด</h1>

      {(isFetching || isFetchingTutors) && (
        <div className="flex justify-center items-center">
          <Spin />
        </div>
      )}

      {!isFetching && !isFetchingTutors && (
        <div className="space-y-4">
          {codes.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 space-y-2">
                <div>
                  <strong>Name:</strong> {item.name}
                </div>
                <div>
                  <strong>Code:</strong> {item.code}
                </div>
                {item.tutor_id && (
                  <div>
                    <strong>Tutor Id:</strong> {item.tutor_id}
                  </div>
                )}
                <Button
                  size="sm"
                  onClick={() => handleGenerateLink(item.code)}
                  className="mr-4"
                >
                  Copy Link สร้างงาน
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSignUpLink(item.code)}
                  className="mr-4"
                >
                  Copy Link สมัครติวเตอร์
                </Button>
                {!item.tutor_id && (
                  <Button
                    size="sm"
                    onClick={() => handleListReferredJobsLink(item.code)}
                  >
                    Copy Link ลิสต์งาน/การจองงาน
                  </Button>
                )}
                {item.tutor_id && (
                  <Button
                    size="sm"
                    onClick={() =>
                      handleListReferredJobsLinkForTutor(item.code)
                    }
                  >
                    Copy Link ลิสต์งาน/การจองงาน
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

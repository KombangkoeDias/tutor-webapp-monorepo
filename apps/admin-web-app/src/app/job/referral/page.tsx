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

export default function () {
  const [name, setName] = useState<string>("");
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

  const handleAddCode = async () => {
    await adminController.AddCode(name);
    refetch();
  };

  const handleGenerateLink = async (code: string) => {
    const baseLink = "https://chulatutordream.com"; // Replace with your actual URL
    const link = `${baseLink}/jobs/create?utm_ref=${code}`;
    await copyToClipboard(link);
  };

  const handleListReferredJobsLink = async (code: string) => {
    const baseLink = "https://chulatutordream.com"; // Replace with your actual URL
    const link = `${baseLink}/jobs/referral?utm_ref=${code}`;
    await copyToClipboard(link);
  };

  const copyToClipboard = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error(`Failed to copy link: ${err}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">เพิ่ม Referral Code</h1>

      <div className="flex gap-2 items-end mb-4">
        <div className="flex-1">
          <Label htmlFor="name">Code Name</Label>
          <Input
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button onClick={handleAddCode}>Add Code</Button>
      </div>

      <h1 className="text-2xl font-bold">Referral Code ทั้งหมด</h1>

      {isFetching && (
        <div className="flex justify-center items-center">
          <Spin />
        </div>
      )}

      {!isFetching && (
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
                <Button
                  size="sm"
                  onClick={() => handleGenerateLink(item.code)}
                  className="mr-4"
                >
                  Copy Link สร้างงาน
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleListReferredJobsLink(item.code)}
                >
                  Copy Link ลิสต์งาน
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

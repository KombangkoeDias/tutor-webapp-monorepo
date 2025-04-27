"use client";
import React, { act, useRef, useState } from "react";
import {
  Button as AntdButton,
  Card,
  Collapse,
  CollapseProps,
  Spin,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { adminController } from "@/services/controller";
import { useAuthRedirect } from "@/components/hooks/use-auth-redirect";
import { variantButtonClassName } from "@/chulatutordream/lib/constants";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import toast from "react-hot-toast";

type TutorReviewData = {
  id: number;
  title: string;
  name: string;
  educational_background: any[];
  admin_comments: any[];
  accolade: string;
  preferred_job_subject: number[];
  preferred_job_level: string[];
};

export default function TutorReviewListPage() {
  useAuthRedirect();

  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());

  const addKey = (key: number) => {
    const myset = new Set<number>();
    activeKeys.forEach((s) => {
      myset.add(s);
    });
    myset.add(key);
    setActiveKeys(myset);
  };

  const removeKey = (key: number) => {
    const myset = new Set<number>();
    activeKeys.forEach((s) => {
      if (s !== key) {
        myset.add(s);
      }
    });
    setActiveKeys(myset);
  };

  const handleCopy = (chunk: any[]) => {
    if (isFetching) {
      return;
    }
    navigator.clipboard
      .writeText(chunk.map((c) => c.text).join(""))
      .then(() => {
        toast.success("Copied!", { position: "bottom-right" });
      });
  };

  const openChat = `ติดตามงานสอนได้ที่ OpenChat.
https://line.me/ti/g2/KDuqiRlbBHx9EgKeiio1Lc8YZLPATL64YDrQ9w?utm_source=invitation&utm_medium=link_copy&utm_campaign=default \n`;

  const handleCopyFB = (chunk: any[]) => {
    if (isFetching) {
      return;
    }
    navigator.clipboard
      .writeText(chunk.map((c) => c.text + openChat).join(""))
      .then(() => {
        toast.success("Copied!", { position: "bottom-right" });
      });
  };

  const {
    data: jobsPrettyPrint,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["getAllJobsPrettyPrint"],
    queryFn: async () => {
      const resp = await adminController.JobsPrettyPrint();
      const myset = new Set<number>();
      resp.jobs.map((_, index) => myset.add(index));
      setActiveKeys(myset);
      return resp.jobs;
    },
    initialData: [],
  });

  return (
    <div>
      <h1 className="text-2xl text-center m-4">งานทั้งหมดที่สามารถจองได้</h1>

      <div className="flex justify-center m-4 gap-2">
        <Button
          variant="outline"
          className={variantButtonClassName + " w-[300px]"}
          onClick={() => {
            refetch();
          }}
        >
          Refresh
        </Button>
      </div>
      {!isFetching &&
        jobsPrettyPrint.map((chunk, index) => {
          const items: CollapseProps["items"] = [
            {
              key: "1",
              label: `รหัสงาน: ${chunk.map((c) => c.id).join(", ")}`,
              children: (
                <div className="flex justify-center">
                  <Card
                    className="m-4"
                    extra={
                      <Button
                        variant="outline"
                        className="bg-[#4caf4f] hover:bg-[#4caf4f]/90 text-white hover:text-white"
                        onClick={() => {
                          removeKey(index);
                          handleCopy(chunk);
                        }}
                        disabled={!activeKeys.has(index)}
                      >
                        Copy
                      </Button>
                    }
                    style={{ width: 600, border: "2px solid black" }}
                  >
                    <p className="whitespace-pre-line">
                      {chunk.map((c) => c.text).join("")}
                    </p>
                  </Card>
                  <Card
                    className="m-4"
                    extra={
                      <Button
                        variant="outline"
                        className="bg-[#4caf4f] hover:bg-[#4caf4f]/90 text-white hover:text-white"
                        onClick={() => {
                          removeKey(index);
                          handleCopyFB(chunk);
                        }}
                        disabled={!activeKeys.has(index)}
                      >
                        Copy
                      </Button>
                    }
                    style={{ width: 600, border: "2px solid black" }}
                  >
                    <p className="whitespace-pre-line">
                      {chunk.map((c) => c.text + openChat).join("")}
                    </p>
                  </Card>
                </div>
              ),
            },
          ];
          return (
            <Collapse
              items={items}
              defaultActiveKey={["1"]}
              activeKey={activeKeys.has(index) ? ["1"] : []}
              className="mt-4"
              onChange={(keys) => {
                if (keys.length > 0) {
                  addKey(index);
                } else {
                  removeKey(index);
                }
              }}
            />
          );
        })}
      {isFetching && (
        <div className="flex justify-center items-center h-screen m-4">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}

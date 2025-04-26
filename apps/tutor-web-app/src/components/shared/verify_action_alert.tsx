"use client";

import { Alert } from "antd";
import { useLoggedIn } from "../hooks/login-context";

export enum Action {
  RESERVE_JOB = "reserve_job",
}

function defaultAllowUserAction(loggedIn: boolean, tutor: any) {
  if (!loggedIn) {
    return false;
  }

  if (!tutor?.email_verified) {
    return false;
  }

  if (!tutor?.admin_verified) {
    return false;
  }

  return true;
}

export function canUserMakeAction(
  loggedIn: boolean,
  tutor: any,
  action: Action
) {
  switch (action) {
    case Action.RESERVE_JOB:
      return defaultAllowUserAction(loggedIn, tutor);
    default:
      return false;
  }
}

type VerifyActionAlertProps = {
  action: string;
};

export function VerifyActionAlert(props: VerifyActionAlertProps) {
  const { loggedIn, tutor } = useLoggedIn();
  if (loggedIn) {
    if (!tutor?.email_verified) {
      return (
        <Alert
          className="mb-4"
          type="warning"
          message={`แอคเคาน์ของท่านยังไม่ได้ยืนยันอีเมล กรุณายืนยันอีเมลก่อน${props.action}`}
          showIcon
        />
      );
    }
    if (!tutor?.admin_verified) {
      return (
        <Alert
          className="mb-4"
          type="warning"
          message={`แอคเคาน์ของท่านยังไม่ได้รับการยืนยันจากแอดมิน กรุณารอแอดมินยืนยันก่อน${props.action}`}
          showIcon
        />
      );
    }
    return <></>;
  } else {
    return (
      <Alert
        className="mb-4"
        type="info"
        message={`กรุณา log in เพื่อ${props.action}`}
        showIcon
      />
    );
  }
}

import { createStyles } from "antd-style";

export enum ReservationStatus {
  RESERVED = "reserved",
  APPROVED = "approved",
  BACKUP = "backup",
  REJECTED = "rejected",
  PENDING_REFUND = "pending-refund",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  REFUNDED = "refunded",
}

export const mapReservationStatusToTooltipText = (
  status: ReservationStatus
) => {
  switch (status) {
    case ReservationStatus.RESERVED:
      return "ท่านได้จองงานนี้แล้ว ผู้ปกครอง/นักเรียน จะทำการตรวจเช็คโปรไฟล์ของติวเตอร์และเลือกติวเตอร์";
    case ReservationStatus.APPROVED:
      return "ท่านได้รับเลือกจากผู้ปกครอง/นักเรียน ให้เป็นติวเตอร์ในงานนี้ กรุณาจ่ายค่าแนะนำเพื่อรับข้อมูลติดต่อ";
    case ReservationStatus.BACKUP:
      return "ท่านได้รับเลือกจากผู้ปกครอง/นักเรียน ให้เป็นติวเตอร์สำรองในงานนี้ ท่านจะได้งานหากติวเตอร์หลักยกเลิกการจองงาน";
    case ReservationStatus.CANCELLED:
      return "งานถูกยกเลิก โดยผู้ปกครอง/นักเรียน หรือ ไม่มีการเคลื่อนไหวภายในเวลาที่กำหนด";
    case ReservationStatus.REJECTED:
      return "การจองงานของท่านไม่ถูกรับเลือก";
    case ReservationStatus.COMPLETED:
      return "การจองงานของท่านเสร็จสมบูรณ์";
    case ReservationStatus.PENDING_REFUND:
      return "การจองงานของท่านกำลังรอการคืนเงินค่าแนะนำ";
    case ReservationStatus.REFUNDED:
      return "ท่านได้รับการคืนเงินค่าแนะนำแล้ว";
  }
};

export const mapReservationStatusToColor = (status: ReservationStatus) => {
  switch (status) {
    case ReservationStatus.RESERVED:
      return "blue";
    case ReservationStatus.APPROVED:
      return "purple";
    case ReservationStatus.BACKUP:
      return "indigo";
    case ReservationStatus.CANCELLED:
      return "orange";
    case ReservationStatus.REJECTED:
      return "red";
    case ReservationStatus.COMPLETED:
      return "green";
    case ReservationStatus.PENDING_REFUND:
      return "yellow";
    case ReservationStatus.REFUNDED:
      return "blue-inverse";
  }
};

export enum PaymentStatus {
  PAID = "paid",
  UNPAID = "unpaid",
  FAILED = "failed",
}

export const Level1Options = [
  { label: "ประถม", value: "ประถม" },
  { label: "มัธยมต้น", value: "มัธยมต้น" },
  { label: "มัธยมปลาย", value: "มัธยมปลาย" },
  { label: "มหาลัย", value: "มหาลัย" },
  { label: "อื่นๆ", value: ["อนุบาล", "ก่อนอนุบาล", "วัยทำงาน"] },
];

export const useTableStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

export const variantButtonClassName =
  "border-[#30b0c7] text-[#30b0c7] hover:bg-[#30b0c7]/10 px-4 py-3 text-md rounded-md";

export const mapPaymentStatusToColor = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PAID:
      return "green";
    case PaymentStatus.UNPAID:
      return "blue";
    case PaymentStatus.FAILED:
      return "red";
  }
};

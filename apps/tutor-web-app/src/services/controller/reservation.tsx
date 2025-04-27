import toast from "react-hot-toast";
import { ENDPOINTS, GET, POST } from "../backend";
import BaseController from "./base";
import queryString from "query-string";

class ReservationController extends BaseController {
  constructor() {
    super();
  }

  protected async GetReservationHistory() {
    const resp = await GET(ENDPOINTS.RESERVATION_HISTORY_ENDPOINT);
    return this.handleResponse(resp);
  }

  protected async GetReservationById(id: string) {
    const resp = await GET(ENDPOINTS.GET_RESERVATION_BY_ID_ENDPOINT(id));
    return this.handleResponse(resp);
  }

  protected async GenerateQRCode(
    reservationId: string,
    force: boolean = false
  ) {
    const resp = await POST(ENDPOINTS.GENERATE_QR_CODE_ENDPOINT, {
      reservationId: reservationId,
      force: force,
    });
    return this.handleResponse(resp);
  }

  protected async GetReservationList(
    jobId: number,
    code: string
  ): Promise<any> {
    const query = queryString.stringify({ jobId, code });
    const resp = await GET(
      ENDPOINTS.GET_RESERVATION_LIST_ENDPOINT + "?" + query
    );
    return this.handleResponse(resp);
  }

  protected async ApproveReservation(
    code: string,
    reservationId: number,
    backupReservationId?: number
  ): Promise<any> {
    const resp = await POST(ENDPOINTS.APPROVE_RESERVATION_ENDPOINT, {
      code,
      reservationId,
      backupReservationId,
    });
    return this.handleResponse(resp);
  }
}

class ReservationControllerToaster extends ReservationController {
  public async GetReservationHistory() {
    return this.showToastOnError(() => super.GetReservationHistory());
  }

  public async GetReservationById(id: string) {
    return this.showToastOnError(() => super.GetReservationById(id));
  }

  public async GenerateQRCode(reservationId: string, force: boolean = false) {
    return toast.promise(
      super.GenerateQRCode(reservationId, force),
      this.getToastConfig("กำลังโหลด QR Code...")
    );
  }

  public async GetReservationList(jobId: number, code: string): Promise<any> {
    return this.showToastOnError(() => super.GetReservationList(jobId, code));
  }

  public async ApproveReservation(
    code: string,
    reservationId: number,
    backupReservationId?: number
  ): Promise<any> {
    return toast.promise(
      super.ApproveReservation(code, reservationId, backupReservationId),
      this.getToastConfig("กำลังยืนยันการเลือกติวเตอร์")
    );
  }
}

export const reservationController = new ReservationControllerToaster();

import toast from "react-hot-toast";
import { ENDPOINTS, GET, POST, PUT } from "../backend";
import BaseController from "./base";

enum UploadType {
  PROFILE_PIC = "profile_pic",
  ID_CARD = "id_card",
}

class TutorController extends BaseController {
  constructor() {
    super();
  }

  protected async UploadReceipt(
    file: File,
    fileName?: string
  ): Promise<string> {
    const { file_name, url } = await this.getPresignedUploadURL(
      ENDPOINTS.UPLOAD_RECEIPT_ENDPOINT,
      file.type,
      fileName
    );
    await PUT(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    return file_name;
  }

  protected async AddSlip(reservationId: number, slip: string) {
    await POST(ENDPOINTS.ADD_SLIP_ENDPOINT, {
      reservationId,
      slip,
    });
  }

  protected async UploadImage(file: File, fileName?: string): Promise<string> {
    const { file_name, url } = await this.getPresignedUploadURL(
      ENDPOINTS.UPLOAD_ENDPOINT,
      file.type,
      fileName,
      UploadType.ID_CARD
    );
    await PUT(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    return file_name;
  }

  protected async UploadBase64(blob: Blob, fileName?: string): Promise<string> {
    const { file_name, url } = await this.getPresignedUploadURL(
      ENDPOINTS.UPLOAD_ENDPOINT,
      blob.type,
      fileName,
      UploadType.PROFILE_PIC
    );
    await PUT(url, blob, {
      headers: {
        "Content-Type": blob.type,
      },
    });
    return file_name;
  }

  protected async SignUp(data: any): Promise<string> {
    const resp = await POST(ENDPOINTS.SIGNUP_ENDPOINT, data);
    return this.handleResponse(resp);
  }

  protected async Login(data: any): Promise<string> {
    const resp = await POST(ENDPOINTS.LOGIN_ENDPOINT, data);
    return this.handleResponse(resp);
  }

  protected async Authenticate(token: string): Promise<string> {
    const resp = await POST(
      ENDPOINTS.AUTHENTICATE_ENDPOINT,
      {} // The token will be added in interceptors;
    );
    return this.handleResponse(resp);
  }

  protected async AddEmailForNews(email: string): Promise<void> {
    const resp = await POST(ENDPOINTS.ADD_EMAIL_FOR_NEWS, { email });
    return this.handleResponse(resp);
  }

  protected async ResendVerifyEmail(): Promise<void> {
    const resp = await POST(ENDPOINTS.RESEND_VERIFY_EMAIL_ENDPOINT, {});
    return this.handleResponse(resp);
  }

  protected async LoadTutorProfile(): Promise<any> {
    const resp = await GET(ENDPOINTS.PROFILE_ENDPOINT);
    return this.handleResponse(resp);
  }

  protected async UpdateProfile(values: any): Promise<any> {
    const resp = await POST(ENDPOINTS.PROFILE_ENDPOINT, values);
    return this.handleResponse(resp);
  }

  protected async VerifyTutor(code: string, email: string): Promise<any> {
    const resp = await POST(ENDPOINTS.VERIFY_TUTOR_ENDPOINT, { code, email });
    return this.handleResponse(resp);
  }

  protected async cancelReservation(reservationId: number): Promise<any> {
    const resp = await POST(ENDPOINTS.CANCEL_RESERVATION, {
      reservationId: reservationId,
    });
    return this.handleResponse(resp);
  }

  protected async getReferral() {
    const resp = await GET(ENDPOINTS.REFERRAL);
    return this.handleResponse(resp);
  }

  protected async createReferral() {
    const resp = await POST(ENDPOINTS.REFERRAL, {});
    return this.handleResponse(resp);
  }

  protected async listByReferral(code?: string) {
    const resp = await GET(ENDPOINTS.LIST_BY_REFERRAL + `?code=${code}`);
    return this.handleResponse(resp);
  }

  private async getPresignedUploadURL(
    endpoint: string,
    fileType: string,
    fileName?: string,
    upload_type?: string
  ): Promise<{
    file_name: string;
    url: string;
  }> {
    const resp = await POST(endpoint, {
      file_type: fileType,
      file_name: fileName,
      upload_type: upload_type,
    });
    return this.handleResponse(resp);
  }
}

class TutorControllerToaster extends TutorController {
  constructor() {
    super();
  }

  public UploadReceipt(file: File, fileName?: string): Promise<string> {
    return toast.promise(
      super.UploadReceipt(file, fileName),
      this.getToastConfig("กำลังอัพโหลด slip")
    );
  }

  public AddSlip(reservationId: number, slip: string) {
    return toast.promise(
      super.AddSlip(reservationId, slip),
      this.getToastConfig("กำลังส่ง slip")
    );
  }

  public UploadImage(
    file: File,
    fileName?: string,
    needToast: boolean = true
  ): Promise<string> {
    if (needToast) {
      return toast.promise(
        super.UploadImage(file, fileName),
        this.getToastConfig("กำลังอัพโหลดรูปภาพ")
      );
    }
    return super.UploadImage(file, fileName);
  }

  public UploadBase64(blob: Blob, fileName?: string): Promise<string> {
    return super.UploadBase64(blob, fileName);
  }

  public SignUp(data: any): Promise<any> {
    return toast.promise(
      super.SignUp(data),
      this.getToastConfig("กำลังสมัครสมาชิก")
    );
  }

  public Authenticate(token: string): Promise<any> {
    return super.Authenticate(token);
  }

  public AddEmailForNews(email: string): Promise<void> {
    return toast.promise(
      super.AddEmailForNews(email),
      this.getToastConfig("กำลังเพิ่มอีเมลสำหรับข่าวสาร")
    );
  }

  public Login(data: { email: string; password: string }): Promise<any> {
    return toast.promise(
      super.Login(data),
      this.getToastConfig("กำลังเข้าสู่ระบบ")
    );
  }

  public resendVerifyEmail(): Promise<void> {
    return toast.promise(
      super.ResendVerifyEmail(),
      this.getToastConfig("กำลังส่งอีเมลยืนยันตัวตน")
    );
  }

  public LoadTutorProfile(): Promise<any> {
    return this.showToastOnError(() => super.LoadTutorProfile());
  }

  public UpdateProfile(values: any): Promise<any> {
    return toast.promise(
      super.UpdateProfile(values),
      this.getToastConfig("กำลังอัพเดตโปรไฟล์")
    );
  }

  public VerifyTutor(code: string, email: string): Promise<any> {
    return this.showToastOnError(() => super.VerifyTutor(code, email));
  }

  public getReferral() {
    return this.showToastOnError(() => super.getReferral());
  }

  public createReferral() {
    return this.showToastOnError(() => super.createReferral());
  }

  public cancelReservation(reservationId: number): Promise<any> {
    return toast.promise(
      super.cancelReservation(reservationId),
      this.getToastConfig("กำลังยกเลิกการจองงาน")
    );
  }

  public listByReferral(code?: string) {
    return this.showToastOnError(() => super.listByReferral(code));
  }
}

export const tutorController = new TutorControllerToaster();

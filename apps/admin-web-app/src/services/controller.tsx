import { GET, POST, PUT } from "@/chulatutordream/services/backend";
import { ENDPOINTS } from "./backend";
import toast from "react-hot-toast";
import queryString from "query-string";
import BaseController from "@/chulatutordream/services/controller/base";

class AdminController extends BaseController {
  constructor() {
    super();
  }

  protected async Login(email: string, password: string) {
    const resp = await POST(ENDPOINTS.LOGIN_ENDPOINT, { email, password });
    return this.handleResponse(resp);
  }

  protected async Authenticate() {
    const resp = await POST(ENDPOINTS.AUTHENTICATE_ENDPOINT, {});
    return this.handleResponse(resp);
  }

  protected async GetAllTutors(only_unverified: boolean) {
    var endpoint = ENDPOINTS.GET_ALL_TUTORS;
    const query = queryString.stringify({ only_unverified });
    if (query.length > 0) {
      endpoint = endpoint + "?" + query;
    }
    const resp = await GET(endpoint);
    return this.handleResponse(resp);
  }

  protected async GetAllReservations(statuses: string[]) {
    var endpoint = ENDPOINTS.GET_ALL_RESERVATIONS;
    const query = queryString.stringify({ statuses });
    if (query.length > 0) {
      endpoint = endpoint + "?" + query;
    }
    const resp = await GET(endpoint);
    return this.handleResponse(resp);
  }

  protected async GetTutorById(id: number, pendingEditProfile: boolean) {
    const resp = await GET(
      ENDPOINTS.GET_TUTOR_BY_ID +
        `${id}` +
        "?" +
        `pendingEditProfile=${pendingEditProfile}`
    );
    return this.handleResponse(resp);
  }

  protected async ApproveTutor(id: number, pendingEditProfile: boolean) {
    const resp = await POST(ENDPOINTS.APPROVE_TUTOR_ENDPOINT, {
      tutorId: id,
      pendingEditProfile,
    });
    return this.handleResponse(resp);
  }

  protected async AddComment(
    tutorId: number,
    comment: string,
    pendingEditProfile: boolean
  ) {
    const resp = await POST(ENDPOINTS.ADD_COMMENT_ENDPOINT, {
      tutorId,
      comment,
      pendingEditProfile,
    });
    return this.handleResponse(resp);
  }

  protected async AddSubject(subject: string) {
    const resp = await POST(ENDPOINTS.ADD_SUBJECT_ENDPOINT, {
      subjects: [subject],
    });
    return this.handleResponse(resp);
  }

  protected async AddTag(tag: string) {
    const resp = await POST(ENDPOINTS.ADD_TAG_ENDPOINT, {
      tags: [tag],
    });
    return this.handleResponse(resp);
  }

  protected async MarkRefund(reservationId: number) {
    const resp = await POST(ENDPOINTS.MARK_REFUND_ENDPOINT, { reservationId });
    return this.handleResponse(resp);
  }

  protected async UploadFile(file: File, file_name?: string) {
    const { file_name: generatedFileName, url } =
      await this.getPresignedUploadURL(file.type, file_name);
    await PUT(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    return generatedFileName;
  }

  protected async ManualRefund(
    reservationId: number,
    receiptFileKey: string,
    amount?: number
  ) {
    const resp = await POST(ENDPOINTS.MANUAL_REFUND, {
      reservationId,
      receiptFileKey,
      amount,
    });
    return this.handleResponse(resp);
  }

  protected async JobsPrettyPrint() {
    const resp = await GET(ENDPOINTS.JOBS_PRETTY_PRINT);
    return this.handleResponse(resp);
  }

  protected async ListReservationSlip() {
    const resp = await GET(ENDPOINTS.LIST_RESERVATION_SLIP);
    return this.handleResponse(resp);
  }

  protected async ApproveSlip(reservationId: number) {
    const resp = await POST(ENDPOINTS.APPROVE_SLIP, { reservationId });
    return this.handleResponse(resp);
  }

  protected async GetCodes() {
    const resp = await GET(ENDPOINTS.REFERRAL_CODES);
    return this.handleResponse(resp);
  }

  protected async GetPayouts() {
    const resp = await GET(ENDPOINTS.PAYOUTS);
    return this.handleResponse(resp);
  }

  protected async AddCode(name: string, tutor_id?: number) {
    const resp = await POST(ENDPOINTS.REFERRAL_CODES, { name, tutor_id });
    return this.handleResponse(resp);
  }

  protected async JobSummary() {
    const resp = await GET(ENDPOINTS.JOB_SUMMARY, { name });
    return this.handleResponse(resp);
  }

  protected async GetAllJobs() {
    const resp = await GET(ENDPOINTS.GET_ALL_JOBS);
    return this.handleResponse(resp);
  }

  private async getPresignedUploadURL(
    fileType: string,
    fileName?: string
  ): Promise<{
    file_name: string;
    url: string;
  }> {
    const resp = await POST(ENDPOINTS.UPLOAD_FILE_ENDPOINT, {
      file_type: fileType,
      file_name: fileName,
    });
    return this.handleResponse(resp);
  }
}

class AdminControllerToaster extends AdminController {
  async Login(email: string, password: string) {
    return toast.promise(
      super.Login(email, password),
      this.getToastConfig("กำลังเข้าสู่ระบบ")
    );
  }

  async Authenticate() {
    return this.showToastOnError(() => super.Authenticate());
  }

  async GetAllTutors(only_unverified: boolean) {
    return toast.promise(
      super.GetAllTutors(only_unverified),
      this.getToastConfig("กำลังโหลดข้อมูลติวเตอร์")
    );
  }

  async GetAllReservations(statuses: string[]) {
    return toast.promise(
      super.GetAllReservations(statuses),
      this.getToastConfig("กำลังโหลด reservations")
    );
  }

  async GetTutorById(id: number, pendingEditProfile: boolean): Promise<any> {
    return toast.promise(
      super.GetTutorById(id, pendingEditProfile),
      this.getToastConfig("กำลังโหลดโปรไฟล์ติวเตอร์")
    );
  }

  async ListReservationSip(): Promise<any> {
    return toast.promise(
      super.ListReservationSlip(),
      this.getToastConfig("กำลังโหลดสลิป")
    );
  }

  async ApproveSlip(reservationId: number): Promise<any> {
    return toast.promise(
      super.ApproveSlip(reservationId),
      this.getToastConfig("กำลัง approve slip")
    );
  }

  async ApproveTutor(id: number, pendingEditProfile: boolean) {
    return toast.promise(
      super.ApproveTutor(id, pendingEditProfile),
      this.getToastConfig("กำลัง approve tutor")
    );
  }

  async AddComment(
    tutorId: number,
    comment: string,
    pendingEditProfile: boolean
  ) {
    return toast.promise(
      super.AddComment(tutorId, comment, pendingEditProfile),
      this.getToastConfig("กำลังเพิ่ม comment")
    );
  }

  async AddSubject(subject: string) {
    return toast.promise(
      super.AddSubject(subject),
      this.getToastConfig("กำลังเพิ่ม subject")
    );
  }

  async AddTag(tag: string) {
    return toast.promise(
      super.AddTag(tag),
      this.getToastConfig("กำลังเพิ่ม tag")
    );
  }

  async MarkRefund(reservationId: number): Promise<any> {
    return toast.promise(
      super.MarkRefund(reservationId),
      this.getToastConfig("กำลังเปลี่ยนสถานะ")
    );
  }

  async UploadFile(file: File, file_name?: string) {
    return toast.promise(
      super.UploadFile(file, file_name),
      this.getToastConfig("กำลังอัพโหลดไฟล์")
    );
  }

  async ManualRefund(
    reservationId: number,
    receiptFileKey: string,
    amount?: number
  ) {
    return toast.promise(
      super.ManualRefund(reservationId, receiptFileKey, amount),
      this.getToastConfig("กำลังแจ้งเตือนติวเตอร์เกี่ยวกับ refund")
    );
  }

  async JobsPrettyPrint() {
    return toast.promise(
      super.JobsPrettyPrint(),
      this.getToastConfig("กำลังโหลดงานทั้งหมด")
    );
  }

  async GetCodes() {
    return toast.promise(
      super.GetCodes(),
      this.getToastConfig("กำลังโหลด referral code ทั้งหมด")
    );
  }

  async GetPayouts() {
    return toast.promise(
      super.GetPayouts(),
      this.getToastConfig("กำลังโหลด referral payout ทั้งหมด")
    );
  }

  async AddCode(name: string, tutor_id?: number) {
    return toast.promise(
      super.AddCode(name, tutor_id),
      this.getToastConfig("กำลังเพิ่ม referral code")
    );
  }

  async GetJobSummary() {
    return toast.promise(
      super.JobSummary(),
      this.getToastConfig("กำลังโหลด job summary")
    );
  }

  async GetAllJobs() {
    return toast.promise(
      super.GetAllJobs(),
      this.getToastConfig("กำลังโหลดงานทั้งหมด")
    );
  }
}

class JobController extends BaseController {
  constructor() {
    super();
  }

  public async GetSubjects() {
    const resp = await GET(ENDPOINTS.GET_SUBJECTS_ENDPOINT);
    return this.handleResponse(resp);
  }

  public async GetTags() {
    const resp = await GET(ENDPOINTS.GET_TAGS_ENDPOINT);
    return this.handleResponse(resp);
  }

  public async GetJob(id: number) {
    const resp = await GET(ENDPOINTS.GET_JOB_BY_ID_ENDPOINT(id));
    return this.handleResponse(resp);
  }
}

class JobControllerToaster extends JobController {}

export const adminController = new AdminControllerToaster();
export const jobController = new JobControllerToaster();

import { ENDPOINTS, GET } from "../backend";
import BaseController from "./base";

export type PublicStats = {
  tutor: {
    open_jobs: number;
    verified_tutors: number;
    total_jobs: number;
    subject_count: number;
    unique_students: number;
    avg_hourly_fee: number;
    max_hourly_fee: number;
    online_jobs: number;
    total_reservations: number;
    top_open_subjects: { subject: string; count: number }[];
  };
  student: {
    verified_tutors: number;
    unique_students: number;
    subject_count: number;
    open_jobs: number;
    total_jobs: number;
    avg_hourly_fee: number;
    online_jobs: number;
    top_open_subjects: { subject: string; count: number }[];
  };
};

class PublicController extends BaseController {
  async GetStats(): Promise<PublicStats> {
    const resp = await GET(ENDPOINTS.PUBLIC_STATS);
    return this.handleResponse(resp);
  }
}

export const publicController = new PublicController();

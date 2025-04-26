import toast from "react-hot-toast";
import { ENDPOINTS, GET, POST } from "../backend";
import BaseController from "./base";
import queryString from "query-string";

export type Proposition = {
  fee?: number;
  online?: boolean;
};

class JobController extends BaseController {
  constructor() {
    super();
  }

  protected async GetJobs(
    levels?: string[],
    subjects?: number[],
    tags?: number[]
  ) {
    const query = queryString.stringify({ levels, subjects, tags });
    var endpoint = ENDPOINTS.GET_JOBS_ENDPOINT;
    if (query.length > 0) {
      endpoint = endpoint + "?" + query;
    }
    const resp = await GET(endpoint);
    return this.handleResponse(resp);
  }

  protected async ReserveJob(jobId: number, proposition: Proposition) {
    const resp = await POST(ENDPOINTS.RESERVE_JOB_ENDPOINT, {
      jobId,
      proposition,
    });
    return this.handleResponse(resp);
  }

  public async GetJob(id: number) {
    const resp = await GET(ENDPOINTS.GET_JOB_BY_ID_ENDPOINT(id));
    return this.handleResponse(resp);
  }

  public async GetSubjects() {
    const resp = await GET(ENDPOINTS.GET_SUBJECTS_ENDPOINT);
    return this.handleResponse(resp);
  }

  public async GetTags() {
    const resp = await GET(ENDPOINTS.GET_TAGS_ENDPOINT);
    return this.handleResponse(resp);
  }
}

class JobControllerToaster extends JobController {
  public async GetJobs(
    levels?: string[],
    subjects?: number[],
    tags?: number[]
  ) {
    return this.showToastOnError(() => super.GetJobs(levels, subjects, tags));
  }

  public async ReserveJob(jobId: number, proposition: Proposition) {
    return toast.promise(
      super.ReserveJob(jobId, proposition),
      this.getToastConfig("กำลังจองงาน")
    );
  }
}

export const jobController = new JobControllerToaster();

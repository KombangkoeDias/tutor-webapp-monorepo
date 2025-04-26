import { ENDPOINTS, GET } from "../backend";
import BaseController from "./base";

class SharedController extends BaseController {
  constructor() {
    super();
  }

  public async GetAllProvinces() {
    const resp = await GET(ENDPOINTS.GET_ALL_PROVINCES);
    return this.handleResponse(resp);
  }

  public async GetAmphoesByProvinceId(provinceId: number) {
    const resp = await GET(ENDPOINTS.GET_AMPHOES_BY_PROVINCE(provinceId));
    return this.handleResponse(resp);
  }

  public async GetTambonsByAmphoeId(amphoeId: number) {
    const resp = await GET(ENDPOINTS.GET_TAMBONS_BY_AMPHOE(amphoeId));
    return this.handleResponse(resp);
  }
}

class SharedControllerToaster extends SharedController {}

export const sharedController = new SharedControllerToaster();

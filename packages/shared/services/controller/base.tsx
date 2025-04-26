import toast from "react-hot-toast";
import { APIStatus, toastCaption } from "../backend";

export default class BaseController {
  protected async showToastOnError(func: Function) {
    try {
      const resp = await func();
      return resp;
    } catch (err) {
      toast.error(
        <b>"Failed! 😭: {(err.response?.data as { error: string })?.error}"</b>
      );
      throw err;
    }
  }

  public getToastConfig(loadingCaption: string) {
    return {
      loading: loadingCaption + "⌛️...",
      success: toastCaption.SUCCESS,
      error: toastCaption.FAIL,
    };
  }

  protected handleResponse(resp: any): any {
    if (resp.data.message && resp.data.message === APIStatus.SUCCESS) {
      return resp.data.data;
    }
    throw resp.data.error;
  }
}

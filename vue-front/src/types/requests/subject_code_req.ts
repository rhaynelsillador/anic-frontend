import ajax from "@/api/ajax";
import { subjectCodeApi } from "@/const";

import { BaseResponse } from "../base_response";

export default class SubjectCodeRequest {
  data: [];
  section : string;
  yearLevel : string;


  public post(params : {}, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.post<BaseResponse>(subjectCodeApi.BaseUrl, params)
      .then(res => {
          if (success) success(res.data)
          
      })
      .catch(err => {
        if (error) error(err.response.data)
      })
  }
}
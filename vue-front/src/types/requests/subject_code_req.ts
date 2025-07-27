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
          console.log(res.data)
          if (success) success(res.data)
          
      })
      .catch(err => {
        console.log("error response : ",err.response.data)
        if (error) error(err.response.data)
      })
  }
}
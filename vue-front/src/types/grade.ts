import ajax from "../api/ajax";
import { gradeApi } from "../const";

import { PageInfo } from "./PageInfo";

export interface Grade {
  id: number;
  studentId: number;
  gradeScore: number;
  gradingPeriod : number
}


export default class GradeResponse {
  data: Grade[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(code : string, success: (data: GradeResponse) => void, error: (err: any) => void): void {
    ajax.get<GradeResponse>(gradeApi.BaseUrl+'/code/'+code)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public postData(code: string, grades : Grade[], success: (data: GradeResponse) => void, error: (err: any) => void): void {
    ajax.post<GradeResponse>(gradeApi.BaseUrl+'/code/'+code, grades)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

}
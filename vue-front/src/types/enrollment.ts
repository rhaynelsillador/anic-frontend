import { c } from "vite/dist/node/types.d-aGj9QkWt";
import ajax from "../api/ajax";
import { studentApi } from "../const";
import { BaseResponse } from "./base_response";

import { Filter, FilterParser } from './Filter';
import { PageInfo } from "./PageInfo";
import { Student } from "./student";

export interface Enrollment {
  id: number;
  student: Student
}


export interface StudentSectionAssignment {
    student : Number;
    section : Number;
    yearLevel : Number;
}


export default class EnrollmentResponse {
  data: Student[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: EnrollmentResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    ajax.get<EnrollmentResponse>(studentApi.EnrollUrl+query)
      .then(res => {
          if (success) success(res.data)
      })
      .catch(err => {
        if (error) error(err)
      })
  }

  public postData(params : {}, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.post<BaseResponse>(studentApi.EnrollUrl+"/new", params)
        .then(res => {
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

}
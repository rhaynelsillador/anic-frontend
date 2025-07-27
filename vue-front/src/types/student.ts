import ajax from "../api/ajax";
import { studentApi } from "../const";
import { BaseResponse } from "./base_response";

import { Filter, FilterParser } from './Filter';
import { PageInfo } from "./PageInfo";

export interface Student {
  id: number;
  lrn: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string | null;
  gender: string | null;
  birthday: string | null;
  address: string | null;
  contactNumber: string | null;
  photoUrl: string | null;
  status: string | null;
  yearLevelData : Record<string, string | null>;
  yearLevel : Record<string, string | null>;
  sectionData : Record<string, string | null>;
  section : Record<string, string | null>;
}


export default class StudentResponse {
  data: Student[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: StudentResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    ajax.get<StudentResponse>(studentApi.BaseUrl+query)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public getDataById(id : number, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.get<BaseResponse>(studentApi.BaseUrl+'/'+id)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public updateStudent(student : {}, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.put<BaseResponse>(studentApi.BaseUrl+'/'+student.id, student)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

}
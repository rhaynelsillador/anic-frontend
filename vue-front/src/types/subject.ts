import ajax from "../api/ajax";
import { subjectApi } from "../const";
import { BaseResponse } from "./base_response";

import { Filter, FilterParser } from "./Filter";
import { PageInfo } from "./PageInfo";

export interface Subject {
  id: number;
  code: string;
  name: string;
  yearLevel: string;
}

export default class SubjectResponse {
  data: Subject[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: SubjectResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    ajax.get<SubjectResponse>(subjectApi.BaseUrl+query)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public postData(subject : Subject, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    if(subject.id){
      ajax.put<BaseResponse>(subjectApi.BaseUrl+'/'+subject.id, subject)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
      }else{
        ajax.post<BaseResponse>(subjectApi.BaseUrl, subject)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
      }
  }


}
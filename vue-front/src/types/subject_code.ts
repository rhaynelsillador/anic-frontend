import ajax from "../api/ajax";
import { subjectCodeApi } from "../const";

import { Filter, FilterParser } from "./Filter";
import { PageInfo } from "./PageInfo";

export interface SubjectCode {
  id: number;
  code: string;
  subjectName: string;
  subjectCode: string;
  yearLevel: string;
  adviser: string;
  room: string;
  schoolYear: number;
  startTime: string;
  endTime: string;
}

export default class SubjectCodeResponse {
  data: SubjectCode[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: SubjectCodeResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    ajax.get<SubjectCodeResponse>(subjectCodeApi.BaseUrl+query)
      .then(res => {
          console.log(res.data)
          if (success) success(res.data)
          
      })
      .catch(err => {
        if (error) error(err)
      })
  }

  public getAdviserSubjects(filter : {}, success: (data: SubjectCodeResponse) => void, error: (err: any) => void): void {
    ajax.get<SubjectCodeResponse>(subjectCodeApi.BaseUrl+'/adviser/'+filter.adviser+'/year/'+filter.year)
      .then(res => {
          console.log(res.data)
          if (success) success(res.data)
          
      })
      .catch(err => {
        if (error) error(err)
      })
  }

  public getSubjectStudents(code : string, success: (data: SubjectCodeResponse) => void, error: (err: any) => void): void {
    ajax.get<SubjectCodeResponse>(subjectCodeApi.BaseUrl+'/code/'+code)
      .then(res => {
          console.log(res.data)
          if (success) success(res.data)
          
      })
      .catch(err => {
        if (error) error(err)
      })
  }

  
}
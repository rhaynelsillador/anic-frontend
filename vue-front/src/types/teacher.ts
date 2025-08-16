import ajax from "../api/ajax";
import { teacherApi } from "../const";

import { Filter, FilterParser } from "./Filter";
import { PageInfo } from "./PageInfo";

export interface Teacher {
  id: number;
  employeeNo: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNo: string | null;
  photoUrl: string | null;
}

export default class TeacherResponse {
  data: Teacher[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getTeachers(filter : Filter, success: (data: TeacherResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    ajax.get<TeacherResponse>(teacherApi.BaseUrl+query)
        .then(res => {
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public create(teacher : Teacher, success: (data: TeacherResponse) => void, error: (err: any) => void): void {
    ajax.post<TeacherResponse>(teacherApi.BaseUrl, teacher)
        .then(res => {
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }


  public update(teacher : Teacher, success: (data: TeacherResponse) => void, error: (err: any) => void): void {
    ajax.put<TeacherResponse>(teacherApi.BaseUrl+'/'+teacher.id, teacher)
        .then(res => {
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }

}
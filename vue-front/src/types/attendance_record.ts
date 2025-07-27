import ajax from "../api/ajax";
import { attendanceRecordApi } from "../const";

import { PageInfo } from "./PageInfo";

export interface AttendanceRecord {
  id: number;
  code: string;
  name: string;
  yearLevel: string;
  adviser : string;
  schoolyear : number
}

export default class AttendanceRecordResponse {
  data: AttendanceRecord[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(query : string, success: (data: AttendanceRecordResponse) => void, error: (err: any) => void): void {
    ajax.get<AttendanceRecordResponse>(attendanceRecordApi.BaseUrl+'?'+query)
        .then(res => {
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public createAttendance(params : {}, success: (data: AttendanceRecordResponse) => void, error: (err: any) => void): void {
    ajax.post<AttendanceRecordResponse>(attendanceRecordApi.BaseUrl, params)
        .then(res => {
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }

}
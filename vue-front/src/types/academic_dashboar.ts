import ajax from "../api/ajax";
import { dashboardApi } from "../const";

import { Filter, FilterParser } from './Filter';
import { PageInfo } from "./PageInfo";

export interface DashboardReport {
  id: number;
  building: string;
  roomNo: string
}


export default class DashboardReportResponse {
  data: DashboardReport;
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: DashboardReportResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    console.log("queryquery :: >> " , query)
    ajax.get<DashboardReportResponse>(dashboardApi.academicReport+query)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

}
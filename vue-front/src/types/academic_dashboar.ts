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
    ajax.get<DashboardReportResponse>(dashboardApi.academicReport+query)
        .then(res => {
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }


  public getMainDashboardData(success: (data: DashboardReportResponse) => void, error: (err: any) => void): void {
    ajax.get<DashboardReportResponse>(dashboardApi.report)
        .then(res => {
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

}
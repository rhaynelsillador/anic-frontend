import ajax from "../api/ajax";
import { schoolYearApi } from "../const";
import { BaseResponse } from "./base_response";
import { Filter, FilterParser } from "./Filter";
import { PageInfo } from "./PageInfo";

export interface SchoolYear {
  id?: number
  name: string
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'INACTIVE' | 'UPCOMING'
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface SchoolYearRequest {
  name: string
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'INACTIVE' | 'UPCOMING'
  description?: string
}

export default class SchoolYearResponse {
  data: SchoolYear[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;

  public getData(filter: Filter, success: (data: SchoolYearResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    ajax.get<SchoolYearResponse>(schoolYearApi.BaseUrl + query)
      .then(res => {
        if (success) success(res.data)
      })
      .catch(err => {
        if (error) error(err)
      })
  }

  public sendData(params: any, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    if (params.id) {
      this.putData(params.id, params, success, error)
    } else {
      this.postData(params, success, error);
    }
  }

  public postData(params: any, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.post<BaseResponse>(schoolYearApi.BaseUrl, params)
      .then(res => {
        if (success) success(res.data)
      })
      .catch(err => {
        if (error) error(err)
      })
  }

  public putData(id: number, params: any, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.put<BaseResponse>(schoolYearApi.BaseUrl + "/" + id, params)
      .then(res => {
        if (success) success(res.data)
      })
      .catch(err => {
        if (error) error(err)
      })
  }

  public deleteData(id: number, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.delete<BaseResponse>(schoolYearApi.BaseUrl + "/" + id)
      .then(res => {
        if (success) success(res.data)
      })
      .catch(err => {
        if (error) error(err)
      })
  }

  public initializeSchoolYear(params: any, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.post<BaseResponse>(schoolYearApi.BaseUrl + "/initialize", params)
      .then(res => {
        if (success) success(res.data)
      })
      .catch(err => {
        if (error) error(err)
      })
  }
}
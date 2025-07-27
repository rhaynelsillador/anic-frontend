import ajax from "../api/ajax";
import { sectionApi } from "../const";
import { BaseResponse } from "./base_response";

import { Filter, FilterParser } from "./Filter";
import { PageInfo } from "./PageInfo";

export interface Section {
  id: number;
  code: string;
  name: string;
  yearLevel: string;
  adviser : string;
  schoolyear : number
}

export default class SectionResponse {
  data: Section[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: SectionResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    ajax.get<SectionResponse>(sectionApi.BaseUrl+query)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public sendData(params : {}, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    if(params.id){
      this.putData(params.id, params, success, error)
    }else{
      this.postData(params, success, error);
    }
  }

  public postData(params : {}, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.post<BaseResponse>(sectionApi.BaseUrl, params)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public putData(id: number, params : {}, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.put<BaseResponse>(sectionApi.BaseUrl+'/'+id, params)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }
  

}
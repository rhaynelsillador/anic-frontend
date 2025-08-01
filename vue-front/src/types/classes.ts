import ajax from "../api/ajax";
import { yearLeveApi } from "../const";
import { BaseResponse } from "./base_response";

import { Filter, FilterParser } from "./Filter";
import { PageInfo } from "./PageInfo";

export interface Classes {
  id: number;
  code: string;
  name: string;
  yearLevel: string;
  adviser : string;
  schoolyear : number
}

export default class ClassesResponse {
  data: Classes[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: ClassesResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    ajax.get<ClassesResponse>(yearLeveApi.BaseUrl+query)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public sendData(params : Classes, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    if(params.id){
      this.putData(params.id, params, success, error)
    }else{
      this.postData(params, success, error);
    }
  }

  public postData(params : Classes, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.post<BaseResponse>(yearLeveApi.BaseUrl, params)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public putData(id: number, params : {}, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.put<BaseResponse>(yearLeveApi.BaseUrl+'/'+id, params)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }
  

}
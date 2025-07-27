import ajax from "@/api/ajax";
import { adminApi } from "@/const";
import { BaseResponse } from "@/types/base_response";
import { Filter, FilterParser } from "@/types/Filter";

import { PageInfo } from "@/types/PageInfo";

export interface Role {
  id: number;
  name: string;
  description: string;
  gradingPeriod : number
}


export default class RoleResponse {
  data: Role[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: RoleResponse) => void, error: (err: any) => void): void {
      let query = new FilterParser().toUriParams(filter);
    ajax.get<RoleResponse>(adminApi.role+query)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public saveData(role : Role, success: (data: BaseResponse) => void, error: (err: any) => void): void {
      if(role.id > 0 ){
        ajax.put<BaseResponse>(adminApi.role+'/'+role.id, role)
          .then(res => {
              console.log(res.data)
              if (success) success(res.data)
          })
          .catch(err => {
            if (error) error(err)
          })
      }else{
        ajax.post<BaseResponse>(adminApi.role, role)
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
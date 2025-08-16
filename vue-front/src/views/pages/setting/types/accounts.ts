import ajax from "@/api/ajax";
import { accountApi, adminApi, ApiAccount } from "@/const";
import { BaseResponse } from "@/types/base_response";
import { Filter, FilterParser } from "@/types/Filter";

import { PageInfo } from "@/types/PageInfo";

export interface Account {
  id: number;
  username: string;
  email: string;
  password?: string;
  roles: string[];
  accountRef?: number;
  createdAt?: string;
  updatedAt?: string;
}


export default class AccountResponse {
  data: Account[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: AccountResponse) => void, error: (err: any) => void): void {
      let query = new FilterParser().toUriParams(filter);
    ajax.get<AccountResponse>(adminApi.account+query)
        .then(res => {
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }


  public saveData(account : Account, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    if(account.id > 0 ){
      ajax.put<BaseResponse>(adminApi.account+'/'+account.id, account)
        .then(res => {
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
    }else{
      ajax.post<BaseResponse>(adminApi.account, account)
        .then(res => {
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
    }
    
  }

  public deleteData(id: number, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.delete<BaseResponse>(adminApi.account + '/' + id)
        .then(res => {
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

  public getCounselorsList(success: (data: Account[]) => void, error: (err: any) => void): void {
    ajax.get<Account[]>(accountApi.BaseUrl + '/counselors')
        .then(res => {
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }


}
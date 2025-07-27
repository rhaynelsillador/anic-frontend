import { apiAuth } from "@/const";
import ajax from "../api/ajax";
import { BaseResponse } from "./base_response";

export interface LoginForm {
  username: string;
  password: string
}

export class LoginFormResponse {
  public doLogin(login : LoginForm, success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.post<BaseResponse>(apiAuth.Login, login)
      .then(res => {
          console.log(res.data)
          if (success) success(res.data)
      })
      .catch(err => {
        if (error) error(err)
      })
  }
}
import ajax from "../api/ajax";
import { BaseResponse } from "./base_response";

export interface AccountInfo {
  
  account: UserProfile;
  teacherInfo?: TeacherInfo;
}

export interface UserProfile {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  accountRef?: number;
  enabled: boolean;
  createdAt: string;
  updatedAt?: string;
  roles: string[];
}

export interface TeacherInfo {
  id: number;
  employeeNo?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  contactNo?: string;
  photoUrl?: string;
  position?: string;
  createdDate: string;
  updatedDate?: string;
}

export default class AuthService {
  public getUserProfile(
    accountId: number,
    success: (data: BaseResponse) => void, 
    error: (err: any) => void
  ): void {
    ajax.get<BaseResponse>(`/api/v1/account/profile/${accountId}`)
    .then(res => {
      if (success) success(res.data)
    })
    .catch(err => {
      console.error('Get user profile error:', err)
      if (error) error(err)
    })
  }
}

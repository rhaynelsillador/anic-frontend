import ajax from "../api/ajax";
import { setupApi } from "../const";
import { BaseResponse } from "./base_response";

export interface SchoolSetupRequest {
  schoolName: string;
  systemName: string;
  address: string;
  contactInformation: string;
  logoPath?: string;
}

export interface SchoolSetupResponse {
  id?: number;
  schoolName?: string;
  systemName?: string;
  address?: string;
  contactInformation?: string;
  logoPath?: string;
  isSetupComplete?: boolean;
  message?: string;
}

export default class SchoolSetupService {

  public checkSetupStatus(
    success: (data: BaseResponse) => void, 
    error: (err: any) => void
  ): void {
    ajax.get<BaseResponse>(setupApi.BaseUrl + '/status')
    .then(res => {
      if (success) success(res.data)
    })
    .catch(err => {
      console.error('Setup status check error:', err)
      if (error) error(err)
    })
  }

  public createSetup(
    request: SchoolSetupRequest,
    success: (data: BaseResponse) => void, 
    error: (err: any) => void
  ): void {
    ajax.post<BaseResponse>(setupApi.BaseUrl + '/create', request)
    .then(res => {
      if (success) success(res.data)
    })
    .catch(err => {
      console.error('Create setup error:', err)
      if (error) error(err)
    })
  }

  public completeSetup(
    setupId: number,
    success: (data: BaseResponse) => void, 
    error: (err: any) => void
  ): void {
    ajax.post<BaseResponse>(setupApi.BaseUrl + `/complete/${setupId}`, {})
    .then(res => {
      if (success) success(res.data)
    })
    .catch(err => {
      console.error('Complete setup error:', err)
      if (error) error(err)
    })
  }

  public getCurrentSetup(
    success: (data: BaseResponse) => void, 
    error: (err: any) => void
  ): void {
    ajax.get<BaseResponse>(setupApi.BaseUrl + '/current')
    .then(res => {
      if (success) success(res.data)
    })
    .catch(err => {
      console.error('Get current setup error:', err)
      if (error) error(err)
    })
  }

  public getSystemInfo(
    success: (data: BaseResponse) => void, 
    error: (err: any) => void
  ): void {
    ajax.get<BaseResponse>(setupApi.BaseUrl + '/system-info')
    .then(res => {
      if (success) success(res.data)
    })
    .catch(err => {
      console.error('Get system info error:', err)
      if (error) error(err)
    })
  }

  public updateSchoolInfo(
    request: SchoolSetupRequest,
    success: (data: BaseResponse) => void, 
    error: (err: any) => void
  ): void {
    ajax.put<BaseResponse>(setupApi.BaseUrl + '/update', request)
    .then(res => {
      if (success) success(res.data)
    })
    .catch(err => {
      console.error('Update school info error:', err)
      if (error) error(err)
    })
  }
}

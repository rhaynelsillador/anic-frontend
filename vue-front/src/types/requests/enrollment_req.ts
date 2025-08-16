import ajax from "@/api/ajax";
import { studentApi } from "@/const";

import { BaseResponse } from "../base_response";
import { StudentSectionAssignment } from "../enrollment";

export default class StudentSectionAssignmentRequest {
  student: [];
  section : string;
  yearLevel : string;


  public post(params : StudentSectionAssignment[], success: (data: BaseResponse) => void, error: (err: any) => void): void {
    ajax.post<BaseResponse>(studentApi.EnrollUrl, params)
      .then(res => {
          if (success) success(res.data)
          
      })
      .catch(err => {
        if (error) error(err.response.data)
      })
  }
}
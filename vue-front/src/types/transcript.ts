import ajax from "../api/ajax";
import { transcriptApi } from "../const";
import { BaseResponse } from "./base_response";

export interface TranscriptResponse {
  filename: string;
  filePath: string;
  fileSize: number;
  downloadUrl: string;
}

export interface TranscriptRequest {
  studentId: number;
  templateData: any;
}

export default class TranscriptService {

  public generateTranscriptPdf(
    request: TranscriptRequest, 
    success: (data: BaseResponse) => void, 
    error: (err: any) => void
  ): void {
    ajax.post<BaseResponse>(transcriptApi.BaseUrl + '/generate-pdf', request)
    .then(res => {
      if (success) success(res.data)
    })
    .catch(err => {
      console.error('Transcript PDF generation error:', err)
      if (error) error(err)
    })
  }
}

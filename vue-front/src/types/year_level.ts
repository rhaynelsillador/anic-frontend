import ajax from "../api/ajax";
import { yearLeveApi } from "../const";

import { Filter, FilterParser } from "./Filter";
import { PageInfo } from "./PageInfo";

export interface YearLevel {
  id: number;
  name: string;
}

export default class YearLevelResponse {
  data: YearLevel[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: YearLevelResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    ajax.get<YearLevelResponse>(yearLeveApi.BaseUrl+query)
        .then(res => {
            if (success) success(res.data)
            
        })
        .catch(err => {
          if (error) error(err)
        })
  }

}
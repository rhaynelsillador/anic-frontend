import ajax from "../api/ajax";
import { roomApi } from "../const";

import { Filter, FilterParser } from './Filter';
import { PageInfo } from "./PageInfo";

export interface Room {
  id: number;
  building: string;
  roomNo: string
}


export default class RoomResponse {
  data: Room[];
  status: string;
  message: string;
  code: number;
  page: PageInfo;


  public getData(filter : Filter, success: (data: RoomResponse) => void, error: (err: any) => void): void {
    let query = new FilterParser().toUriParams(filter);
    console.log(query)
    ajax.get<RoomResponse>(roomApi.BaseUrl+query)
        .then(res => {
            console.log(res.data)
            if (success) success(res.data)
        })
        .catch(err => {
          if (error) error(err)
        })
  }

}
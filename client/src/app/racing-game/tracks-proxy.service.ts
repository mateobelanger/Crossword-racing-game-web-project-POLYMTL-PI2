import { Injectable } from '@angular/core';
// import {Observable} from 'rxjs/Observable';
// import { TrackData } from "../../../../common/communication/trackData";
import { HttpClient } from '@angular/common/http';
import { TrackData } from "../../../../common/communication/trackData";
const URI_MONGO_DB: string = "http://localhost:3000/service/mongoDB";

@Injectable()
export class TracksProxyService {
//tslint:disable:all
  private _tracks: TrackData[];

  public constructor( private _http: HttpClient) { }

  public initialize(): void {
    this._tracks = this.getTracks();
    
  }

  private getTracks(): TrackData[] {
    let trackDatas: TrackData[];
    this._http.get<TrackData[]>(URI_MONGO_DB).subscribe(data => console.log(data) );
    console.log("les pistes: ");
    console.log(trackDatas);
    return trackDatas;
  }


//tslint:disable:all
  /*public test(): void {
    console.log("aalllo");
    this._http.get<TrackData[]>(URI_MONGO_DB).subscribe((data) => {
      data.forEach((elem) => {console.log(elem) }) });
  
  }*/

}

import { Injectable } from '@angular/core';
// import {Observable} from 'rxjs/Observable';
// import { TrackData } from "../../../../common/communication/trackData";
import { HttpClient } from '@angular/common/http';
// const URI_MONGO_DB: string = "http://localhost:3000/service/mongoDB";

@Injectable()
export class TracksProxyService {

  public constructor( private _http: HttpClient) { }

  /*public get tracks(): Observable<TrackData> {
    return
  }*/
//tslint:disable:all
  public test(): void {
    console.log("aalllo");
    this._http.get("https://jsonplaceholder.typicode.com/posts").subscribe((data) => {console.log(data)});
  
  }

}

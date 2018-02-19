import { Injectable } from '@angular/core';
// import {Observable} from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { TrackData } from "../../../../common/communication/trackData";
const URI_MONGO_DB: string = "http://localhost:3000/service/mongoDB";

@Injectable()
export class TracksProxyService {
//tslint:disable:all
  private _tracks: TrackData[];

  public constructor( private _http: HttpClient) { }

  public async initialize(): Promise<void> {
    await this.fetchTracks().then(data => {this._tracks = data}); 
  }

  public get tracks(): TrackData[] {
    return this._tracks;
  }

  private fetchTracks(): Promise<TrackData[]> {
    return this._http.get<TrackData[]>(URI_MONGO_DB).toPromise();
  }



}

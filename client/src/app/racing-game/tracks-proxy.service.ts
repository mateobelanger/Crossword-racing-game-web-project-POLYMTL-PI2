import { Injectable } from '@angular/core';
// import {Observable} from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { TrackData } from "../../../../common/communication/trackData";
const URI_MONGO_DB: string = "http://localhost:3000/service/mongoDB";

@Injectable()
export class TracksProxyService {

  private _tracks: TrackData[];

  public constructor( private _http: HttpClient) { }

  public async initialize(): Promise<void> {
    await this.fetchTracks().then((data) => {this._tracks = data; });
  }

  public get tracks(): TrackData[] {
    return this._tracks;
  }

  public addTrack(track: TrackData): void {
    this._http.post<TrackData>(URI_MONGO_DB, track)
    .subscribe((validTrack: TrackData) => {this.tracks.push(validTrack); });
  }

  public deleteTrack(trackName: string): void {
    const url: string = URI_MONGO_DB + "/" + trackName;
    this._http.delete<TrackData>(url).subscribe();
  }

  public updateTrack(track: TrackData): void {
    // console.log(this.findTrack(track.name).name);
    if ( this.findTrack(track.name) !== null) {
      this._http.put<TrackData>(URI_MONGO_DB, track).subscribe();
    } else {
      this.addTrack(track);
    }

  }

  public findTrack(trackName: string): TrackData {
    let track: TrackData = null;
    this._tracks.forEach((elem) => {
      if (elem.name === trackName)
        track = elem;
    });

    return track;
  }

  private fetchTracks(): Promise<TrackData[]> {
      return this._http.get<TrackData[]>(URI_MONGO_DB).toPromise();
  }

}


// .subscribe() ... ??????? pcq ne fonctionnait pas avant
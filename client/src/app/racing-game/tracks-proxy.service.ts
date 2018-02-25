import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { TrackData } from "../../../../common/trackData";
const URI_MONGO_DB: string = "http://localhost:3000/service/mongoDB";

@Injectable()
export class TracksProxyService {

  private _tracks: TrackData[] = [];

  public constructor( private _http: HttpClient) { }

  public async initialize(): Promise<void> {
    await this.fetchTracks().then((data) => {this._tracks = data; });
  }

  public get tracks(): TrackData[] {
    return this._tracks;
  }

  public async addTrack(track: TrackData): Promise<void> {
    return this._http.post<TrackData>(URI_MONGO_DB, track).toPromise()
    .then((validTrack: TrackData) => {this.tracks.push(validTrack); });
  }

  public async deleteTrack(trackName: string): Promise<void> {
    const url: string = URI_MONGO_DB + "/" + trackName;

    return this._http.delete<TrackData>(url).toPromise().then(() => {
      this._tracks.splice(1, this._tracks.indexOf(this.findTrack(trackName)));
    });
  }

  public async saveTrack(track: TrackData): Promise<void> {

    if ( this.findTrack(track.name) !== null) {
      return this._http.put<TrackData>(URI_MONGO_DB, track).toPromise().then(() => {});
    } else {
      return this.addTrack(track);
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

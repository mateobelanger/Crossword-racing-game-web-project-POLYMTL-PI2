import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ITrackData } from "../../../../../common/ItrackData";

const URI_MONGO_DB: string = "http://localhost:3000/service/mongoDB";

@Injectable()
export class TracksProxyService {

    private _tracks: ITrackData[];

    public constructor(private _http: HttpClient) {
        this._tracks = [];
    }

    public async initialize(): Promise<void> {
        await this.fetchTracks()
            .then((data) => { this._tracks = data; })
            .catch((error: Error) => console.error(error));
    }

    public get tracks(): ITrackData[] {
        return this._tracks;
    }

    public async addTrack(track: ITrackData): Promise<void> {
        return this._http.post<ITrackData>(URI_MONGO_DB, track).toPromise()
            .then((validTrack: ITrackData) => { this.tracks.push(validTrack); })
            .catch((error: Error) => console.error(error));
    }

    public async deleteTrack(trackName: string): Promise<void> {
        const url: string = URI_MONGO_DB + "/" + trackName;

        return this._http.delete<ITrackData>(url).toPromise()
            .then(() => {
                this._tracks.splice(1, this._tracks.indexOf(this.findTrack(trackName)));
            })
            .catch((error: Error) => console.error(error));
    }

    public async saveTrack(track: ITrackData): Promise<void> {
        console.log(track);
        if (this.findTrack(track.name) !== null) {
            return this._http.put<ITrackData>(URI_MONGO_DB, track).toPromise()
                .then(() => { })
                .catch((error: Error) => console.error(error));
        } else {
            return this.addTrack(track);
        }
    }

    public findTrack(trackName: string): ITrackData {
        let track: ITrackData = null;
        this._tracks.forEach((elem) => {
        if (elem.name === trackName) {
            track = elem;
        }
        });

        return track;
    }

    private async fetchTracks(): Promise<ITrackData[]> {
        return this._http.get<ITrackData[]>(URI_MONGO_DB).toPromise();
    }

}

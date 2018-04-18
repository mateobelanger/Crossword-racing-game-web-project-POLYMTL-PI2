import { Component, AfterViewInit } from "@angular/core";
import { TracksProxyService } from "./tracks/tracks-proxy.service";
import { ITrackData } from "../../../../common/ItrackData";
@Component({
    selector: "app-track-list",
    templateUrl: "./track-list.component.html",
    styleUrls: ["./track-list.component.css"]
})

export class TrackListComponent implements AfterViewInit {
    public tracks: ITrackData[];
    public easyDifficulty: boolean;
    public constructor(private _proxy: TracksProxyService) { }

    public async ngAfterViewInit(): Promise<void> {
        this.easyDifficulty = true;

        await this._proxy.initialize();
        this.tracks = this._proxy.tracks;
    }

    public selectModalId(button: HTMLElement, track: ITrackData): void {
        button.setAttribute("data-target", "#" + track.name);
    }

    public switchDifficulty(): void {
        this.easyDifficulty = !this.easyDifficulty;
    }
}

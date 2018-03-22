import { Component, AfterViewInit } from "@angular/core";
import { TracksProxyService } from "./tracks-proxy.service";
import { ITrackData } from "../../../../common/ItrackData";
@Component({
    selector: "app-racing-game",
    templateUrl: "./racing-game.component.html",
    styleUrls: ["./racing-game.component.css"]
})

export class RacingGameComponent implements AfterViewInit {
    public tracks: ITrackData[];

    public constructor(private proxy: TracksProxyService) { }

    public async ngAfterViewInit(): Promise<void> {

        await this.proxy.initialize();
        this.tracks = this.proxy.tracks;
    }

    public selectModalId(button: HTMLElement, track: ITrackData): void {
        button.setAttribute("data-target", "#" + track.name);
    }
}

import { AfterViewInit, Component, OnInit/*,  ViewChild, ElementRef*/ } from "@angular/core";
import { TracksProxyService } from "../../racing-game/tracks-proxy.service";
import { TrackData } from "../../../../../common/communication/trackData";
// import { UrlSegment, Routes, Router } from "@angular/router";

@Component({
  selector: 'app-track-editor-ui',
  templateUrl: './track-editor-ui.component.html',
  styleUrls: ['./track-editor-ui.component.css']
})

export class TrackEditorUiComponent implements OnInit, AfterViewInit {

  public tracks: TrackData[];
  public track: TrackData;
  public name: string;
  // public trackName: string;
  // public tab: string[];

  public constructor(private proxy: TracksProxyService/*, router: Router*/) {
    // this.trackName = window.location.href.split("/")[window.location.href.split("/").length - 1];

  }

  public ngOnInit(): void {
  }

  public async ngAfterViewInit(): Promise<void> {

    await this.proxy.initialize();

    this.tracks = this.proxy.tracks;
    this.track = this.proxy.findTrack(window.location.href.split("/")[window.location.href.split("/").length - 1]);
    this.name = this.track.name;

    // POUR AJOUTER UNE TRACK, DECOMMENTER:
    // const aString: string = "track description";
    // const genny: [string, number][] = [["player1", 1]];

    // const trackData: TrackData = {name: "track5", description:  aString, timesPlayed: 5, bestTimes: genny,
    //                               waypoints: [[1, 1, 1]]};
    // // this.proxy.updateTrack(trackData);
    // this.proxy.addTrack(trackData);
}


}

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
  public newTrack: TrackData;
  public name: string;
  public description: string;
  // public tab: string[];

  public constructor(private proxy: TracksProxyService) {
  }

  public ngOnInit(): void {
  }

  public async ngAfterViewInit(): Promise<void> {

    await this.proxy.initialize();
    const track: TrackData = this.proxy.findTrack(window.location.href.split("/")[window.location.href.split("/").length - 1]);
    this.track = {name: track.name, description: track.description, timesPlayed: track.timesPlayed,
                  bestTimes: track.bestTimes, waypoints: track.waypoints};
    this.name = this.track.name;
    this.description = this.track.description;


    // POUR AJOUTER UNE TRACK, DECOMMENTER:
    // const aString: string = "track description";
    // const genny: [string, number][] = [["player1", 1]];

    // const trackData: TrackData = {name: "track5", description:  aString, timesPlayed: 5, bestTimes: genny,
    //                               waypoints: [[1, 1, 1]]};
    // // this.proxy.updateTrack(trackData);
    // this.proxy.addTrack(trackData);
  }

  public saveTrack(): void  {
    this.track.name = this.name;
    this.track.description = this.description;

    console.log(this.track);
    this.proxy.updateTrack(this.track);

    // this.newTrack.name = this.name;
    // console.log(this.newTrack);
    // this.proxy.updateTrack(this.newTrack);
    // await this.proxy.initialize();
    // this.tracks = this.proxy.tracks;

  }


}

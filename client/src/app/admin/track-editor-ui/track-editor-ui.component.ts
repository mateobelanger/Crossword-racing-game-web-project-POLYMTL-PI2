import { AfterViewInit, Component, OnInit } from "@angular/core";
import { TracksProxyService } from "../../racing-game/tracks-proxy.service";
import { TrackData } from "../../../../../common/communication/trackData";

import { TrackEditorService } from '../../racing-game/track-editor/track-editor.service';

import { Waypoint } from "../../racing-game/track/trackData/waypoint";
import * as THREE from 'three';

@Component({
  selector: 'app-track-editor-ui',
  templateUrl: './track-editor-ui.component.html',
  styleUrls: ['./track-editor-ui.component.css']
})

export class TrackEditorUiComponent implements OnInit, AfterViewInit {

  public tracks: TrackData[];
  public name: string;
  public description: string;

  public trackData: TrackData;

  public constructor(private trackEditorService: TrackEditorService, private proxy: TracksProxyService) {
  }

  public ngOnInit(): void {
  }

  public async ngAfterViewInit(): Promise<void> {
    try {
      await this.proxy.initialize();
      this.getTrackFromProxy();
      // this.renderTrack();
    } catch (e) {
      console.log(e);

      return;
    }
  }

  private getTrackFromProxy(): void {
    const track: TrackData = this.proxy.findTrack(this.getTrackNameFromURL());
    if (track === null) {
      throw new Error("track not found");
    }
    this.trackData = {
      name: track.name, description: track.description, timesPlayed: track.timesPlayed,
      bestTimes: track.bestTimes, waypoints: track.waypoints
    };
    this.name = this.trackData.name;
    this.description = this.trackData.description;
  }

  private getTrackNameFromURL(): string {
    return window.location.href.split("/")[window.location.href.split("/").length - 1].replace(/%20/g, " ");
  }


  public saveTrack(): void {
    // UNCOMMENT ONCE TRACK CAN BE VALID
    if (!this.trackEditorService.track.isValid || !this.trackEditorService.track.isClosed) {
       return;
    }
    this.trackData.name = this.name;
    this.trackData.description = this.description;
    this.addWaypointsToTrackData(this.trackEditorService.track.waypoints);
    console.log(this.trackData);
    this.proxy.saveTrack(this.trackData);

  }

  public popUpFunction(): void {
    const popUp: HTMLElement = document.getElementById("popUp");
    if (!this.trackEditorService.track.isValid) {
      popUp.classList.toggle("show");
    }
  }

  private addWaypointsToTrackData(waypoints: Waypoint[]): void {

    // enlever les points initiaux de la track
    this.trackData.waypoints.length = 0;

    // ajouter les points actuels
    waypoints.forEach((waypoint) => {
      const positionVector: THREE.Vector3 = waypoint.position;
      const position: [number, number, number] = [positionVector.x, positionVector.y, positionVector.z];
      this.trackData.waypoints.push(position);
    });

    // test: prendre la 2e track et faire un click de droit puis save.. rajoute un point
    // random

    // test: si on ferme la track avant de save c'est correct..
  }



}

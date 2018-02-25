import { AfterViewInit, Component, OnInit } from "@angular/core";
import { TracksProxyService } from "../../racing-game/tracks-proxy.service";
import { TrackData } from "../../../../../common/communication/trackData";

import { TrackEditorService } from '../../racing-game/track-editor/track-editor.service';
import { ActivatedRoute } from '@angular/router';

import { Waypoint } from "../../racing-game/track/trackData/waypoint";
import * as THREE from 'three';

@Component({
  selector: 'app-track-editor-ui',
  templateUrl: './track-editor-ui.component.html',
  styleUrls: ['./track-editor-ui.component.css']
})

export class TrackEditorUiComponent implements OnInit, AfterViewInit {

  // public tracks: TrackData[];
  public name: string;
  public description: string;

  public track: TrackData;

  public constructor(private trackEditorService: TrackEditorService, private proxy: TracksProxyService, private route: ActivatedRoute) {
  }

  public ngOnInit(): void {
  }

  public async ngAfterViewInit(): Promise<void> {
    try {
      await this.proxy.initialize();
      this.getTrackFromProxy();
    } catch (e) {
      console.log(e);

      return;
    }
  }



  public saveTrack(): void {
    if (!this.trackEditorService.track.isValid || !this.trackEditorService.track.isClosed) {
       return;
    }
    this.track.name = this.name;
    this.track.description = this.description;

    this.addWaypointsToTrack(this.trackEditorService.track.waypoints);
    this.proxy.saveTrack(this.track);

  }

  public popUpFunction(): void {
    const popUp: HTMLElement = document.getElementById("popUp");
    if (!this.trackEditorService.track.isValid) {
      popUp.classList.toggle("show");
    }
  }

  private getTrackFromProxy(): void {
    const track: TrackData = this.proxy.findTrack( this.route.snapshot.paramMap.get("trackName") );
    if (track === null) {
      throw new Error("track not found");
    }
    this.track =  { name: track.name, description: track.description,
                    timesPlayed: track.timesPlayed,
                    bestTimes: track.bestTimes, waypoints: track.waypoints
    };
    this.name = track.name;
    this.description = track.description;
  }

  private addWaypointsToTrack(waypoints: Waypoint[]): void {

    // remove initial track waypoints(from server)
    this.track.waypoints.length = 0;

    // add current waypoints(from track-editor-service)
    waypoints.forEach((waypoint) => {
      const positionVector: THREE.Vector3 = waypoint.position;
      const position: [number, number, number] = [positionVector.x, positionVector.y, positionVector.z];
      this.track.waypoints.push(position);
    });

  }



}

import { Injectable } from '@angular/core';
import { TrackSegmentSpeed } from "./trackSegmentSpeed";
import { VirtualPlayerDifficulty } from "./virtualPlayerDifficulty";
import * as THREE from "three";
import { RaceProgressionHandlerService } from "../raceData/raceProgression/race-progression-handler.service";
import { WAYPOINT_RADIUS } from "../constants";

// tslint:disable-next-line:no-magic-numbers
const CORNER_ZONE: number =  WAYPOINT_RADIUS * 3;


@Injectable()
export class SpeedZonesService {

  private speedZones: TrackSegmentSpeed[];
  public constructor( private raceProgressionService: RaceProgressionHandlerService) {
      this.speedZones = [];
  }

  public initialize(playerSkill: VirtualPlayerDifficulty, waypoints: [number, number, number][]): void {
      waypoints.forEach( (waypoint: [number, number, number], index: number) => {
          const angle: number = this.calculateRadianAngle(waypoint,
                                                          waypoints[(index + 1) % waypoints.length],
                                                          waypoints[(index + 2) % waypoints.length]);
          this.speedZones.push(this.createTrackSpeedZone(playerSkill, angle));
      });
  }

  public speedZone(name: string): number {
      return this.isInCornerZone(name) ?
      this.speedZones[this.currentTrackIndex(name)].cornerSpeed :
      this.speedZones[this.currentTrackIndex(name)].defaultSpeed;
  }

  private isInCornerZone(name: string): boolean {
      return this.raceProgressionService.getPlayerProgression(name).distanceToNextWaypoint() < CORNER_ZONE;
  }

  private currentTrackIndex(name: string): number {
      return this.raceProgressionService.getPlayerProgression(name).currentWaypointIndex;
  }

  private calculateRadianAngle(   firstWaypoint: [number, number, number],
                                  secondWaypoint: [number, number, number],
                                  thirdWaypoint: [number, number, number]): number {
      const firstTrackDirection: THREE.Vector3 = this.waypointsToVector(firstWaypoint, secondWaypoint);
      const secondTrackDirection: THREE.Vector3 = this.waypointsToVector(secondWaypoint, thirdWaypoint);

      let angle: number = secondTrackDirection.angleTo(firstTrackDirection);
      if ( Math.sign(firstTrackDirection.x) !== Math.sign(secondTrackDirection.x)) {
          angle = Math.PI - angle;
      }

      return angle;
  }

  private waypointsToVector(  firstWaypoint: [number, number, number],
                              secondWaypoint: [number, number, number]): THREE.Vector3 {
          return new THREE.Vector3(
          secondWaypoint[0] - firstWaypoint[0],
          secondWaypoint[1] - firstWaypoint[1],
          secondWaypoint[2] - firstWaypoint[2]
      );
  }

  private createTrackSpeedZone(playerSkill: VirtualPlayerDifficulty, angle: number): TrackSegmentSpeed {
      return {cornerSpeed: playerSkill.cornerSpeed * this.cornerSlowDownFactor(angle),
              defaultSpeed: playerSkill.defaultSpeed * this.cornerSlowDownFactor(angle)};
  }

  private cornerSlowDownFactor(angle: number): number {
      return Math.sqrt((Math.PI - angle) / Math.PI);
  }


}

import { Injectable } from '@angular/core';
import { RaceProgressionHandlerService } from '../raceProgression/race-progression-handler.service';
import { RaceResultsService } from '../recordedTimes/race-results.service';
import { RaceProgression } from '../raceProgression/raceProgression';
import { MAX_N_LAPS } from '../../constants';


const AVERAGE_SPEED: number = 0.1;

@Injectable()
export class ResultsSimulatorService {

    public constructor( private raceProgressionService: RaceProgressionHandlerService,
                        private raceResultsService: RaceResultsService) { }


    public simulateEndResults(endTime: number): void {
        this.raceProgressionService.unfinishedPlayers.forEach( (player: [string, RaceProgression]) => {
            let time: number = endTime;

            time += this.time(this.lapDistanceLeft(player[1]));
            this.raceResultsService.doneLap(player[0], time);


            for (let i: number = 0; i < MAX_N_LAPS - (player[1].nLap + 1); i++) {
                time += this.time(this.trackLength(player[1].waypoints));
                this.raceResultsService.doneLap(player[0], time);
            }
        });
    }

    public time(distance: number): number {
        return distance / AVERAGE_SPEED;
    }

    private lapDistanceLeft(playerResults: RaceProgression): number {
        let distanceLeft: number = 0;
        for (let i: number = playerResults.nextWaypointIndex; i < playerResults.waypoints.length; i++)
            distanceLeft += this.segmentLength( playerResults.waypoints[i],
                                                playerResults.waypoints[i + 1 < playerResults.waypoints.length ? i + 1 : 0]);

        distanceLeft += playerResults.distanceToNextWaypoint();

        return distanceLeft;
    }


    private trackLength(waypoints: [number, number, number][]): number {
        let tracklength: number = 0;
        waypoints.forEach( (elem: [number, number, number], index: number) => {
            tracklength += this.segmentLength(  waypoints[index],
                                                waypoints[index + 1 < waypoints.length ? index + 1 : 0]);
        });

        return tracklength;
    }

    private segmentLength(firstWaypoint: [number, number, number], secondWaypoint: [number, number, number]): number{
        return Math.sqrt((Math.pow(firstWaypoint[0] - secondWaypoint[0], 2) +
                Math.pow(firstWaypoint[1] - secondWaypoint[1], 2) +
                Math.pow(firstWaypoint[2] - secondWaypoint[2], 2)));
    }

}

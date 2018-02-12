import { Road } from "./road";
import * as THREE from "three";
import { Waypoint } from "../../track/trackData/waypoint";

export class Constraints {

    // TODO: find better name
    private _invalidPlanesId: number[] = [];

    private roads: Road[] = [];

    public constructor () {
    }

    public addRoads(waypoints: Waypoint[]): void {
        let previousRoad: Road = this.roads[this.roads.length - 1];
        for (let i: number = 0; i < waypoints.length - 1; i++) {
            const road: Road = new Road(waypoints[i].getPosition(), waypoints[i + 1].getPosition(),
                                        waypoints[i].getOutgoingPlaneId(), previousRoad);
            road.initialize();
            this.roads.push(road);
            previousRoad = road;
        }
    }

    public closeRoad(): void {
        this.roads[0].previousRoad = this.roads[this.roads.length - 1];
    }

    public get invalidPlanesId(): number[] {
        return this._invalidPlanesId;
    }

    public removeRoad(roadId: number): void {
        const index: number = this.findRoadIndex(roadId);
        this.roads.splice(index, 1);
    }

    public movedWaypoint(waypoint: Waypoint, newPos: THREE.Vector3): void {
        const firstRoad: Road = this.getRoad(waypoint.getIncomingPlaneId());
        const secondRoad: Road = this.getRoad(waypoint.getOutgoingPlaneId());

        if (this.isDefined(firstRoad)) {
            firstRoad.endPoint = waypoint.getPosition();
            firstRoad.initialize();
        }
        if (this.isDefined(secondRoad)) {
            secondRoad.beginPoint = waypoint.getPosition();
            secondRoad.initialize();
        }
    }

    public updateInvalidPlanes(): void {
        this._invalidPlanesId = [];
        this.roads.forEach((road) => {
            road.initialize();
            if (this.isRoadInvalid(road))
                this.invalidPlanesId.push(road.id);
        });
    }

    private isRoadInvalid(road: Road): boolean {
        let roadInvalid: boolean = false;
        console.log("ROAD: ")
        console.log(road)
        console.log("road.validAngle()");
        console.log(road.validAngle());
        console.log("road.validWidthHeightRatio()");
        console.log(road.validWidthHeightRatio());
        if (!(road.validAngle() && road.validWidthHeightRatio()))
            roadInvalid = true;
        else {
            this.roads.forEach((element) => {
                if (element.intersects(road)) {
                    console.log("road intersects with ");
                    console.log(element);
                    roadInvalid = true;
                }
            });
        }

        return roadInvalid;
    }

    private findRoadIndex(id: number): number {
        let index: number = null;
        this.roads.forEach((element, i) => {
            if (element.id === id)
                index = i;
        });

        return index;
    }

    private getRoad(id: number): Road {
        let road: Road = null;
        if (this.isDefined(id))
            road = this.roads[this.findRoadIndex(id)];

        return road;
    }

    /*tslint:disable:no-any*/
    private isDefined(object: any): boolean {
        return ((object !== null) && (object !== undefined));
    }/*tslint:enable:no-any*/
}


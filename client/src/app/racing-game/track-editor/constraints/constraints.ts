import { Road } from "./road";
import * as THREE from "three";
import { Waypoint } from "../../track/trackData/waypoint";
import { ErrorType } from "../../constants";
import { ConstraintsError } from "./constraintsError";

export class Constraints {

    // TODO: find better name
    private _invalidPlanesErrors: ConstraintsError[] = [];

    private roads: Road[] = [];

    public constructor () {
    }

    public addRoads(waypoints: Waypoint[]): void {
        let previousRoad: Road = this.roads[this.roads.length - 1];
        for (let i: number = 0; i < waypoints.length - 1; i++) {
            const road: Road = new Road(waypoints[i].position, waypoints[i + 1].position,
                                        waypoints[i].getOutgoingPlaneId(), previousRoad);
            road.initialize();
            this.roads.push(road);
            previousRoad = road;

        }
    }

    public closeRoad(): void {
        this.roads[0].previousRoad = this.roads[this.roads.length - 1];
    }

    public get invalidPlanesErrors(): ConstraintsError[] {
        return this._invalidPlanesErrors;
    }

    public removeRoad(roadId: number): void {
        const index: number = this.findRoadIndex(roadId);
        this.roads.splice(index, 1);
    }

    public movedWaypoint(waypoint: Waypoint, newPos: THREE.Vector3): void {
        const firstRoad: Road = this.getRoad(waypoint.getIncomingPlaneId());
        const secondRoad: Road = this.getRoad(waypoint.getOutgoingPlaneId());

        if (this.isDefined(firstRoad)) {
            firstRoad.endPoint = waypoint.position;
            firstRoad.initialize();
        }
        if (this.isDefined(secondRoad)) {
            secondRoad.beginPoint = waypoint.position;
            secondRoad.initialize();
        }
    }

    public updateInvalidPlanes(): void {
        this._invalidPlanesErrors = [];
        this.roads.forEach((road) => {
            road.initialize();
            this.validityCheck(road);
        });
    }

    private validityCheck(road: Road): void {

        if (!road.hasValidAngle() ) {
            this._invalidPlanesErrors.push(new ConstraintsError(ErrorType.ANGLE, road.id, road.previousRoad.id));
        }
        if (!road.hasValidWidthHeightRatio()) {
            this._invalidPlanesErrors.push(new ConstraintsError(ErrorType.WIDTHLENGTHRATIO, road.id));
        }
        this.roads.forEach((element) => {
            if (element.intersects(road)) {
                this._invalidPlanesErrors.push(new ConstraintsError(ErrorType.INTERSECTS, road.id));
            }
        });
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


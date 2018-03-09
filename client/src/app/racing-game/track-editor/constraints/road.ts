import { Point } from "./math/point";
import { LineEquation } from "./math/lineEquation";
import * as THREE from "three";
import { TRACK_WIDTH, DEG_TO_RAD } from '../../constants';
// tslint:disable:no-magic-numbers
const MAXANGLE: number = DEG_TO_RAD * 135;
const MINIMUMRATIO: number = 2;
// tslint:enable:no-magic-numbers

export class Road {

    private _lineEquation: LineEquation;

    public constructor ( private _beginPoint: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
                         private _endPoint: THREE.Vector3 = new THREE.Vector3(1, 0, 0),
                         private _id: number = 0, private _previousRoad: Road = null) {
        this._lineEquation = new LineEquation();
    }

    public initialize(): void {
        this._lineEquation.initialize(new Point(this._beginPoint), new  Point(this._endPoint));
    }

    public get previousRoad(): Road {
        return this._previousRoad;
    }

    public set previousRoad(previousRoad: Road) {
        this._previousRoad = previousRoad;
    }

    public get id(): number {
        return this._id;
    }
    public get beginPoint(): THREE.Vector3 {
        return this._beginPoint;
    }

    public set beginPoint(newPos: THREE.Vector3) {
        this._beginPoint = newPos;
        this.initialize();
    }

    public get endPoint(): THREE.Vector3 {
        return this._endPoint;
    }

    public set endPoint(newPos: THREE.Vector3) {
        this._endPoint = newPos;
        this.initialize();
    }

    public get lineEquation(): LineEquation {
        return this._lineEquation;
    }


    public hasValidWidthHeightRatio(): boolean {
        return this.getLength() / TRACK_WIDTH >= MINIMUMRATIO;
    }

    // tslint:disable:prefer-const
    public hasValidAngle(): boolean {
        let hasValidAngle: boolean = true;
        if (this.isDefined(this.previousRoad)) {
            let previousRoadVector: THREE.Vector3 = new THREE.Vector3();
            previousRoadVector.subVectors(this.previousRoad.endPoint, this.previousRoad.beginPoint );
            let thisRoadVector: THREE.Vector3 = new THREE.Vector3();
            thisRoadVector.subVectors(this.endPoint, this.beginPoint);
            hasValidAngle = thisRoadVector.angleTo(previousRoadVector) <= MAXANGLE;
        }

        return hasValidAngle;
    }
    // tslint:enable:prefer-const

    public intersects(road: Road): boolean {
        let intersects: boolean = false;
        if (!(this === road || road === this.previousRoad || road.previousRoad === this)) {
            if (this.lineEquation.isVerticalLine || road.lineEquation.isVerticalLine) {
                intersects = this.verticalLineIntersection(road);
            } else {
                const intersection: Point = this.lineEquation.intersection(road.lineEquation);
                intersects = this.lineEquation.xInDomain(intersection.x) &&
                road.lineEquation.xInDomain(intersection.x);
            }
        }

        return intersects;
    }

    private verticalLineIntersection(road: Road): boolean {
        let intersects: boolean = false;
        if (this.lineEquation.isVerticalLine && road.lineEquation.isVerticalLine) {
            if (this.lineEquation.lineInDomain(road.lineEquation) &&
                this.lineEquation.lineInImage(road.lineEquation))
                intersects = true;
        } else if (this.lineEquation.isVerticalLine) {
            const y: number = road.lineEquation.image(this.lineEquation.beginPoint.x);
            intersects = this.lineEquation.yInImage(y);
        } else if (road.lineEquation.isVerticalLine) {
            const y: number = this.lineEquation.image(road.lineEquation.beginPoint.x);
            intersects = road.lineEquation.yInImage(y);
        }

        return intersects;
    }

    private getLength(): number {
        return this._beginPoint.distanceTo(this._endPoint);
    }

    // tslint:disable:no-any
    private isDefined(object: any): boolean {
        return ((object !== null) && (object !== undefined));
    }// tslint:enable:no-any
}

import { Point } from "./math/point";
import { LineEquation } from "./math/lineEquation";
import * as THREE from "three";
import { TRACKWIDTH, DEG_TO_RAD } from '../../constants';
// tslint:disable:no-magic-numbers
const MAXANGLE: number = DEG_TO_RAD * 45;
const MINIMUMRATIO: number = 2;
// tslint:enable:no-magic-numbers
// tslint:disable:no-console
export class Road {

    private _lineEquation: LineEquation;

    public constructor ( private _firstPoint: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
                         private _secondPoint: THREE.Vector3 = new THREE.Vector3(1, 0, 0)) {
        this._lineEquation = new LineEquation(new Point(this.firstPoint), new  Point(this.secondPoint));
    }

    public initialize( ): void {
        this._lineEquation.initialize();
    }

    public get lineEquation(): LineEquation {
        return this._lineEquation;
    }

    public get firstPoint(): THREE.Vector3 {
        return this._firstPoint;
    }

    public get secondPoint(): THREE.Vector3 {
        return this._secondPoint;
    }

    public validWidthHeightRatio(): boolean {
        return this.getLength() / TRACKWIDTH >= MINIMUMRATIO;
    }

    // tslint:disable:prefer-const
    public validAngle(previousRoad: Road): boolean {
        let previousRoadVector: THREE.Vector3 = new THREE.Vector3();
        previousRoadVector.subVectors(previousRoad.secondPoint, previousRoad.firstPoint );
        let thisRoadVector: THREE.Vector3 = new THREE.Vector3();
        thisRoadVector.subVectors(this.secondPoint, this.firstPoint);

        return thisRoadVector.angleTo(previousRoadVector) <= MAXANGLE;
    }
    // tslint:enable:prefer-const

    public intersects(road: Road): boolean {
        let intersects: boolean = false;
        if (this.lineEquation.isVerticalLine || road.lineEquation.isVerticalLine) {
            intersects = this.verticalLineIntersection(road);
        } else {
            const intersection: Point = this.lineEquation.intersection(road.lineEquation);
            intersects = this.lineEquation.xInDomain(intersection.x) &&
            road.lineEquation.xInDomain(intersection.x);
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
        return this.firstPoint.distanceTo(this.secondPoint);
    }

}

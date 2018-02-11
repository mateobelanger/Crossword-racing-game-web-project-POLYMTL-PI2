import { Point } from "./point";
import * as THREE from "three";
export class LineEquation {

    // y = ax + b
    private _slope: number;

    private _b: number;

    private _isVerticalLine: boolean = false;

    private _beginPoint: Point;

    private _endPoint: Point;

    public constructor( beginPoint: Point = new Point(new THREE.Vector3()),
                        endPoint: Point= new Point(new THREE.Vector3())) {
        if (beginPoint.x < endPoint.y) {
            this._beginPoint = beginPoint;
            this._endPoint = endPoint;
        } else {
            this._beginPoint = endPoint;
            this._endPoint = beginPoint;
        }
    }

    public initialize(): void {
        if ( this.beginPoint.x === this.endPoint.x )
            this._isVerticalLine = true;
        this.calculateLineEquation(this._beginPoint, this._endPoint);
    }

    public get beginPoint(): Point {
        return this._beginPoint;
    }

    public get endPoint(): Point {
        return this._endPoint;
    }

    public get slope(): number {
        return this._slope;
    }

    public get b(): number {
        return this._b;
    }

    public get isVerticalLine(): boolean {
        return this._isVerticalLine;
    }

    public lineInDomain(line: LineEquation): boolean {
        return (line.beginPoint.x <= this.endPoint.x && line.endPoint.x >= this.beginPoint.x);
    }

    public xInDomain(x: number): boolean {
        return (this.beginPoint.x <= x || this.endPoint.x >= x);
    }

    public lineInImage(line: LineEquation): boolean {
        return (line.beginPoint.y <= this.endPoint.y && line.endPoint.y >= this.beginPoint.y);
    }
    public yInImage(y: number): boolean {
        return (this.beginPoint.y <= y || this.endPoint.y >= y);
    }

    public intersection(line: LineEquation): Point {
        const xInstersection: number = (line.b - this.b) / (this.slope - line.slope);
        const yInstersection: number = this.image(xInstersection);

        return new Point( new THREE.Vector3(xInstersection, yInstersection));
    }

    public image(x: number): number {
        return x * this.slope + this.b;
    }

    private calculateLineEquation(firstPoint: Point, secondPoint: Point): void {
        this._slope = this.calculateSlope(firstPoint, secondPoint);
        this._b = this.calculateB(firstPoint);
    }

    private calculateSlope(firstPoint: Point, secondPoint: Point): number {
        return this._isVerticalLine ? NaN : ((secondPoint.y - firstPoint.y) / (secondPoint.x - firstPoint.x));
    }

    private calculateB(point: Point): number {
        return this._isVerticalLine ? NaN : point.y - this._slope * point.x;
    }
}

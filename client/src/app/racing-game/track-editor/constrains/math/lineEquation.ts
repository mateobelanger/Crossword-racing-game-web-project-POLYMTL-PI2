import { Point } from "./point";

export class LineEquation {

    // y = ax + b
    private _slope: number;

    private _b: number;

    private _lowerBound: number;

    private _higherBound: number;

    private _isVerticalLine: boolean = false;

    public constructor() {
    }

    public initialize(firstPoint: Point, secondPoint: Point): void {
        this._lowerBound = firstPoint.x;
        this._higherBound = secondPoint.x;
        if ( firstPoint.x === secondPoint.x )
            this._isVerticalLine = true;
        this.calculateLineEquation(firstPoint, secondPoint);
    }

    public get higherBound(): number {
        return this._higherBound;
    }

    public get lowerBound(): number {
        return this._lowerBound;
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

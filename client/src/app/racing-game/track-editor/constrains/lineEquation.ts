import { Point } from "./point";

export default class LineEquation {

    // y = ax + b
    private slope: number;

    private b: number;

    private _lowerBound: number;

    private _higherBound: number;

    private isVerticalLine: boolean = false;

    public constructor() {
    }

    public initialize(firstPoint: Point, secondPoint: Point): void {
        this._lowerBound = firstPoint.x;
        this._higherBound = secondPoint.x;
        if ( firstPoint.x === secondPoint.x )
            this.isVerticalLine = true;
        this.calculateLineEquation(firstPoint, secondPoint);
    }

    public get higherBound(): number {
        return this._higherBound;
    }

    public get lowerBound(): number {
        return this._lowerBound;
    }

    private calculateLineEquation(firstPoint: Point, secondPoint: Point): void {
        this.calculateSlope(firstPoint, secondPoint);
        this.calculateB(firstPoint);
    }

    private calculateSlope(firstPoint: Point, secondPoint: Point): number {
        return this.isVerticalLine ? NaN : ((secondPoint.y - firstPoint.y) / (secondPoint.x - firstPoint.x));
    }

    private calculateB(point: Point): number {
        return this.isVerticalLine ? NaN : point.y - this.slope * point.x;
    }
}

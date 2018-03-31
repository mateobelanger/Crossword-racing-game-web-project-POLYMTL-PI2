export class ConstraintsError {

    public constructor( private _planeId: number) {
    }

    public get planeId(): number {
        return this._planeId;
    }

}

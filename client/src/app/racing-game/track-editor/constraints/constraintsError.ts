import { ErrorType } from "../../constants";

export class ConstraintsError {

    public constructor(private _errorType: ErrorType, private _planeId: number) {
    }

    public get planeId(): number {
        return this._planeId;
    }

    public get errorType(): ErrorType {
        return this._errorType;
    }
}

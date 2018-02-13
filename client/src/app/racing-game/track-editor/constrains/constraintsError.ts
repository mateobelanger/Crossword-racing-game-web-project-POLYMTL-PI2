import { ErrorType } from "../../constants";

export class ConstraintsError {

        public constructor( private _errorType: ErrorType, private _firstPlaneId: number,
                            private _secondPlaneId: number = null) {
        }

        public get planesId(): number[] {
            const ids: number[] = [this._firstPlaneId];
            if (this.isDefined(this._secondPlaneId))
                ids.push(this._secondPlaneId);

            return ids;
        }

        public get errorType(): ErrorType {
            return this._errorType;
        }


        /*tslint:disable:no-any*/
        private isDefined(object: any): boolean {
            return ((object !== null) && (object !== undefined));
        }/*tslint:enable:no-any*/
}

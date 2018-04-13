import { ConstraintsError } from "./constraintsError";

export class InvalidAngleError extends ConstraintsError {

    public constructor(planeId: number) {
        super(planeId);
    }
}

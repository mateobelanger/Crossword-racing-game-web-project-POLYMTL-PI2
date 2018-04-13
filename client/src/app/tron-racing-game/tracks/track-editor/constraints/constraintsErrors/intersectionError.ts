import { ConstraintsError } from "./constraintsError";

export class IntersectionError extends ConstraintsError {

    public constructor(planeId: number) {
        super(planeId);
    }
}

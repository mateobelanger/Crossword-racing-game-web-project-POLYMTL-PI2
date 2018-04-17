import { ConstraintsError} from "./constraintsError";

export class SizeError extends ConstraintsError {
    public constructor(planeId: number) {
        super(planeId);
    }
}

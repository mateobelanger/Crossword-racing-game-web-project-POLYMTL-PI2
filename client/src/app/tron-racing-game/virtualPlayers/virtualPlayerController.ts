import { Car } from "../physics&interactions/cars/car/car";


export class VirtualPlayerController extends Car {

    public constructor() { super(); }

    public update(detltaTime: number): void {
        this.control();
        super.update(detltaTime);
    }

    private control(): void {
        this.ajustSteer();
        this.ajustSpeed();
    }

    private ajustSteer(): void {

    }

    private ajustSpeed(): void {

    }
}

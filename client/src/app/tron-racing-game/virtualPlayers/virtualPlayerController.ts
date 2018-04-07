import { Car } from "../physics&interactions/cars/car/car";
import { SpeedZonesService } from "./speed-zones.service";

const SPEED_GAP: number = 5;
const MAX_SPEED_MOFIFIER: number = 30;

export class VirtualPlayerController extends Car {

    private speedModifier: number;
    public constructor( private speedZonesService: SpeedZonesService,
                        private aiPlayerName: string) {
                            super();
                            this.speedModifier = (Math.random() * MAX_SPEED_MOFIFIER - (MAX_SPEED_MOFIFIER / 2));
                        }

    public update(detltaTime: number): void {
        this.control();
        super.update(detltaTime);
    }

    private control(): void {
        this.reset();
        this.ajustSteer();
        this.ajustSpeed();
    }

    private ajustSteer(): void {

    }

    private ajustSpeed(): void {
        if (this.speed.length() >  this.aimedSpeed + SPEED_GAP) {
            this.brake();
        } else if (this.speed.length() < this.aimedSpeed - SPEED_GAP) {
            this.isAcceleratorPressed = true;
        }
    }

    private get aimedSpeed(): number {
        return this.speedZonesService.speedZone(this.aiPlayerName) + this.speedModifier;
    }

    private reset(): void {
        this.isAcceleratorPressed = false;
        this.resetSpeedModifiers();
    }

    private resetSpeedModifiers(): void {
        this.releaseBrakes();
        this.isAcceleratorPressed = false;
    }
}

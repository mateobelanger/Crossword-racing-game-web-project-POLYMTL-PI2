import { Car } from "../physics&interactions/cars/car/car";
import { SpeedZonesService } from "./speed-zones.service";
import { RaceProgressionHandlerService } from "../raceData/raceProgression/race-progression-handler.service";
import * as THREE from "three";

const SPEED_GAP: number = 5;
const MAX_SPEED_MOFIFIER: number = 1;

export class VirtualPlayerController extends Car {

    private speedModifier: number;
    public constructor( private speedZonesService: SpeedZonesService,
                        private raceProgressionService: RaceProgressionHandlerService,
                        private aiPlayerName: string) {
                            super();
                            this.speedModifier = (Math.random() * MAX_SPEED_MOFIFIER - (MAX_SPEED_MOFIFIER / 2)) + 1;
                        }

    public update(detltaTime: number): void {
        this.control();
        super.update(detltaTime);
    }

    private control(): void {
        this.reset();
        this.adjustSteer();
        this.adjustSpeed();
    }

    private adjustSteer(): void {
        const crossVector: THREE.Vector3 = this.direction.cross(this.trackDirection());

        if (crossVector.y > 0) {
            this.steerLeft();
        } else {
            this.steerRight();
        }
    }

    private adjustSpeed(): void {
        if (this.speed.length() >  this.aimedSpeed + SPEED_GAP) {
            this.brake();
        } else if (this.speed.length() < this.aimedSpeed - SPEED_GAP) {
            this.isAcceleratorPressed = true;
        }
    }

    private get aimedSpeed(): number {
        return this.speedZonesService.speedZone(this.aiPlayerName) * this.speedModifier;
    }

    private reset(): void {
        this.releaseBrakes();
        this.isAcceleratorPressed = false;
    }

    private trackDirection(): THREE.Vector3 {
        return new THREE.Vector3().subVectors(
            this.raceProgressionService.getPlayerProgression(this.aiPlayerName).nextWaypointPosition,
            this.raceProgressionService.getPlayerProgression(this.aiPlayerName).currentWaypointPosition
        );
    }
}

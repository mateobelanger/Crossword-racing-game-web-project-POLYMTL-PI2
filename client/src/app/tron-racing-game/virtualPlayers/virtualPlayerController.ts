import { Car } from "../physics&interactions/cars/car/car";
import { SpeedZonesService } from "./speed-zones.service";
import { RaceProgressionHandlerService } from "../raceData/raceProgression/race-progression-handler.service";
import * as THREE from "three";

const SPEED_GAP: number = 5;
const MAX_SPEED_MOFIFIER: number = 1;
const REFERENCE_VECTOR: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
const ROTATION_AXIS: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

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
        this.ajustSteer();
        this.ajustSpeed();
    }

    private ajustSteer(): void {
        if (this.direction.applyAxisAngle(ROTATION_AXIS, this.angleToTrackDirectionReferential()).z < 0) {
            this.steerRight();
        } else if (this.direction.applyAxisAngle(ROTATION_AXIS, this.angleToTrackDirectionReferential()).z > 0) {
            this.steerLeft();
        }
    }

    private ajustSpeed(): void {
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
        this.isAcceleratorPressed = false;
        this.resetSpeedModifiers();
    }

    private resetSpeedModifiers(): void {
        this.releaseBrakes();
        this.isAcceleratorPressed = false;
    }

    private trackDirection(): THREE.Vector3 {
        return new THREE.Vector3().subVectors(
            this.raceProgressionService.getPlayerProgression(this.aiPlayerName).nextWaypointPosition,
            this.raceProgressionService.getPlayerProgression(this.aiPlayerName).currentWaypointPosition
        );
    }

    private angleToTrackDirectionReferential(): number {
        let angle: number = this.trackDirection().angleTo(REFERENCE_VECTOR);
        angle *= this.trackDirection().z > 0 ? -1 : 0;

        return angle;
    }

}

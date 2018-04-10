import { Car } from "../physics&interactions/cars/car/car";
import { SpeedZonesService } from "./speed-zones.service";
import { RaceProgressionHandlerService } from "../raceData/raceProgression/race-progression-handler.service";
import * as THREE from "three";
import { VirtualPlayerDifficulty } from "./virtualPlayerDifficulty";
import { GameState } from "../constants";

const SPEED_GAP: number = 5;
const MAX_SPEED_MOFIFIER: number = 1;
// tslint:disable-next-line:no-magic-numbers
const MAX_DIRECTION_MODIFIER: number = Math.PI / 10;
const ROTATION_AXIS: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
// tslint:disable-next-line:no-magic-numbers
const ANGLE_THRESHOLD: number = Math.PI / 60;

export class VirtualPlayerCar extends Car {
    private speedModifier: number;
    private directionModifier: number;
    private gameState: GameState;
    private aiPlayerName: string;

    public constructor( playerSkill: VirtualPlayerDifficulty,
                        name: string,
                        private speedZonesService: SpeedZonesService,
                        private raceProgressionService: RaceProgressionHandlerService) {
        super();
        this.gameState = GameState.COUTNDOWN;
        this.speedModifier = (Math.random() * MAX_SPEED_MOFIFIER - (MAX_SPEED_MOFIFIER / 2)) + 1;
        this.setDirectionModifier(playerSkill);
        this.aiPlayerName = name;
    }

    public update(detltaTime: number): void {
        switch (this.gameState) {
            case GameState.COUTNDOWN:
                break;
            case GameState.RACE:
                this.control();
                break;
            case GameState.END:
                this.speed = this.speed.setLength(0);
                break;
            default:
                break;
        }
        super.update(detltaTime);
    }

    public changeState(gameState: GameState): void {
        this.gameState = gameState;
    }

    private control(): void {
        this.reset();
        this.adjustSteer();
        this.adjustSpeed();
    }

    private adjustSteer(): void {
        const crossVector: THREE.Vector3 = this.direction.cross(this.trackDirection());
        if ( this.direction.angleTo(this.trackDirection()) > ANGLE_THRESHOLD) {
            if (crossVector.y > 0) {
                this.steerLeft();
            } else {
                this.steerRight();
            }
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
        this.releaseSteering();
        this.resetSpeedModifiers();
    }

    private resetSpeedModifiers(): void {
        this.releaseBrakes();
        this.isAcceleratorPressed = false;
    }

    private trackDirection(): THREE.Vector3 {
        return this.applyDirectionModifier(new THREE.Vector3().subVectors(
            this.raceProgressionService.getPlayerProgression(this.aiPlayerName).nextWaypointPosition,
            this.raceProgressionService.getPlayerProgression(this.aiPlayerName).currentWaypointPosition
        ));
    }

    private applyDirectionModifier(vector: THREE.Vector3): THREE.Vector3 {
        return vector.applyAxisAngle(ROTATION_AXIS, this.directionModifier);
    }

    private setDirectionModifier( playerSkill: VirtualPlayerDifficulty ): void {
        if (playerSkill.isExperimented()) {
            this.directionModifier = 0;
        } else {
            const interval: number = 700;
            window.setInterval(
                () => {
                    this.directionModifier = (Math.random() * MAX_DIRECTION_MODIFIER - (MAX_DIRECTION_MODIFIER / 2));
                },
                interval);
        }
    }
}

import { Injectable } from '@angular/core';
import * as THREE from "three";

import { Car } from "../cars/car/car";
import { Collision } from "./collision";
import { CollisionType } from "../constants";
import { AudioService, SOUND } from "../audio/audio.service";

@Injectable()
export class CollisionHandlerService {

    private _collisions: Collision[];
    private _cars: Car[];

    public constructor(private audioService: AudioService) {
        this._collisions = [];
    }

    public initialize(cars: Car[]): void {
        this._collisions = [];
        this._cars = cars;
    }

    public handleCarCollisions(): void {

        this.updateCollisions();

        // go through all possibilities of cars colliding
        for (let i: number = 0; i < this._cars.length; i++) {
            for (let j: number = i + 1; j < this._cars.length; j++) {
                if (this._cars[i].box.intersectsBox(this._cars[j].box)) {
                    this.handleCollision(this._cars[i], this._cars[j]);
                }
            }
        }

        this.applyCollisionRotations();
    }

    private updateCollisions(): void {

        const collisionIndexesToRemove: number[] = [];
        this._collisions.forEach( (collision: Collision, index: number) => {
            if (!collision.frontCar.box.intersectsBox(collision.backCar.box) && collision.remainingFrames <= 0) {
                collisionIndexesToRemove.push(index);
            }
        });

        for (const index of collisionIndexesToRemove) {
            this._collisions.splice(index, 1);
        }
    }

    private handleCollision(car1: Car, car2: Car): void {
        if (this.isNewCollision(car1, car2)) {

            const newCollision: Collision = new Collision(car1, car2);
            this._collisions.push(newCollision);

            this.switchCarsSpeed(car1, car2);

            this.audioService.playSound(SOUND.COLLISION_SOUND);
        }
    }

    private isNewCollision(car1: Car, car2: Car): boolean {
        let isNewCollision: boolean = true;
        this._collisions.forEach( (collision: Collision) => {
            if (collision.contains(car1) && collision.contains(car2)) {
                isNewCollision = false;
            }
        });

        return isNewCollision;
    }

    private switchCarsSpeed(car1: Car, car2: Car): void {
        const temp: THREE.Vector3 = car1.getSpeed().clone();
        car1.speed = car2.getSpeed().clone();
        car2.speed = temp;
    }

    private applyCollisionRotations(): void {
        this._collisions.forEach( (collision: Collision) => {
            switch (collision.type) {
                case CollisionType.FACE_TO_FACE:
                    collision.frontCar.rotate(collision.rotationPerFrame);
                    collision.backCar.rotate(collision.rotationPerFrame);
                    break;
                case CollisionType.FRONT_CAR_HIT_FROM_RIGHT:
                    collision.frontCar.rotate(-collision.rotationPerFrame);
                    break;
                case CollisionType.FRONT_CAR_HIT_FROM_LEFT:
                default:
                    collision.frontCar.rotate(collision.rotationPerFrame);
                    break;
            }
            collision.remainingFrames--;
        });

    }
}

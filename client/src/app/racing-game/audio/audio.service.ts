import { Injectable } from '@angular/core';
import * as THREE from "three";

const testSound: string = "../../../assets/audio/RG/space.mp3";

@Injectable()
export class AudioService {

    private listener: THREE.AudioListener = new THREE.AudioListener();
    private test: THREE.Audio;

    public constructor() {
        this.test = null;
        this.listener = null;
    }

    public initialize(): void {
        this.listener = new THREE.AudioListener();
        this.test = new THREE.Audio(this.listener);
        this.loadAudio(testSound);

    }

    public loadSound(): void {

        this.listener = new THREE.AudioListener();
        this.test = new THREE.Audio(this.listener);
        //this.test.setBuffer(this.loadAudio(testSound));

    }

    public loadAudio(source: string): Promise<THREE.AudioBuffer> {
        const audioLoader: THREE.AudioLoader = new THREE.AudioLoader();

        return new Promise((progress, error) => {
            audioLoader.load( source, progress, () => {}, error);
        });
    }
}

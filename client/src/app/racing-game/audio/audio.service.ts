import { Injectable } from '@angular/core';
import { Audio, AudioLoader, AudioListener, AudioBuffer, Camera } from 'three';

export const testSound: string = "../../../assets/audio/RG/space.mp3";
const DEFAULT_VOLUME_VALUE: number = 0.5;

@Injectable()
export class AudioService {
    private listener: AudioListener;
    private sound: Audio;
    private audioLoader: AudioLoader;

    public constructor() {
        this.listener = new AudioListener();
        this.audioLoader = new AudioLoader();
    }

    public initialize(camera: Camera): void {
        camera.add(this.listener);

        // initialize global audio source.
        this.sound = new Audio(this.listener);
        this.sound.setVolume(DEFAULT_VOLUME_VALUE);
    }

    public playSound(source: string): void {
        this.audioLoader.load(
            source,
            // on load
            (buffer: AudioBuffer) => {
                this.sound.setBuffer(buffer);
                this.sound.setLoop(true);
                this.sound.play();
            },
            // on progress
            () => { /* do nothing */ },
            // on error
            () => { console.error("Error while loading sound."); }
        );
    }

    public stopSound(): void {
        this.sound.stop();
    }
}

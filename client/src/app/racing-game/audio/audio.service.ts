import { Injectable } from '@angular/core';
import { Audio, AudioLoader, AudioListener, AudioBuffer, Camera } from 'three';

export const testSound: string = "../../../assets/audio/RG/space.mp3";
const DEFAULT_VOLUME_VALUE: number = 0.5;

@Injectable()
export class AudioService {
    private listener: AudioListener;
    private sounds: Audio[];
    private audioLoader: AudioLoader;

    public constructor() {
        this.sounds = [];
        this.listener = new AudioListener();
        this.audioLoader = new AudioLoader();
    }

    public initialize(camera: Camera): void {
        camera.add(this.listener);
    }

    public async registerSound(source: string): Promise<number> {
        const id: number = this.sounds.length;
        await this.audioLoader.load(
            source,
            (buffer: AudioBuffer) => {
                const newSound: Audio = new Audio(this.listener);
                newSound.setBuffer(buffer);
                newSound.setLoop(true);
                newSound.setVolume(DEFAULT_VOLUME_VALUE);
                this.sounds.push(newSound);
            },
            // on progress
            () => { /* do nothing */ },
            // on error
            () => { console.error("Error while loading sound."); }
        );

        return id;
    }

    public playSound(id: number): void {
        if (id >= this.sounds.length || id < 0) {
            return;
        }
        this.sounds[id].play();
    }

    public stopSound(id: number): void {
        this.sounds[id].stop();
    }

    public setVolume(id: number, volume: number): void {
        this.sounds[id].setVolume(volume);
    }
}

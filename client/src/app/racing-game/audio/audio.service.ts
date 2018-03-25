import { Injectable } from '@angular/core';
import { Audio, AudioLoader, AudioListener, AudioBuffer, Camera } from 'three';

export const testSound: string = "../../../assets/audio/RG/space.mp3";
const DEFAULT_VOLUME_VALUE: number = 0.5;

@Injectable()
export class AudioService {
    private _listener: AudioListener;
    private _sounds: Audio[];
    private _audioLoader: AudioLoader;

    public constructor() {
        this._sounds = [];
        this._listener = new AudioListener();
        this._audioLoader = new AudioLoader();
    }

    public initialize(camera: Camera): void {
        camera.add(this._listener);
    }

    public async registerSound(source: string): Promise<number> {
        const id: number = this._sounds.length;
        await this._audioLoader.load(
            source,
            (buffer: AudioBuffer) => {
                const newSound: Audio = new Audio(this._listener);
                newSound.setBuffer(buffer);
                newSound.setLoop(true);
                newSound.setVolume(DEFAULT_VOLUME_VALUE);
                this._sounds.push(newSound);
            },
            // on progress
            () => { /* do nothing */ },
            // on error
            () => { console.error("Error while loading sound."); }
        );

        return id;
    }

    public playSound(soundId: number): void {
        this.findSound(soundId).play();
    }

    public stopSound(soundId: number): void {
        this.findSound(soundId).stop();
    }

    public setVolume(soundId: number, volume: number): void {
        this.findSound(soundId).setVolume(volume);
    }

    public stopAllSounds(): void {
        for (const sound of this._sounds) {
            sound.stop();
        }
    }

    private findSound(soundId: number): Audio {
        if (soundId < 0 || soundId >= this._sounds.length) {
            return new Audio(this._listener);       // acts like a null object since its buffer is never loaded.
        }

        return this._sounds[soundId];
    }
}

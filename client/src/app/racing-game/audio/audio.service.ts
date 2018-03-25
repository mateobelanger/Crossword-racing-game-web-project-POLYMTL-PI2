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

    public playSound(id: number): void {
        if (id >= this._sounds.length || id < 0) {
            return;
        }
        this._sounds[id].play();
    }

    public stopSound(id: number): void {
        this._sounds[id].stop();
    }

    public setVolume(id: number, volume: number): void {
        this._sounds[id].setVolume(volume);
    }

    public stopAllSounds(): void {
        for (const sound of this._sounds) {
            sound.stop();
        }
    }
}

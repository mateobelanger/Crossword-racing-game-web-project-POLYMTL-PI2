import { Injectable } from '@angular/core';
import { Audio, AudioLoader, AudioListener, AudioBuffer, Camera } from 'three';

// TODO: move sound files paths outside Audio Service to their proper location
const CAR_ENGINE_SOUND: string = "../../../assets/audio/RG/car-engine.wav";
const CAR_COLLISION_SOUND: string = "../../../assets/audio/RG/car-collision.wav"
const FORCE_FIELD_SOUND: string = "../../../assets/audio/RG/force-field.wav";

const DEFAULT_VOLUME_VALUE: number = 0.5;

export enum SOUND {
    COLLISION_SOUND,
    WALL_SOUND,
    ENGINE_SOUND
}

@Injectable()
export class AudioService {
    private _listener: AudioListener;
    private _sounds: Audio[];
    private _audioLoader: AudioLoader;

    public constructor() {
        this._sounds = [];
        this._listener = new AudioListener();
        this._audioLoader = new AudioLoader();
        this._sounds = [];
    }

    public initialize(camera: Camera): void {
        this._sounds = [];
        camera.add(this._listener);
    }

    public loadSounds(): void {
        this.registerSound(CAR_ENGINE_SOUND);
        this.registerSound(CAR_COLLISION_SOUND);
        this.registerSound(FORCE_FIELD_SOUND);
    }
    
    
    public playSound(soundId: number): void {
        if (!this.findSound(soundId).isPlaying) {
            this.findSound(soundId).play();
        }
    }
    
    public stopSound(soundId: number): void {
        this.findSound(soundId).stop();
    }
    
    public setVolume(soundId: number, volume: number): void {       // volume between 0 and 1
        this.findSound(soundId).setVolume(volume);
    }

    public setPlaybackRate(soundId: number, value: number): void {
        this.findSound(soundId).setPlaybackRate(value);
    }
    
    public setLoop(soundId: number): void {
        this.findSound(soundId).setLoop(true);
    }
    
    private findSound(soundId: number): Audio {
        if (soundId < 0 || soundId >= this._sounds.length) {
            return new NullAudio(this._listener);
        }
        
        return this._sounds[soundId];
    }

    private registerSound(source: string): void {
        this._audioLoader.load(
            source,
            (buffer: AudioBuffer) => {
                const audio = new Audio(this._listener);
                audio.setBuffer(buffer);
                audio.setLoop(false);
                audio.setVolume(DEFAULT_VOLUME_VALUE);
                this._sounds.push(audio);
            },
            // on progress
            () => { /* do nothing */ },
            // on error
            () => { console.error("Error while loading sound."); }
        );
    }
}

// null object of THREE.Audio
class NullAudio extends Audio {
    public play(): Audio { return null; }
    public stop(): Audio { return null; }
    public setVolume(volume: number): Audio { return null; }
    public setPlaybackRate(value: number): Audio { return null; }
    public setLoop(value: boolean): void {}
}

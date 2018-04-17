import { Injectable } from "@angular/core";
import { Audio, AudioLoader, AudioListener, AudioBuffer, Camera } from "three"; 

const DEFAULT_VOLUME_VALUE: number = 0.5;

interface ISound {
    path: string;       /* Id to distinguish between different Audio objects */
    audio: Audio;
}

@Injectable()
export class AudioService {
    private _sounds: ISound[];
    private _listener: AudioListener;
    private _audioLoader: AudioLoader;

    public constructor() {
        this._sounds = [];
        this._listener = new AudioListener();
        this._audioLoader = new AudioLoader();
    }

    public initialize(camera: Camera): void {
        this._sounds = [];
        camera.add(this._listener);
    }

    public playSound(path: string, volume: number = DEFAULT_VOLUME_VALUE, isLooping: boolean = false): void {
        const sound: ISound = this.findSound(path);
        if (sound !== null) {
            sound.audio.setVolume(volume);
            if (!sound.audio.isPlaying) {
                sound.audio.setLoop(isLooping);
                sound.audio.play();
            }
        } else {
            this.loadAndPlaySound(path, volume, isLooping);
        }
    }

    public stopSound(path: string): void {
        const sound: ISound = this.findSound(path);
        if (sound !== null) {
            sound.audio.setLoop(false);
            sound.audio.stop();
        }
    }

    public stopAllSounds(): void {
        this._sounds.forEach( (sound: ISound) => {
            this.stopSound(sound.path);
        });
    }

    private findSound(path: string): ISound {
        for (const sound of this._sounds) {
            if (sound.path === path) {
                return sound;
            }
        }

        return null;
    }

    private loadAndPlaySound(source: string, volume: number, isLooping: boolean): void {
        // temporary null audio to prevent duplicates while buffer is loading */
        this._sounds.push({path: source, audio: new NullAudio(this._listener)});

        this._audioLoader.load(
            source,
            (buffer: AudioBuffer) => {
                const audio: Audio = new Audio(this._listener);
                audio.setBuffer(buffer);
                audio.setLoop(isLooping);
                audio.setVolume(volume);
                audio.play();

                this.findSound(source).audio = audio;
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
    public play(): Audio { return this; }
    public stop(): Audio { return this; }
    public setVolume(volume: number): Audio { return this; }
    public setPlaybackRate(value: number): Audio { return this; }
    public setLoop(value: boolean): void {}
}

import { Injectable } from "@angular/core";

@Injectable()
export class InputHandlerService {
    private keys: Map <number, Function>;

    public constructor() {
        this.keys = new Map<number, Function>();
    }
        // this.inputhandler.addListener('W', () => { this.forward(); });

    public addListener(keycode: number, action: Function): void {
        this.keys.set(keycode, action);
    }

    public handleInput(event: KeyboardEvent, isKeyDown: boolean): void {
        if (this.keys.has(event.keyCode)) {
            this.keys.get(event.keyCode)(isKeyDown);
        }
    }
}

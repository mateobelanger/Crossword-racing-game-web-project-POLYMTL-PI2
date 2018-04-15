import { Injectable } from "@angular/core";

@Injectable()
export class InputHandlerService {
    private keysDown: Map <number, Function>;
    private keysUp: Map <number, Function>;

    public constructor() {
        this.keysDown = new Map<number, Function>();
        this.keysUp = new Map<number, Function>();
    }
        // this.inputhandler.addListener('W', () => { this.forward(); });

    public addListener(keycode: number, isKeyDown: boolean, action: Function): void {
        isKeyDown ? this.keysDown.set(keycode, action) : this.keysUp.set(keycode, action);
    }

    public handleInput(event: KeyboardEvent, isKeyDown: boolean): void {
        if (isKeyDown && this.keysDown.has(event.keyCode)) {
            this.keysDown.get(event.keyCode)(isKeyDown);
        } else if (this.keysUp.has(event.keyCode)) {
            this.keysDown.get(event.keyCode)(isKeyDown);
        }
    }
}

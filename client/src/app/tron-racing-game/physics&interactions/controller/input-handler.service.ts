import { Injectable } from "@angular/core";

@Injectable()
export class InputHandlerService {
    private _keys: Map <number, Function>;

    public constructor() {
        this._keys = new Map<number, Function>();
    }

    public addListener(keycode: number, action: Function): void {
        this._keys.set(keycode, action);
    }

    public handleInput(event: KeyboardEvent, isKeyDown: boolean): void {
        if (this._keys.has(event.keyCode)) {
            this._keys.get(event.keyCode)(isKeyDown);
        }
    }
}

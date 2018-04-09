const MAX_SPEED: number = 65;
const E_FAST: number = 1;
const E_SLOW: number = 0.7;
const B_FAST: number = 0.7;
const B_SLOW: number = 0.4;

export class VirtualPlayerDifficulty {
    public constructor() {}

    public get defaultSpeed(): number {
        return 0;
    }

    public get cornerSpeed(): number {
        return 0;
    }

    public get isExperimented(): boolean {
        return false;
    }
}

export class ExpertVirtualPlayer extends VirtualPlayerDifficulty {
    public constructor() { super(); }

    public get defaultSpeed(): number {
        return MAX_SPEED * E_FAST;
    }

    public get cornerSpeed(): number {
        return MAX_SPEED * E_SLOW;
    }

    public get isExperimented(): boolean {
        return true;
    }
}
// tslint:disable:max-classes-per-file
export class BeginnerVirtualPlayer extends VirtualPlayerDifficulty {
    public constructor() { super(); }

    public get defaultSpeed(): number {
        return MAX_SPEED * B_FAST;
    }

    public get cornerSpeed(): number {
        return MAX_SPEED * B_SLOW;
    }

    public get isExperimented(): boolean {
        return false;
    }
}

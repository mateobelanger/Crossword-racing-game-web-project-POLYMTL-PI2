const MAX_SPEED: number = 65;
const E_FAST: number = 1;
const E_SLOW: number = 0.7;
const B_FAST: number = 0.7;
const B_SLOW: number = 0.4;

export interface VirtualPlayerDifficulty {
    defaultSpeed(): number;
    cornerSpeed(): number;
    isExperimented(): boolean;
}

export class ExpertVirtualPlayer implements VirtualPlayerDifficulty {
    public constructor() {}

    public defaultSpeed(): number {
        return MAX_SPEED * E_FAST;
    }

    public cornerSpeed(): number {
        return MAX_SPEED * E_SLOW;
    }

    public isExperimented(): boolean {
        return true;
    }
}

export class BeginnerVirtualPlayer implements VirtualPlayerDifficulty {
    public constructor() {}

    public defaultSpeed(): number {
        return MAX_SPEED * B_FAST;
    }

    public cornerSpeed(): number {
        return MAX_SPEED * B_SLOW;
    }

    public isExperimented(): boolean {
        return false;
    }
}

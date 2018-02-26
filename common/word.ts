
export enum Direction {
    HORIZONTAL,
    VERTICAL
}

export interface Word {
    row: number;
    column: number;
    direction: Direction;
    size: number;

    value: string;
    definition: string;
}

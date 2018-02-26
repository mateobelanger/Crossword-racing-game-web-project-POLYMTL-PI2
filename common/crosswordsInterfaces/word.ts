export enum Direction {VERTICAL,HORIZONTAL};

export interface IWord {
    value: string;
    definition: string;
}

export interface Word {
    row: number;
    column: number;
    direction: Direction;
    size: number;

    value: string;
    definition: string;
}

export class GridWord implements IWord {
    public value: string;
    public definition: string;
    public row: number;
    public column: number;
    public direction: Direction;

    constructor(row: number, column: number, direction: Direction, 
                value: string, definition: string = "") {
        this.row = row;
        this.column = column
        this.direction = direction;
        this.value = value;
        this.definition = definition;
    }
}

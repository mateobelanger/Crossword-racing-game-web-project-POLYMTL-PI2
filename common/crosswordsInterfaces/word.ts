export enum Direction { VERTICAL, HORIZONTAL }

export interface IWord {
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
        this.column = column;
        this.direction = direction;
        this.value = value;
        this.definition = definition;
    }

    public includesCell(row: number, column: number): boolean {
        return this.direction === Direction.HORIZONTAL?
                    row === this.row && column >= this.column && column < this.column + this.value.length :
                    column === this.column && row >= this.row && row < this.row + this.value.length;
    }

    public get size(): number {
        return this.value.length;
    }
}

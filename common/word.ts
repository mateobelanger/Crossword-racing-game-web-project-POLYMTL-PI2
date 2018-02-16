
export interface Word {
    row: number;
    column: number;
    direction: string;
    size: number;

    value: string;
    definition: string;

    constructor ();
}

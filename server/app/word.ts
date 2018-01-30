
const COMMON_LIMIT: number = 10;

export class Word {

    private name: String;
    private frequency: String;
    private definitions: String[];
    // length : number;
    // indexOfDefinition : number;

    constructor (name: String, frequency: String, definitions: String[]) {

        this.name = name;
        this.frequency = frequency;
        this.definitions = definitions;

    }

    public isCommon(): boolean {
        return Number(this.frequency.toString().substring(2)) > COMMON_LIMIT ;
    }

}

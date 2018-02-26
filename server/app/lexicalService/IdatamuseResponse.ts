export interface IDatamuseResponse {
    word: string;
    score: number;
    tags: Array<string>;
    defs: Array<string>;
}

const COMMON_LIMIT: number = 10;
const FREQUENCY_INDEX: number = 2;
const QUOTATION_MARKS_ASCII_CODE: number = 34;

export class DatamuseResponse implements IDatamuseResponse {
    public word: string;
    public score: number;
    public tags: Array<string>;
    public defs: Array<string>;

    constructor(data: IDatamuseResponse) {
        this.word = data.word;
        this.score = data.score;
        this.tags = data.tags;
        this.defs = data.defs;
    }

    public isCommon(): boolean {
        return Number(this.tags[0].substring(FREQUENCY_INDEX)) > COMMON_LIMIT ;
    }

    public findDefinitionIndex(isEasy: boolean): number {
        if (this.defs == null) {
            return -1;
        } else {
            return this.establishDefinitionIndex(isEasy);
        }
    }

    private establishDefinitionIndex(isEasy: boolean): number {
        let isFirstValidDefinition: boolean = true;
        let definitionIndex: number = -1;

        for (let i: number = 0; i < this.defs.length; i++) {
            if (!this.isNounOrVerb(i) || this.currentDefinitionContainsWordItself(i)
                || this.currentDefinitionContainsExemple(i)) {
                continue;
            }
            if (isEasy) {
                    definitionIndex = i;
                    break;
            } else if (isFirstValidDefinition ) {
                    isFirstValidDefinition = false;
            } else {
                definitionIndex = i;
                break;
            }
        }

        return definitionIndex;
    }

    private isNounOrVerb(definitionIndex: number): boolean {
        return this.defs[definitionIndex].substr(0, 1) === "n" ||
               this.defs[definitionIndex].substr(0, 1) === "v";
    }

    private currentDefinitionContainsWordItself(definitionIndex: number): boolean {
        return this.defs[definitionIndex].includes(this.word);
    }

    private currentDefinitionContainsExemple(definitionIndex: number): boolean {
        return this.defs[definitionIndex].includes(String.fromCharCode(QUOTATION_MARKS_ASCII_CODE));

    }

    public isValidWithTemplate (template: string): boolean {
        if (template.length !== this.word.length) {
            return false;
        }
        for (let i: number = 0; i < template.length; i++) {
            // can only contain letters
            if (this.word.charCodeAt(i) > "a".charCodeAt(0) ||
                this.word.charCodeAt(i) < "z".charCodeAt(0)) {
                return false;
            }
            if (template[i] !== "?" && template[i] !== this.word[i]) {
                return false;
            }
        }

        return true;
    }
}

const COMMON_LIMIT: number = 10;
const FREQUENCY_INDEX: number = 2;
const QUOTATION_MARKS_ASCII_CODE: number = 34;
const CHAR_A: number = 97;
const CHAR_Z: number = 122;

export class DictionaryEntry {

    private name: string;
    private frequency: string;
    private definitions: string[];
    private definitionIndex: number;

    public constructor (name: string, frequency: string, definitions: string[]) {
        this.name = name;
        this.frequency = frequency;
        this.definitionIndex = -1;
        this.definitions = definitions;
    }

    public getName(): string {
        return this.name;
    }

    public getDefinitions(): string[] {

        return this.definitions;
    }

    public getDefinitionIndex(): number {

        return this.definitionIndex;
    }

    public isCommon(): boolean {

        return Number(this.frequency.toString().substring(FREQUENCY_INDEX)) > COMMON_LIMIT ;
    }

    public hasValidDefinition(isEasy: boolean): boolean {
        if (this.definitions == null) {
            this.definitionIndex = -1;

            return false;
        } else {
            this.establishDefinitionIndex(isEasy);
        }

        return this.definitionIndex !== -1;
    }

    private establishDefinitionIndex(isEasy: boolean): void {
        let isFirstValidDefinition: boolean = true;

        for (let i: number = 0; i < this.definitions.length; i++) {
            if (!this.isNounOrVerb(i) || this.currentDefinitionContainsWordItself(i)
                || this.currentDefinitionContainsExemple(i)) {
                continue;
            }
            if (isEasy) {
                    this.definitionIndex = i;
                    break;
            } else if (isFirstValidDefinition ) {
                    isFirstValidDefinition = false;
            } else {
                this.definitionIndex = i;
                break;
            }
        }
    }

    private isNounOrVerb(definitionIndex: number): boolean {

        return this.definitions[definitionIndex].substr(0, 1) === "n" ||
               this.definitions[definitionIndex].substr(0, 1) === "v";
    }

    private currentDefinitionContainsWordItself(definitionIndex: number): boolean {

        return this.definitions[definitionIndex].includes(this.name.toString());
    }

    private currentDefinitionContainsExemple(definitionIndex: number): boolean {
        return this.definitions[definitionIndex].includes(String.fromCharCode(QUOTATION_MARKS_ASCII_CODE));

    }

    public isValidWithTemplate (template: string): boolean {
        if (template.length !== this.name.length) {
            return false;
        }
        for (let i: number = 0; i < template.length; i++) {
            // can only contain letters
            if (this.name.charCodeAt(i) < CHAR_A && this.name.charCodeAt(i) > CHAR_Z) {
                return false;
            }
            if (template[i] !== "?" && template[i] !== this.name[i]) {
                return false;
            }
        }

        return true;
    }
}

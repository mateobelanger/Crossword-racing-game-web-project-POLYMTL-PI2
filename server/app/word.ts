const COMMON_LIMIT: number = 10;
const FREQUENCY_INDEX: number = 2;
const QUOTATION_MARKS_ASCII_CODE: number = 34;

export class Word {

    // TODO remettre prive
    public name: String;
    private frequency: String;
    public definitions: String[];
    public definitionIndex: number;

    public constructor (name: String, frequency: String, definitions: String[]) {

        this.name = name;
        this.frequency = frequency;
        this.definitionIndex = -1;
        this.definitions = definitions;

    }

    public isCommon(): boolean {
        return Number(this.frequency.toString().substring(FREQUENCY_INDEX)) > COMMON_LIMIT ;
    }

    public hasDefinitions(): boolean {
        return this.definitions != null;
    }

    public establishDefinitionIndex( isEasy: boolean): number {
        let isFirstValidDefinition: boolean = true;

        for (let i: number = 0; i < this.definitions.length; i++) {
            if (!this.isNounOrVerb(i) || this.currentDefinitionContainsWordItself(i)) {
                continue;
            } else if (isEasy) {
                    this.definitionIndex = i;
                    break;
            } else if (isFirstValidDefinition ) {
                    isFirstValidDefinition = false;
            } else {
                this.definitionIndex = i;
                break;
            }
        }

        return this.definitionIndex;
    }
    // Ou l'appeler?
    private removeExampleFromDefinition(): void {
        const indexOfQuotationMarks: number = this.definitions[this.definitionIndex].indexOf(String.fromCharCode(QUOTATION_MARKS_ASCII_CODE));
        if (indexOfQuotationMarks !== -1) {     // -1.. n'enlevera pas la , mais si juste exemple.. quoi faire?
            this.definitions[this.definitionIndex] = this.definitions[this.definitionIndex].substring(0, indexOfQuotationMarks - 1);
        }

    }

    private isNounOrVerb( definitionIndex: number): boolean {
        return this.definitions[definitionIndex].substr(0, 1) === "n" || this.definitions[definitionIndex].substr(0, 1) === "v";
    }

    private currentDefinitionContainsWordItself( definitionIndex: number): boolean {
        return this.definitions[definitionIndex].includes(this.name.toString());
    }

}

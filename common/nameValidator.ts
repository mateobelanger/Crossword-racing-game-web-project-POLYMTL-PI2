const UPPERCASE_A: number = 65;
const UPPERCASE_Z: number = 90;
const LOWERCASE_A: number = 97;
const LOWERCASE_Z: number = 122;
const CHAR_SPACE: number = 32;
const CHAR_0: number = 48;
const CHAR_9: number = 57;

const SPACE: string = " ";

export class NameValidator {

    public static isValidName(name: string): boolean {
        let containsOnlySpaces: boolean = true;
        let containsOnlyAlphaNumericalChars: boolean = true;

        for (const char of name) {
            if (char !== SPACE) {
                containsOnlySpaces = false;
            }
            if (!NameValidator.isAlphaNumerical(char.charCodeAt(0))) {
                containsOnlyAlphaNumericalChars = false;
                break;
            }
        }

        return name.length > 0 && !containsOnlySpaces && containsOnlyAlphaNumericalChars;
    }


    // TODO : demander a Mathieu pour QA
    public static isAlphaNumerical (keyCode: number): boolean {
        return (keyCode >= UPPERCASE_A && keyCode <= UPPERCASE_Z) ||
               (keyCode >= LOWERCASE_A && keyCode <= LOWERCASE_Z) ||
               (keyCode >= CHAR_0 && keyCode <= CHAR_9) ||
               keyCode === CHAR_SPACE;
    }
}

import { Injectable } from "@angular/core";
import { GridWord } from "../../../../../common/crosswordsInterfaces/word";

@Injectable()
export class SelectionStateService {

    public localSelectedWord: GridWord;
    public remoteSelectedWord: GridWord;

    public constructor() {
        this.localSelectedWord = null;
        this.remoteSelectedWord = null;
    }

    public unselectWords(): void {
        this.localSelectedWord = null;
        this.remoteSelectedWord = null;
    }

}

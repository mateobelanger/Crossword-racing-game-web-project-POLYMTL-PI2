import { Injectable } from "@angular/core";
import { GridWord } from "../../../../../common/crosswordsInterfaces/word";
import { WordService } from "../word.service";
import { SocketService } from "../socket.service";
import { SelectionStateService } from "../selection-state/selection-state.service";

@Injectable()
export class SelectionService {

    public constructor(private wordService: WordService,
                       private socketService: SocketService,
                       private selectionState: SelectionStateService) {}

    public get selectedWord(): GridWord {
        return this.selectionState.localSelectedWord;
    }

    public get definition(): string {
        if (this.selectionState.localSelectedWord === null) {
            return null;
        }

        return this.selectionState.localSelectedWord.definition;
    }

    public set definition(definition: string) {
        for (const word of this.wordService.words) {
            if (word.definition === definition) {
                this.selectionState.localSelectedWord = word;
                this.socketService.selectWord(this.selectionState.localSelectedWord);
                break;
            }
        }
    }

    public selectWord(row: number, column: number): void {
        for (const word of this.wordService.words) {
            if (word === this.selectionState.localSelectedWord) {
                continue;
            }
            if (word.includesCell(row, column)) {
                this.selectionState.localSelectedWord = word;
                this.socketService.selectWord(this.selectionState.localSelectedWord);
                break;
            }
        }
    }

    public deselect(): void {
        this.socketService.deselectWord(this.selectionState.localSelectedWord);
        if (this.selectionState.remoteSelectedWord !== null &&
                this.selectionState.localSelectedWord.value === this.selectionState.remoteSelectedWord.value) {
            this.selectionState.remoteSelectedWord = null;
        }
        this.selectionState.localSelectedWord = null;

    }

    public get hostSelectedWord(): GridWord {
        if (this.socketService.isHost) {
            return this.selectionState.localSelectedWord;
        } else {
            return this.selectionState.remoteSelectedWord;
        }
    }

    public get guestSelectedWord(): GridWord {
        if (!this.socketService.isHost) {
            return this.selectionState.localSelectedWord;
        } else {
            return this.selectionState.remoteSelectedWord;
        }
    }
}

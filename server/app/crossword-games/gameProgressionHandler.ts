import { CrosswordGame } from "../../../common/crosswordsInterfaces/crosswordGame";
import { GridWord } from "../../../common/crosswordsInterfaces/word";

export class GameProgessionHandler {

    public static isAddValidatedWord(word: GridWord, game: CrosswordGame, socketId: string): boolean {
        const isNewValidatedWord: boolean = !this.includesWord(word, game);
        if (isNewValidatedWord) {
            this.addValidatedWord(socketId, game, word);
            // this.socketServer.in(game.roomId).emit(SocketMessage.UPDATE_VALIDATED_WORD, game);
        }

        return isNewValidatedWord;
    }

    private static includesWord(wordToFind: GridWord, game: CrosswordGame): boolean {
        for (const word of game.hostValidatedWords) {
            if (word.value === wordToFind.value) {
                return true;
            }
        }
        for (const word of game.guestValidatedWords) {
            if (word.value === wordToFind.value) {
                return true;
            }
        }

        return false;
    }

    private static addValidatedWord(socketId: string, game: CrosswordGame, word: GridWord): void {
        if (socketId === game.hostId) {
            game.hostValidatedWords.push(word);
        } else {
            game.guestValidatedWords.push(word);
        }
    }

}

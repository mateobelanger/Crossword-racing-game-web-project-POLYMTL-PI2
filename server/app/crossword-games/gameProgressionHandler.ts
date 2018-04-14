import { GameConfiguration } from "../../../common/crosswordsInterfaces/gameConfiguration";
import { GridWord } from "../../../common/crosswordsInterfaces/word";

export class GameProgessionHandler {

    // constructor() { }

    // public selectWord(game: GameConfiguration, socket: SocketIO.Socket, selectedWord: GridWord): void {

    //     socket.to(game.roomId).emit(SocketMessage.REMOTE_SELECTED_WORD, selectedWord);
    // }

    // public deselectWord(game: GameConfiguration, socket: SocketIO.Socket, word: GridWord): void {

    //     socket.to(game.roomId).emit(SocketMessage.REMOTE_DESELECTED_WORD, word);
    // }

    public isAddValidatedWord(word: GridWord, game: GameConfiguration, socketId: string): boolean {
        const isNewValidatedWord: boolean = !this.includesWord(word, game);
        if (isNewValidatedWord) {
            this.addValidatedWord(socketId, game, word);
            // this.socketServer.in(game.roomId).emit(SocketMessage.UPDATE_VALIDATED_WORD, game);
        }

        return isNewValidatedWord;
    }

    public includesWord(wordToFind: GridWord, game: GameConfiguration): boolean {
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

    private addValidatedWord(socketId: string, game: GameConfiguration, word: GridWord): void {
        if (socketId === game.hostId) {
            game.hostValidatedWords.push(word);
        } else {
            game.guestValidatedWords.push(word);
        }
    }

}

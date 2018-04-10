// import * as http from "http";
// import { injectable } from "inversify";
// import * as SocketIo from "socket.io";
import { GameConfiguration } from "../../../common/crosswordsInterfaces/gameConfiguration";
import { /*Difficulty,*/ SocketMessage } from "../../../common/constants";
import { GridWord } from "../../../common/crosswordsInterfaces/word";

// enum GameType { SOLO, MULTIPLAYER, PENDING }

export class GameProgessionHandler {

    // constructor() { }

    public selectWord(game: GameConfiguration, socket: SocketIO.Socket, selectedWord: GridWord): void {

        socket.to(game.roomId).emit(SocketMessage.REMOTE_SELECTED_WORD, selectedWord);
    }

    public deselectWord(game: GameConfiguration, socket: SocketIO.Socket, word: GridWord): void {

        socket.to(game.roomId).emit(SocketMessage.REMOTE_DESELECTED_WORD, word);
    }

    public isAddValidatedWord(word: GridWord, game: GameConfiguration, socket: SocketIO.Socket): boolean {
        const isNewValidatedWord: boolean = !this.includesWord(word, game);
        if (isNewValidatedWord) {
            this.addValidatedWord(socket, game, word);
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

    private addValidatedWord(socket: SocketIO.Socket, game: GameConfiguration, word: GridWord): void {
        if (socket.id === game.hostId) {
            game.hostValidatedWords.push(word);
        } else {
            game.guestValidatedWords.push(word);
        }
    }

}

import * as http from "http";
// import { injectable } from "inversify";
import * as SocketIo from "socket.io";
import { GameConfiguration } from "../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty } from "../../common/constants";
import { GridWord } from "../../common/crosswordsInterfaces/word";

// @injectable()
export class Io {

    private socketServer: SocketIO.Server;
    // private rooms: number[];
    private _games: GameConfiguration[] = [];

    constructor(server: http.Server) {
        // this.rooms = [];
        this.socketServer = SocketIo(server);

        this.socketServer.on("connection", (socket: SocketIO.Socket) => {
            console.log("nouvelle connection");

            socket.on("createGame", (username: string, difficulty: Difficulty, words: GridWord[]) => {
                this.createGame(socket.id, username, difficulty, words);
            });

            socket.on("getGameLobbies", () => {
                this.socketServer.to(socket.id).emit("gameLobbies", this._games);
            });

            socket.on("joinGame", (roomId: string) => {
                socket.join(roomId);
                this.socketServer.to(socket.id).emit("gridFromJoin", this.getGameByRoomId(roomId));
            });

            socket.on("addValidatedWord", (word: GridWord, roomId: string) => {
                this.addValidatedWord(word, roomId, socket);
                this.socketServer.in(roomId).emit("updateValidatedWord", this.getGameByRoomId(roomId));
            });

            socket.on("selectWord", (game: GameConfiguration, selectedWord: GridWord) => {
                this.socketServer.to(game.roomId).emit("remoteSelectedWord", selectedWord);
            });
        });

    }

    private createGame(id: string, username: string, difficulty: Difficulty, words: GridWord[]): void {
        const newGame: GameConfiguration = new GameConfiguration(id, username, difficulty, this.castHttpToGridWord(words));
        this._games.push(newGame);
        this.socketServer.to(id).emit("initializeGame", newGame);
    }

    private getGameByRoomId(id: string): GameConfiguration {
        return this._games.find((game: GameConfiguration) => game.roomId === id);
    }

    private addValidatedWord(word: GridWord, roomId: string, socket: SocketIO.Socket): void {
        if (!this.includesWord(word, this.getGameByRoomId(roomId))) {
            if (socket.id === roomId) {
                this.getGameByRoomId(roomId).hostValidatedWords.push(word);
            } else {
                this.getGameByRoomId(roomId).guestValidatedwords.push(word);
            }
        }
    }

    private includesWord(wordToFind: GridWord, game: GameConfiguration): boolean {
        for (const word of game.hostValidatedWords) {
            if (word.value === wordToFind.value) {
                return true;
            }
        }
        for (const word of game.guestValidatedwords) {
            if (word.value === wordToFind.value) {
                return true;
            }
        }

        return false;
    }

    private castHttpToGridWord(httpWords: GridWord[]): GridWord[] {
        const words: GridWord[] = [];
        for (const word of httpWords) {
            words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        }

        return words;
    }
}

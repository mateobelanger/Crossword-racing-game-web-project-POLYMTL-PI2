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

            socket.on("addedValidatedWord", (game: GameConfiguration) => {
                this.addValidatedWord(game);
                this.socketServer.in(game.roomId).emit("updateValidatedWord", game);
            });

            socket.on("selectWord", (game: GameConfiguration, selectedWord: GridWord) => {
                this.socketServer.to(game.roomId).emit("remoteSelectedWord", selectedWord);
            });
        });

    }

    private createGame(id: string, username: string, difficulty: Difficulty, words: GridWord[]): void {
        const newGame: GameConfiguration = new GameConfiguration(id, username, difficulty, words);
        this._games.push(newGame);
        this.socketServer.to(id).emit("initializeGame", newGame);
    }

    private getGameByRoomId(id: string): GameConfiguration {
        return this._games.find((game: GameConfiguration) => game.roomId === id);
    }

    private addValidatedWord(gameRoom: GameConfiguration): void {
        this.getGameByRoomId(gameRoom.roomId).guestValidatedwords = gameRoom.guestValidatedwords;
        this.getGameByRoomId(gameRoom.roomId).hostValidatedWords = gameRoom.hostValidatedWords;
    }
}

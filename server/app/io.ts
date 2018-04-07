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

            // ne fonctionne pas
            socket.on("joinGame", (roomId: string) => {
                socket.join("roomId");
                this.socketServer.to(socket.id).emit("gridFromJoin", this.getGameByRoomId(roomId));
            });

            socket.on("addValidatedWord", (word: GridWord, game: GameConfiguration) => {
                this.addValidatedWord(word, game, socket);
                this.socketServer.in(game.roomId).emit("updateValidatedWord", game);
            });
        });

    }

    private createGame(id: string, username: string, difficulty: Difficulty, words: GridWord[]): void {
        this._games.push(new GameConfiguration(id, username, difficulty, words));
    }

    private getGameByRoomId(id: string): GameConfiguration {
        return this._games.find((game: GameConfiguration) => game.roomId === id);
    }

    private addValidatedWord(word: GridWord, gameRoom: GameConfiguration, socket: SocketIO.Socket): void {
        if (socket.id === gameRoom.roomId) {
            gameRoom.hostValidatedWords.push(word);
        } else {
            gameRoom.guestValidatedwords.push(word);
        }
    }
}

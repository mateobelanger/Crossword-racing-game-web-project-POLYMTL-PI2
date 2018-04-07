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
    private _ongoingGames: GameConfiguration[] = [];
    private _waitingGames: GameConfiguration[] = [];

    constructor(server: http.Server) {
        // this.rooms = [];
        this.socketServer = SocketIo(server);

        this.socketServer.on("connection", (socket: SocketIO.Socket) => {
            console.log("nouvelle connection");

            socket.on("createGame", (username: string, difficulty: Difficulty, words: GridWord[]) => {
                this.createGame(socket.id, username, difficulty, words);
                socket.broadcast.emit("newGameCreated", this._waitingGames);
            });

            socket.on("getGameLobbies", () => {
                this.socketServer.to(socket.id).emit("gameLobbies", this._waitingGames, this._ongoingGames);
            });

            socket.on("joinGame", (roomId: string) => {
                socket.join("roomId");
                // TODO: mettre dans fonction ??
                this._ongoingGames.push(this.getGameByRoomId(this._waitingGames, roomId));
                this.deleteGameById(this._waitingGames, roomId);

                this.socketServer.to(socket.id).emit("gridFromJoin", this.getGameByRoomId(this._ongoingGames, roomId) );
            });

            // ne fonctionne pas
            // socket.on("updateGrids", (words: GridWord[]) => {
            //     console.log("update grids"); console.log(words);
            //     this.getGame(socket.id).words = words;
            //     this.socketServer.in(socket.id).emit("grid", this.getGame(socket.id)._words);
            // });
        });

    }

    private createGame(id: string, username: string, difficulty: Difficulty, words: GridWord[]): void {
        this._waitingGames.push(new GameConfiguration(id, username, difficulty, words));
    }

    private getGameByRoomId(games: GameConfiguration[], id: string): GameConfiguration {
        return games.find((game: GameConfiguration) => game.roomId === id);
    }

    // ordre des parametres?
    private deleteGameById(games: GameConfiguration[], id: string): void {
        games.splice(games.findIndex((game: GameConfiguration) => game.roomId === id));
    }
}

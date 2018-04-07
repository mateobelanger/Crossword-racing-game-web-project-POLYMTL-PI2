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
                this._ongoingGames.push(this.getGameByRoomId(this._waitingGames, roomId, true));
                this.deleteGameById(this._waitingGames, roomId, true);
                this.getGameByRoomId(this._ongoingGames, roomId, true).guestId = socket.id;

                this.socketServer.to(socket.id).emit("gridFromJoin", this.getGameByRoomId(this._ongoingGames, roomId, true));
            });

            socket.on("disconnect", () => {
                console.log("got disconnected");
                this.socketServer.to(this.getGameByRoomId(this._ongoingGames, socket.id, false).roomId).emit("disconnected");
                this.socketServer.to(this.getGameByRoomId(this._ongoingGames, socket.id, false).guestId).emit("disconnected");
            });
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

    private getGameByRoomId(games: GameConfiguration[], id: string, isHostId: boolean): GameConfiguration {
        return isHostId ? games.find((game: GameConfiguration) => game.roomId === id) :
            games.find((game: GameConfiguration) => game.guestId === id);
    }

    // ordre des parametres?
    private deleteGameById(games: GameConfiguration[], id: string, isHostId: boolean): void {
        isHostId ? games.splice(games.findIndex((game: GameConfiguration) => game.roomId === id)) :
            games.splice(games.findIndex((game: GameConfiguration) => game.guestId === id));
    }
}

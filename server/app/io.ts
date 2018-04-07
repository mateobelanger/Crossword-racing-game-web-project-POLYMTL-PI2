import * as http from "http";
// import { injectable } from "inversify";
import * as SocketIo from "socket.io";
import { GameConfiguration } from "../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty } from "../../common/constants";
import { GridWord } from "../../common/crosswordsInterfaces/word";

// @injectable()
export class Io {

    private socketServer: SocketIO.Server;
    private _ongoingGames: GameConfiguration[] = [];
    private _waitingGames: GameConfiguration[] = [];

    // tslint:disable-next-line:max-func-body-length
    constructor(server: http.Server) {
        this.socketServer = SocketIo(server);
        // tslint:disable-next-line:max-func-body-length
        this.socketServer.on("connection", (socket: SocketIO.Socket) => {

            socket.on("createGame", (username: string, difficulty: Difficulty, words: GridWord[]) => {
                this.createGame(socket.id, username, difficulty, words);
                socket.broadcast.emit("gameLobbies", this._waitingGames);
            });

            socket.on("getGameLobbies", () => {
                this.socketServer.to(socket.id).emit("gameLobbies", this._waitingGames, this._ongoingGames);
            });

            socket.on("joinGame", (roomId: string) => {
                socket.join("roomId");
                // TODO: mettre dans fonction ??
                this._ongoingGames.push(this.getGameByRoomId(this._waitingGames, roomId));
                this.deleteGameById(this._waitingGames, roomId);
                this.getGameByRoomId(this._ongoingGames, roomId).guestId = socket.id;
                this.socketServer.to(socket.id).emit("gridFromJoin", this.getGameByRoomId(this._ongoingGames, roomId));
            });

            socket.on("disconnect", () => {
                console.log("got disconnected");
                let game: GameConfiguration;
                try {
                    game = this.getGameByRoomId(this._ongoingGames, socket.id);
                    game.isHost(socket.id) ? this.socketServer.to(game.guestId).emit("disconnected") :
                    this.socketServer.to(game.roomId).emit("disconnected");
                    this.deleteGameById(this._ongoingGames, socket.id);
                } catch (error) {
                    game = this.getGameByRoomId(this._waitingGames, socket.id);
                    this.deleteGameById(this._waitingGames, socket.id);
                }
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

    private getGameByRoomId(games: GameConfiguration[], id: string): GameConfiguration {
        if (games.find((game: GameConfiguration) => game.isInGame(id) !== undefined)) {
            throw Error("no game");
        } else {
            return games.find((game: GameConfiguration) => game.isInGame(id) !== undefined);
        }
    }

    // ordre des parametres ?????????????????????????
    private deleteGameById(games: GameConfiguration[], id: string): void {
        games.splice(games.findIndex((game: GameConfiguration) => game.isInGame(id)));
    }
}

import * as http from "http";
// import { injectable } from "inversify";
import * as SocketIo from "socket.io";
import { GameConfiguration } from "../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty } from "../../common/constants";

// @injectable()
export class Io {

    private socketServer: SocketIO.Server;
    // private rooms: number[];
    private _games: GameConfiguration[] = [];

    constructor(server: http.Server) {
        // this.rooms = [];
        // server.listen(this.appPort);
        this.socketServer = SocketIo(server);

        this.socketServer.on("connection", (socket: SocketIO.Socket) => {
            console.log("nouvelle connection");

            socket.on("createGame", (username: string, difficulty: Difficulty) => {
                console.log("nouvelle game");
                this.createGame(socket.id, username, difficulty);
                this.socketServer.emit("newGameCreated", this._games[this._games.length - 1]);
            });

            socket.on("join", () => { console.log("wouhou"); });

            socket.on("getGameLobbies", () => {
                console.log("getGames");
                this.socketServer.to(socket.id).emit("gameLobbies", this._games);
            });
        });

    }

    private createGame(id: string, username: string, difficulty: Difficulty): void {
        this._games.push(new GameConfiguration(id, username, difficulty));
    }
}

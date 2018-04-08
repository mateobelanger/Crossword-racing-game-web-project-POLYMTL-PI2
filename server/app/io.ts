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
    private guestSocketId: string = "";
    private hostSocketId: string = "";

    // tslint:disable-next-line:max-func-body-length
    constructor(server: http.Server) {
        this.socketServer = SocketIo(server);
        // tslint:disable-next-line:max-func-body-length
        this.socketServer.on("connection", (socket: SocketIO.Socket) => {

            socket.on("createGame", (username: string, difficulty: Difficulty, words: GridWord[]) => {
                this.hostSocketId = socket.id;
                this.createGame(socket.id, username, difficulty, words);
                if (!this.isAlreadyInAGame(socket.id)) {
                    this.createGame(socket.id, username, difficulty, words);
                    socket.broadcast.emit("gameLobbies", this._waitingGames);
                }
            });

            socket.on("getGameLobbies", () => {
                this.socketServer.to(socket.id).emit("gameLobbies", this._waitingGames, this._ongoingGames);
            });

            socket.on("joinGame", (roomId: string) => {
                this.guestSocketId = socket.id;
                if (!this.isAlreadyInAGame(socket.id)) {
                    try {
                        socket.join(roomId);
                        // TODO: mettre dans fonction ??
                        this._ongoingGames.push(this.getGameByRoomId(this._waitingGames, roomId));
                        this.deleteGameById(this._waitingGames, roomId);
                        this.getGameByRoomId(this._ongoingGames, roomId).guestId = socket.id;
                        this.socketServer.to(socket.id).emit("gridFromJoin", this.getGameByRoomId(this._ongoingGames, roomId));
                    } catch (error) {
                        return;
                    }
                }
            });

            socket.on("addValidatedWord", (word: GridWord, roomId: string) => {
                this.addValidatedWord(word, roomId, socket);
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
            socket.on("selectWord", (selectedWord: GridWord) => {
                const socketId: string = socket.id === this.guestSocketId ?  this.hostSocketId : this.guestSocketId;
                this.socketServer.to(socketId).emit("remoteSelectedWord", selectedWord);
            });
        });

    }

    private createGame(id: string, username: string, difficulty: Difficulty, words: GridWord[]): void {
        const newGame: GameConfiguration = new GameConfiguration(id, username, difficulty, this.castHttpToGridWord(words));
        this.socketServer.to(id).emit("initializeGame", newGame);
        this._waitingGames.push(newGame);
    }

    private getGameByRoomId(games: GameConfiguration[], id: string): GameConfiguration {
       /* if (games.find((game: GameConfiguration) => game.isInGame(id)) === undefined) {
            // throw Error("no game");
        } else {*/
            return games.find((game: GameConfiguration) => game.isInGame(id));
        // }
    }

    // ordre des parametres ?????????????????????????
    private deleteGameById(games: GameConfiguration[], id: string): void {
        games.splice(games.findIndex((game: GameConfiguration) => game.isInGame(id)));
    }

    private isAlreadyInAGame(id: string): boolean {
        let isInAGame: boolean = false;
        this._ongoingGames.forEach( (game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });
        this._waitingGames.forEach( (game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });

        return isInAGame;
    }

    private addValidatedWord(word: GridWord, roomId: string, socket: SocketIO.Socket): void {
        if (!this.includesWord(word, this.getGameByRoomId(this._ongoingGames, roomId))) {
            if (socket.id === roomId) {
                this.getGameByRoomId(this._ongoingGames, roomId).hostValidatedWords.push(word);
            } else {
                this.getGameByRoomId(this._ongoingGames, roomId).guestValidatedwords.push(word);
            }
            this.socketServer.in(roomId).emit("updateValidatedWord", this.getGameByRoomId(this._ongoingGames, roomId));
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

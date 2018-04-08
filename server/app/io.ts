import * as http from "http";
// import { injectable } from "inversify";
import * as SocketIo from "socket.io";
import { GameConfiguration } from "../../common/crosswordsInterfaces/gameConfiguration";
import { Difficulty } from "../../common/constants";
import { GridWord } from "../../common/crosswordsInterfaces/word";

enum GameType { SOLO, WAITING, ONGOING }

// @injectable()
export class Io {

    private socketServer: SocketIO.Server;
    private _soloGames: GameConfiguration[] = [];
    private _ongoingGames: GameConfiguration[] = [];
    private _waitingGames: GameConfiguration[] = [];

    // tslint:disable-next-line:max-func-body-length
    constructor(server: http.Server) {
        this.socketServer = SocketIo(server);
        // tslint:disable-next-line:max-func-body-length
        this.socketServer.on("connection", (socket: SocketIO.Socket) => {

            socket.on("createGame", (username: string, difficulty: Difficulty, words: GridWord[]) => {

                const roomId: string = "game" + (this._soloGames.length + this._ongoingGames.length + this._waitingGames.length).toString();
                socket.join(roomId);
                if (!this.isAlreadyInAGame(socket.id)) {
                    this.createGame(roomId, socket.id, username, difficulty, words);
                    socket.broadcast.emit("gameLobbies", this._waitingGames, this._ongoingGames);
                }
            });

            socket.on("create solo game", (username: string, difficulty: Difficulty, words: GridWord[]) => {

                const roomId: string = "game" + (this._soloGames.length + this._ongoingGames.length + this._waitingGames.length).toString();
                socket.join(roomId);
                if (!this.isAlreadyInAGame(socket.id)) {
                    const newGame: GameConfiguration =
                        new GameConfiguration(roomId, socket.id, username, difficulty, this.castHttpToGridWord(words));
                    this._soloGames.push(newGame);
                    socket.emit("initializeGame", newGame);
                }
            });

            socket.on("getGameLobbies", () => {
                this.socketServer.to(socket.id).emit("gameLobbies", this._waitingGames, this._ongoingGames);
            });

            socket.on("joinGame", (roomId: string) => {
                if (!this.isAlreadyInAGame(socket.id)) {
                    try {
                        socket.join(roomId);
                        // TODO: mettre dans fonction ??
                        this._ongoingGames.push(this.getGameByRoomId(this._waitingGames, roomId));
                        this.deleteGameByRoomId(this._waitingGames, roomId);
                        const joinedGame: GameConfiguration = this.getGameByRoomId(this._ongoingGames, roomId);
                        joinedGame.guestId = socket.id;

                        socket.emit("gridFromJoin", joinedGame);
                        socket.to(joinedGame.hostId).emit("initializeGame", joinedGame); // quel ID ??????????

                        socket.broadcast.emit("gameLobbies", this._waitingGames, this._ongoingGames);
                    } catch (error) {
                        return;
                    }
                }
            });

            socket.on("addValidatedWord", (word: GridWord, roomId: string) => {
                this.addValidatedWord(word, roomId, socket);
            });

            socket.on("disconnect", () => {
                if (this.isAlreadyInAGame(socket.id)) {
                    const gameType: GameType = this.getGameType(socket.id);
                    const game: GameConfiguration = this.getGameBySocketId(gameType, socket.id);

                    switch (gameType) {
                        case GameType.SOLO:
                            this.deleteGameByRoomId(this._soloGames, game.roomId);
                            break;
                        case GameType.WAITING:
                            this.deleteGameBySocketId(this._waitingGames, game.roomId);
                            break;
                        case GameType.ONGOING:
                        default:
                            if (game.isHost(socket.id)) {
                                game.hostId = game.guestId;
                            }
                            game.guestId = null;
                            this.socketServer.to(game.hostId).emit("disconnected");

                            this._soloGames.push(game);
                            this.deleteGameBySocketId(this._ongoingGames, socket.id);
                    }

                }
                console.log(this._soloGames.length);
                console.log(this._waitingGames.length);
                console.log(this._ongoingGames.length);
            });

            socket.on("selectWord", (selectedWord: GridWord) => {
                const gameType: GameType = this.getGameType(socket.id);
                const game: GameConfiguration = this.getGameBySocketId(gameType, socket.id);
                // const socketId: string = game.isHost(socket.id) ?
                //     game.guestId : game.hostId;

                socket.to(game.roomId).emit("remoteSelectedWord", selectedWord);
            });

        });

    }

    private createGame(roomId: string, hostId: string, username: string, difficulty: Difficulty, words: GridWord[]): void {
        this._waitingGames.push(new GameConfiguration(roomId, hostId, username, difficulty, this.castHttpToGridWord(words)));
    }

    private getGameBySocketId(gameType: GameType, id: string): GameConfiguration {
        let games: GameConfiguration[];
        switch (gameType) {
            case GameType.SOLO:
                games = this._soloGames;
                break;
            case GameType.WAITING:
                games = this._waitingGames;
                break;
            default:
                games = this._ongoingGames;
        }

        return games.find((game: GameConfiguration) => game.isInGame(id));
    }

    private getGameByRoomId(games: GameConfiguration[], roomId: string): GameConfiguration {
        return games.find((game: GameConfiguration) => game.roomId === roomId);
    }

    // ordre des parametres ?????????????????????????
    private deleteGameByRoomId(games: GameConfiguration[], id: string): void {
        games.splice(games.findIndex((game: GameConfiguration) => game.roomId === id));
    }

    private deleteGameBySocketId(games: GameConfiguration[], id: string): void {
        games.splice(games.findIndex((game: GameConfiguration) => game.isInGame(id)));
    }

    private isAlreadyInAGame(id: string): boolean {
        let isInAGame: boolean = false;
        this._soloGames.forEach((game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });
        this._ongoingGames.forEach((game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });
        this._waitingGames.forEach((game: GameConfiguration) => {
            if (game.isInGame(id)) {
                isInAGame = true;
            }
        });

        return isInAGame;
    }

    private addValidatedWord(word: GridWord, roomId: string, socket: SocketIO.Socket): void {
        if (!this.includesWord(word, this.getGameByRoomId(this._ongoingGames, roomId))) {
            if (socket.id === this.getGameByRoomId(this._ongoingGames, roomId).hostId) {
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

    // private getNumberOfRooms(): number {
    //     return this._soloGames.length + this._ongoingGames.length + this._waitingGames.length;
    // }

    private getGameType(socketId: string): GameType {
        if (this._soloGames.find((game: GameConfiguration) => game.isInGame(socketId)) !== undefined) {
            return GameType.SOLO;
        } else if (this._ongoingGames.find((game: GameConfiguration) => game.isInGame(socketId)) !== undefined) {
            return GameType.ONGOING;
        } else {
            return GameType.WAITING;
        }
    }

}

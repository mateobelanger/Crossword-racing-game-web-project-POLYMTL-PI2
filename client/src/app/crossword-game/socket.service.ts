import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { GameConfiguration } from '../../../../common/crosswordsInterfaces/gameConfiguration';
import { LobbyService } from './lobby/lobby.service';
import { Difficulty } from '../../../../common/constants';

@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket;

    public constructor(private lobbyService: LobbyService) {
        this.socket = io.connect("http://localhost:3000");

        this.socket.on("newGameCreated", (game: GameConfiguration) => {
            this.lobbyService.onlineGames.push(game);
        });

        this.socket.on("gameLobbies", (gameLobbies: GameConfiguration[]) => {
            this.lobbyService.onlineGames = gameLobbies;
        });
    }

    public createGame(username: string, difficulty: Difficulty): void {
        this.socket.emit("createGame", username, difficulty);
    }

    public getGameLobbies(): void {
        this.socket.emit("getGameLobbies");
    }

}

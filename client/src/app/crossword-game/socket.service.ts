import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { GameConfiguration } from "../../../../common/crosswordsInterfaces/gameConfiguration";
import { LobbyService } from "./lobby/lobby.service";
import { Difficulty } from "../../../../common/constants";
import { GridService } from "./grid.service";
import { WordService } from "./word.service";
import { ValidatorService } from "./validator.service";

import { GridWord } from "../../../../common/crosswordsInterfaces/word";

@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket;

    public constructor( private lobbyService: LobbyService, private wordService: WordService,
                        private validator: ValidatorService, private gridService: GridService ) {
        this.socket = io.connect("http://localhost:3000");

        this.socket.on("gameLobbies", (gameLobbies: GameConfiguration[]) => {
            this.lobbyService.onlineGames = gameLobbies;
        });

        this.socket.on("grid", (words: GridWord[]) => {
            this.wordService.words = words;
            console.log(this.wordService.words);
        });

    }

    public async createGame(username: string, difficulty: Difficulty): Promise<void> {
        await this.createGrid(difficulty);
        this.socket.emit("createGame", username, difficulty, this.wordService.words);
    }

    public joinGame(roomId: string): void {
        this.socket.emit("joinGame", roomId);
    }

    public getGameLobbies(): void {
        this.socket.emit("getGameLobbies");
    }

    private async createGrid(difficulty: Difficulty): Promise<void> {
        await this.wordService.initialize(difficulty)
            .then(() => {
                this.gridService.initialize();
                this.validator.initialize();
            });
    }
}

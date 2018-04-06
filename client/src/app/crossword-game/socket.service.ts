import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { GameConfiguration } from "../../../../common/crosswordsInterfaces/gameConfiguration";
import { LobbyService } from "./lobby/lobby.service";
import { Difficulty } from "../../../../common/constants";
// import { GridService } from "./grid.service";
import { WordService } from "./word.service";
// import { ValidatorService } from "./validator.service";

import { GridWord } from "../../../../common/crosswordsInterfaces/word";
import { Router } from "@angular/router";


@Injectable()
export class SocketService {

    private socket: SocketIOClient.Socket;

    public constructor( private lobbyService: LobbyService, public wordService: WordService,
                       /* public validator: ValidatorService, public gridService: GridService,*/
                        private router: Router) {
        this.socket = io.connect("http://localhost:3000");

        this.socket.on("gameLobbies", (gameLobbies: GameConfiguration[]) => {
            this.lobbyService.onlineGames = gameLobbies;
        });

        this.socket.on("gridFromJoin", (game: GameConfiguration) => {
            game._words.forEach((word) => {
                this.wordService.words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
            });
            console.log(this.wordService.words.length);
            this.router.navigate(["crossword-game/" + game.difficulty + "/ui"]);
        });

    }

    public async createGame(username: string, difficulty: Difficulty): Promise<void> {
        // console.log("try to create");
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
        await this.wordService.initialize(difficulty);
        // .then(() => {
        //     this.gridService.initialize();
        //     this.validator.initialize();
        // });
        this.router.navigate(["crossword-game/" + difficulty + "/ui"]);
    }
}

import { Component, OnInit } from '@angular/core';
import { ConfigurationHandlerService } from '../configuration-handler.service';
import { Difficulty } from '../../../../../common/constants';
import * as io from "socket.io-client";

@Component({
    selector: 'app-create-lobby',
    templateUrl: './create-lobby.component.html',
    styleUrls: ['./create-lobby.component.css']
})
export class CreateLobbyComponent implements OnInit {

    private socket: SocketIOClient.Socket;

    public constructor(private configurationHandlerService: ConfigurationHandlerService) {
        this.configurationHandlerService.difficulty = null;
        this.socket = io.connect("http://localhost:3000");
    }

    public ngOnInit(): void {
        this.configurationHandlerService.isMultiplayer = true;
    }

    public get difficulty(): Difficulty {
        return this.configurationHandlerService.difficulty;
    }

    public isValidConfiguration(): boolean {
        return this.configurationHandlerService.difficulty && this.isValidUsername(this.configurationHandlerService.username);
    }

    public isValidUsername(username: String): boolean {
      return (username.length > 0);
    }

    public createGame(username: string): void {
        this.socket.emit("connect", username);
    }

}

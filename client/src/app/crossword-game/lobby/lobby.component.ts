import { Component, OnInit } from '@angular/core';
import { LobbyService } from './lobby.service';
import { SocketService } from "../socket.service";

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit  {

    public guestName: string;

    public constructor(public lobbyService: LobbyService, private socketService: SocketService) {
        this.guestName = "";
    }


    public ngOnInit(): void {
        this.socketService.getGameLobbies();
    }

    public joinGame(roomId: string): void {
        this.socketService.joinGame(roomId, this.guestName);        // opponentName
    }

    public isValidName(): boolean {
        return this.guestName.length > 0;        // TODO: ajouter alphanumerique
    }

}

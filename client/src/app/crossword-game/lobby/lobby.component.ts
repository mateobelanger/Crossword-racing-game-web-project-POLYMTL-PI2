import { Component } from '@angular/core';
import { LobbyService } from './lobby.service';
import { SocketService } from "../socket.service";

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {

    public constructor(private lobbyService: LobbyService, private socketService: SocketService) { }

    //TODO: REMOVE
    public toRemove(): void {
        this.lobbyService.SHOW_MOCK_DATA = false;
    }

    public joinGame(roomId: string): void {
        this.socketService.joinGame(roomId);
    }

}

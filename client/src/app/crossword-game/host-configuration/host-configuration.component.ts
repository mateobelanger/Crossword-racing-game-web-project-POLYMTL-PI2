import { Component } from '@angular/core';
import { SocketService } from "../socket.service";

@Component({
    selector: 'app-host-configuration',
    templateUrl: './host-configuration.component.html',
    styleUrls: ['./host-configuration.component.css']
})
export class HostConfigurationComponent {

    public constructor(private socketService: SocketService) { }

    public getGameLobbies(): void {
        this.socketService.getGameLobbies();
    }

}

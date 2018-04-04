import { Component } from '@angular/core';
import { LobbyService } from './lobby.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {

  public constructor(private lobbyService: LobbyService) { }

  //TODO: REMOVE
  public toRemove(): void {
      this.lobbyService.SHOW_MOCK_DATA = false;
  }

}

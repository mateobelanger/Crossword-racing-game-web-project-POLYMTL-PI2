import { Component } from '@angular/core';
import { ConfigurationHandlerService } from '../configuration-handler.service';
import { Difficulty } from '../../../../../common/constants';

@Component({
    selector: 'app-create-lobby',
    templateUrl: './create-lobby.component.html',
    styleUrls: ['./create-lobby.component.css'],
    providers: [ConfigurationHandlerService]
})
export class CreateLobbyComponent {

  public constructor(private configurationHandlerService: ConfigurationHandlerService) { }

  public get difficulty(): Difficulty {
      return this.configurationHandlerService.difficulty;
  }

  public isValidConfiguration(): boolean {
      return this.configurationHandlerService.difficulty && this.isValidUsername(this.configurationHandlerService.username);
  }

  public isValidUsername(username: String): boolean {
    return (username.length > 0);
  }

}

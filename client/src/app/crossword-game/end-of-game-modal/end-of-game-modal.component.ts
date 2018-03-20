import { Component } from '@angular/core';
import { ValidatorService } from '../validator.service';

@Component({
  selector: 'app-end-of-game-modal',
  templateUrl: './end-of-game-modal.component.html',
  styleUrls: ['./end-of-game-modal.component.css']
})
export class EndOfGameModalComponent {

  public constructor(private validatorService: ValidatorService) {
  }

  public isEndOfGame(): boolean {
    return this.validatorService.isEndOfGame;
  }

}

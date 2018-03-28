import { Injectable } from '@angular/core';
import { Difficulty } from '../../../../common/constants';

@Injectable()
export class ConfigurationHandlerService {
  public difficulty: Difficulty;
  public username: String;

  public constructor() {
      this.username = "";
  }

}

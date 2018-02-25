import { Component } from '@angular/core';
import { ValidationMediatorService } from '../validation-mediator.service';
import { DefinitionsService } from '../definitions.service';


@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent {


  public constructor(private validationMediatorService: ValidationMediatorService, private definitionsService: DefinitionsService) {
    this.validationMediatorService.init(); // TODO 
    this.definitionsService.initialize(); // TODO 

  }


}

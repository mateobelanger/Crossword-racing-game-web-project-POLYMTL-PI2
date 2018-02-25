import { Component } from '@angular/core';
import { SelectionMediatorService } from '../selection-mediator.service';
import { DefinitionsService } from '../definitions.service';


@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent {


  public constructor(private selectionMediatorService: SelectionMediatorService, private definitionsService: DefinitionsService) {
    this.selectionMediatorService.init(); // TODO 
    this.definitionsService.initialize(); // TODO 

  }


}

import { Component, OnInit } from '@angular/core';
import { RaceDataHandlerService } from '../../race-data-handler.service';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent implements OnInit {

  public constructor(private raceDataHandlerService: RaceDataHandlerService) { }

  public ngOnInit(): void {
  }

  public get position(): number {
    return this.raceDataHandlerService.position;
  }

}

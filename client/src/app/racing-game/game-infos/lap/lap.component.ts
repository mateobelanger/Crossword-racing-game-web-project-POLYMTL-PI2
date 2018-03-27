import { Component, OnInit } from '@angular/core';
import { RaceDataHandlerService } from '../../race-data-handler.service';

@Component({
  selector: 'app-lap',
  templateUrl: './lap.component.html',
  styleUrls: ['./lap.component.css']
})
export class LapComponent implements OnInit {

  public constructor(private raceDataHandler: RaceDataHandlerService) { }

  public ngOnInit(): void {
  }

  public get lapsElapsed(): number {
    return this.raceDataHandler.lapElapsed + 1;
  }
}

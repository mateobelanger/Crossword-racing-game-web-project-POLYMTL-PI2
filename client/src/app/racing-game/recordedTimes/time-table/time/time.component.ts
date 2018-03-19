import { Component, OnInit } from '@angular/core';
import { RaceResults } from '../../raceResults';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {

  public showLapsTime: boolean = false;
  public raceTime: RaceResults;
  public constructor() { }

  public ngOnInit(): void {
  }

}

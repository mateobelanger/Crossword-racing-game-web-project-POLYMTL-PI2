import { Component } from "@angular/core";
import { RaceDataHandlerService } from "../../race-data-handler.service";

@Component({
  selector: "app-countdown",
  templateUrl: "./countdown.component.html",
  styleUrls: ["./countdown.component.css"]
})
export class CountdownComponent {

  public constructor(private raceDataHandler: RaceDataHandlerService) { }

  public get time(): number {
    return this.raceDataHandler.countdownTime;
  }

}

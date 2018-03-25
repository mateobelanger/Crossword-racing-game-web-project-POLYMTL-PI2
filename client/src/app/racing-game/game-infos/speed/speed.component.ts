import { Component } from '@angular/core';
import { RenderService } from '../../render-service/render.service';
import { Car } from '../../cars/car/car';

@Component({
  selector: 'app-speed',
  templateUrl: './speed.component.html',
  styleUrls: ['./speed.component.css']
})
export class SpeedComponent {

  public constructor(private renderService: RenderService) { }

  public get car(): Car {
    return this.renderService.car;
  }
}

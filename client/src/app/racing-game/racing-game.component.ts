import { Component, AfterViewInit } from '@angular/core';
import { TracksProxyService } from './tracks-proxy.service';
import { TrackData } from '../../../../common/communication/trackData';
@Component({
  selector: 'app-racing-game',
  templateUrl: './racing-game.component.html',
  styleUrls: ['./racing-game.component.css']
})
export class RacingGameComponent implements AfterViewInit {
  private tracks: TrackData[];

  public constructor( private proxy: TracksProxyService ) { }

  public async ngAfterViewInit(): Promise<void> {

    await this.proxy.initialize();
    this.tracks = this.proxy.tracks;
  }

}

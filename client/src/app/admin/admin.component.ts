import { AfterViewInit, Component, OnInit/*,  ViewChild, ElementRef*/ } from "@angular/core";
import { TracksProxyService } from "../racing-game/tracks-proxy.service";
import { TrackData } from "../../../../common/communication/trackData";

// import { TrackEditorService } from "../racing-game/track-editor/track-editor.service";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit, AfterViewInit {
    public tracks: TrackData[];

    public constructor( private proxy: TracksProxyService ) {
    }

    public ngOnInit(): void {
    }

    public async ngAfterViewInit(): Promise<void> {

        await this.proxy.initialize();

        this.tracks = this.proxy.tracks;

        // POUR AJOUTER UNE TRACK, DECOMMENTER:
        // const aString: string = "track description";
        // const genny: [string, number][] = [["player1", 1]];

        // const trackData: TrackData = {name: "track5", description:  aString, timesPlayed: 5, bestTimes: genny,
        //                               waypoints: [[1, 1, 1]]};
        // // this.proxy.updateTrack(trackData);
        // this.proxy.addTrack(trackData);
    }


    public async deleteTrack(trackName: string): Promise<void>  {
        this.proxy.deleteTrack(trackName);

        await this.proxy.initialize();
        this.tracks = this.proxy.tracks;

    }

    public popUpFunction(trackIndex: number): void {
        const popup: HTMLElement = document.getElementById(trackIndex.toString());
        popup.classList.toggle("show");
    }

}

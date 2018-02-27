import { AfterViewInit, Component /*,  ViewChild, ElementRef*/ } from "@angular/core";
import { TracksProxyService } from "../racing-game/tracks-proxy.service";
import { ITrackData } from "../../../../common/trackData";

// import { TrackEditorService } from "../racing-game/track-editor/track-editor.service";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements  AfterViewInit {
    public tracks: ITrackData[];

    public constructor( private proxy: TracksProxyService ) {
        this.tracks = [];
    }

    public async ngAfterViewInit(): Promise<void> {
        try {
            await this.proxy.initialize();
            this.tracks = this.proxy.tracks;
        } catch (e) {
            return;
        }
    }

    public async deleteTrack(trackName: string): Promise<void>  {
        try {
            await this.proxy.deleteTrack(trackName);
            await this.proxy.initialize();
            this.tracks = this.proxy.tracks;
        } catch (e) {
            return;
        }
    }
}

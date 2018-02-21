import { AfterViewInit, Component, ViewChild, OnInit, ElementRef, HostListener } from "@angular/core";

import { TrackEditorService } from './track-editor.service';
import { TracksProxyService } from "../tracks-proxy.service";

// import { TrackData } from "../../../../../common/communication/trackData";

const LEFT_MOUSE_BTN: number = 0;
const RIGHT_MOUSE_BTN: number = 2;

@Component({
    selector: 'app-track-editor',
    templateUrl: './track-editor.component.html',
    styleUrls: ['./track-editor.component.css']
})
export class TrackEditorComponent implements AfterViewInit, OnInit {

    // public tracks: TrackData[];
    // public track: TrackData;
    // public name: string;

    @ViewChild("container")
    private containerRef: ElementRef;


    private get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    public constructor (private trackEditorService: TrackEditorService, private proxy: TracksProxyService) { }

    public ngOnInit(): void {
    }

    public async ngAfterViewInit(): Promise<void> {
        this.trackEditorService.initialize(this.container);
        await this.proxy.initialize();

        // this.tracks = this.proxy.tracks;
        // this.track = this.proxy.findTrack(window.location.href.split("/")[window.location.href.split("/").length - 1]);
        // this.name = this.track.name;


        // POUR AJOUTER UNE TRACK, DECOMMENTER:
        // const aString: string = "track description";
        // const genny: [string, number][] = [["player1", 1]];
        // const trackData: TrackData = {name: "track4", description:  aString, timesPlayed: 13, bestTimes: genny,
        //                               waypoints: [[1, 1, 1]]};

        // // this.proxy.updateTrack(trackData);
        // this.proxy.addTrack(trackData);
        // // this.proxy.deleteTrack("track1");
        // // console.log("track deleted?")
    }


    @HostListener("mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        switch (event.button) {
            case LEFT_MOUSE_BTN:
                this.trackEditorService.handleLeftMouseDown(event);
                break;
            case RIGHT_MOUSE_BTN:
                this.trackEditorService.handleRightMouseDown(event);
                break;
            default:
                break;
        }
    }

    @HostListener("mouseup", ["$event"])
    public onMouseUp(event: MouseEvent): void {
        if (event.button === LEFT_MOUSE_BTN)
            this.trackEditorService.handleLeftMouseUp(event);
    }

    @HostListener("mousemove", ["$event"])
    public onMouseMove(event: MouseEvent): void {
        this.trackEditorService.handleMouseMove(event);
    }
}

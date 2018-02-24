import { AfterViewInit, Component, ViewChild, OnInit, ElementRef, HostListener } from "@angular/core";

import { TrackEditorService } from './track-editor.service';
import { TracksProxyService } from "../tracks-proxy.service";

import { TrackData } from "../../../../../common/communication/trackData";
import { Waypoint } from "../track/trackData/waypoint";
import * as THREE from 'three';

const LEFT_MOUSE_BTN: number = 0;
const RIGHT_MOUSE_BTN: number = 2;

const X: number = 0;
const Y: number = 1;
const Z: number = 2;

@Component({
    selector: 'app-track-editor',
    templateUrl: './track-editor.component.html',
    styleUrls: ['./track-editor.component.css']
})
export class TrackEditorComponent implements AfterViewInit, OnInit {

    public trackData: TrackData;
    public waypoints: Waypoint[];

    @ViewChild("container")
    private containerRef: ElementRef;

    private get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    public constructor (private trackEditorService: TrackEditorService, private proxy: TracksProxyService) {
        this.waypoints = [];
    }

    public ngOnInit(): void {
    }

    public async ngAfterViewInit(): Promise<void> {
        this.trackEditorService.initialize(this.container);
        try {
            await this.proxy.initialize();
            this.getTrackFromProxy();
            this.renderTrack();
        } catch (e) {
            console.log(e);

            return;
        }
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


    private getTrackFromProxy(): void {
        const track: TrackData = this.proxy.findTrack( this.getTrackNameFromURL() );
        if (track === undefined) {
                throw new Error("track not found");
            }
        this.trackData = {  name: track.name, description: track.description, timesPlayed: track.timesPlayed,
                            bestTimes: track.bestTimes, waypoints: track.waypoints};

        this.trackData.waypoints.forEach( (element) => {
                const waypoint: Waypoint = new Waypoint();
                waypoint.position =  new THREE.Vector3(element[X], element[Y], element[Z]);
                this.waypoints.push(waypoint);
            });
    }

    private renderTrack(): void {
            this.trackEditorService.addWaypoints(this.waypoints);
            this.trackEditorService.closeTrack();
        }

    private getTrackNameFromURL(): string {
        return window.location.href.split("/")[window.location.href.split("/").length - 1].replace(/%20/g, " ");
    }

}

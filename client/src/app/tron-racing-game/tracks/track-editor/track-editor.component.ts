import { AfterViewInit, Component, ViewChild, ElementRef, HostListener } from "@angular/core";

import { TrackEditorService } from "./track-editor.service";
import { TracksProxyService } from "../tracks-proxy.service";

import { ITrackData } from "../../../../../../common/ITrackData";
import { ActivatedRoute } from "@angular/router";
import { Waypoint } from "../../tracks/trackData/waypoint";
import * as THREE from "three";

const LEFT_MOUSE_BTN: number = 0;
const RIGHT_MOUSE_BTN: number = 2;

const X: number = 0;
const Y: number = 1;
const Z: number = 2;

@Component({
    selector: "app-track-editor",
    templateUrl: "./track-editor.component.html",
    styleUrls: ["./track-editor.component.css"]
})
export class TrackEditorComponent implements AfterViewInit {

    public waypoints: Waypoint[];

    @ViewChild("container")
    private containerRef: ElementRef;

    private get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    public constructor (private trackEditorService: TrackEditorService, private proxy: TracksProxyService, private route: ActivatedRoute) {
        this.waypoints = [];
    }

    public async ngAfterViewInit(): Promise<void> {
        this.trackEditorService.initialize(this.container);
        try {
            if (this.route.snapshot.paramMap.get("trackName") !== "newTrack") {
                await this.proxy.initialize();
                this.setWaypointsFromProxy();
                this.renderTrack();
            }
        } catch (error) {
            console.error(error);
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


    private setWaypointsFromProxy(): void {

        const track: ITrackData = this.proxy.findTrack(  this.route.snapshot.paramMap.get("trackName")  );
        if (track === undefined) {
                throw new Error("track not found");
        }

        track.waypoints.forEach( (element) => {
                const waypoint: Waypoint = new Waypoint();
                waypoint.position =  new THREE.Vector3(element[X], element[Y], element[Z]);
                this.waypoints.push(waypoint);
        });

    }

    private renderTrack(): void {
            this.trackEditorService.addWaypoints(this.waypoints);
            this.trackEditorService.closeTrack();
        }


}

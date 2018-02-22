import { AfterViewInit, Component, ViewChild, OnInit, ElementRef, HostListener } from "@angular/core";

import { TrackEditorService } from './track-editor.service';
import { TracksProxyService } from "../tracks-proxy.service";

import { TrackData } from "../../../../../common/communication/trackData";
import { Waypoint } from "../track/trackData/waypoint";
import * as THREE from 'three';

const LEFT_MOUSE_BTN: number = 0;
const RIGHT_MOUSE_BTN: number = 2;

@Component({
    selector: 'app-track-editor',
    templateUrl: './track-editor.component.html',
    styleUrls: ['./track-editor.component.css']
})
export class TrackEditorComponent implements AfterViewInit, OnInit {

    public track: TrackData;
    public name: string;
    public description: string;
    public waypoints: Waypoint[] = [];

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

        const track: TrackData = this.proxy.findTrack( this.getTrackNameFromURL() );
        if (this.track !== null) {
            // TODO ne pas traiter si trackData est vide et faire quoi.. ? popup?
        }
        this.track = {name: track.name, description: track.description, timesPlayed: track.timesPlayed,
                      bestTimes: track.bestTimes, waypoints: track.waypoints};
        this.name = this.track.name;
        this.description = this.track.description;

        this.track.waypoints.forEach( (element) => {
            const waypoint: Waypoint = new Waypoint();
            waypoint.setPosition( new THREE.Vector3(element[0], element[1], element[1 + 1]) );
            this.waypoints.push(waypoint);
        });

        this.trackEditorService.addWaypoints(this.waypoints);
        this.trackEditorService.closeTrack();

        // this.waypoints = ;

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

    private getTrackNameFromURL(): string {
        const trackNameInURL: string = window.location.href.split("/")[window.location.href.split("/").length - 1];

        return trackNameInURL.replace(/%20/g, " ");

    }


    public saveTrack(): void  {
        this.track.name = this.name;
        this.track.description = this.description;
        this.addWaypointsToTrack( this.trackEditorService.track.getWaypoints() );
        console.log(this.track);
        this.proxy.updateTrack(this.track);

    }

    private addWaypointsToTrack(waypoints: Waypoint[]): void  {

        // enlever les points initiaux de la track
        this.track.waypoints.length = 0;
        console.log(this.track.waypoints);

        // ajouter les points actuels
        waypoints.forEach((waypoint) => {
            const positionVector: THREE.Vector3 = waypoint.getPosition();
            const position: [number, number, number] = [positionVector.x, positionVector.y, positionVector.z];
            this.track.waypoints.push(position);
        });

        // test: prendre la 2e track et faire un click de droit puis save.. rajoute un point
        // random

        // test: si on ferme la track avant de save c'est correct..
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

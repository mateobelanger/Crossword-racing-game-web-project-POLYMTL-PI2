import { AfterViewInit, Component } from "@angular/core";
import { TracksProxyService } from "../../racing-game/tracks-proxy.service";
import { ITrackData } from "../../../../../common/trackData";

import { TrackEditorService } from '../../racing-game/track-editor/track-editor.service';
import { ActivatedRoute } from '@angular/router';

import { Waypoint } from "../../racing-game/track/trackData/waypoint";
import * as THREE from 'three';

const UPPERCASE_A: number = 65;
const UPPERCASE_Z: number = 90;
const LOWERCASE_A: number = 97;
const LOWERCASE_Z: number = 122;
const CHAR_SPACE: number = 32;
const CHAR_0: number = 48;
const CHAR_9: number = 57;

@Component({
    selector: 'app-track-editor-ui',
    templateUrl: './track-editor-ui.component.html',
    styleUrls: ['./track-editor-ui.component.css']
})



export class TrackEditorUiComponent implements AfterViewInit {
    public readonly MAX_TITLE_LENGTH: number = 30;
    public readonly MAX_DESCRIPTION_LENGTH: number = 300;

    public name: string;
    public description: string ;
    public track: ITrackData;

    public constructor(private trackEditorService: TrackEditorService, private proxy: TracksProxyService, private route: ActivatedRoute) {
    }

    public async ngAfterViewInit(): Promise<void> {
        try {
            await this.proxy.initialize();
            this.setTrack();
        } catch (e) {
            return;
        }
    }

    public async saveTrack(): Promise<void> {
        try {
            await this.proxy.initialize();
        } catch (e) {
            return;
        }

        if (!this.trackEditorService.track.isValid || !this.trackEditorService.track.isClosed) {
            this.invalidTrackPopup();
        } else if (this.proxy.findTrack(this.name) !== null && this.track.name !== this.name) {
            this.alreadyUsedNamePopup();
        } else {
            this.validateName();
            this.validateDescription();
            this.validTrackPopup();
            this.addWaypointsToTrack(this.trackEditorService.track.waypoints);
            this.track.name = this.name;
            this.track.description = this.description;
            void this.proxy.saveTrack(this.track);
        }
    }

    public alreadyUsedNamePopup(): void {
        document.getElementById("validPopup").classList.remove("show");
        document.getElementById("invalidTrackPopup").classList.remove("show");
        document.getElementById("alreadyUsedNamePopup").classList.toggle("show");
    }

    public invalidTrackPopup(): void {
        document.getElementById("validPopup").classList.remove("show");
        document.getElementById("alreadyUsedNamePopup").classList.remove("show");
        document.getElementById("invalidTrackPopup").classList.toggle("show");
    }

    public validTrackPopup(): void {
        document.getElementById("invalidTrackPopup").classList.remove("show");
        document.getElementById("alreadyUsedNamePopup").classList.remove("show");
        document.getElementById("validPopup").classList.toggle("show");
    }

    public isAlphaNum (keyCode: number): boolean {
        return (keyCode >= UPPERCASE_A && keyCode <= UPPERCASE_Z) ||
               (keyCode >= LOWERCASE_A && keyCode <= LOWERCASE_Z) ||
               (keyCode >= CHAR_0 && keyCode <= CHAR_9) ||
               keyCode === CHAR_SPACE;
    }

    public validateName(): void {
        if (this.name.length > this.MAX_TITLE_LENGTH) {
            this.name = this.name.slice(0, this.MAX_TITLE_LENGTH);
        }
    }

    public validateDescription(): void {
        if (this.description.length > this.MAX_DESCRIPTION_LENGTH) {
            this.description = this.description.slice(0, this.MAX_DESCRIPTION_LENGTH);
        }
    }

    private setTrack(): void {
        // if the user is creating a new track
        if (this.route.snapshot.paramMap.get("trackName") === "newTrack") {
            this.track = {
                name: "", description: "",
                timesPlayed: 0,
                bestTimes: [], waypoints: []
            };

        } else {
            this.setTrackFromProxy();
        }
    }

    private setTrackFromProxy(): void {
        const track: ITrackData = this.proxy.findTrack(this.route.snapshot.paramMap.get("trackName"));
        if (track === null) {
            throw new Error("track not found");
        }
        this.track = {
            name: track.name, description: track.description,
            timesPlayed: track.timesPlayed,
            bestTimes: track.bestTimes, waypoints: track.waypoints
        };
        this.name = track.name;
        this.description = track.description;
    }

    private addWaypointsToTrack(waypoints: Waypoint[]): void {
        // remove initial track waypoints(from server)
        this.track.waypoints.length = 0;

        // add current waypoints(from track-editor-service)
        waypoints.forEach((waypoint) => {
            const positionVector: THREE.Vector3 = waypoint.position;
            const position: [number, number, number] = [positionVector.x, positionVector.y, positionVector.z];
            this.track.waypoints.push(position);
        });

    }
}

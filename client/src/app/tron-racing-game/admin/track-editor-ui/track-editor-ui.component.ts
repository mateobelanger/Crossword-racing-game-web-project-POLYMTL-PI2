import { AfterViewInit, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as THREE from "three";

import { ITrackData } from "../../../../../../common/ItrackData";
import { NameValidator } from "../../../../../../common/nameValidator";

import { TracksProxyService } from "../../tracks/tracks-proxy.service";
import { TrackEditorService } from "../../tracks/track-editor/track-editor.service";
import { Waypoint } from "../../tracks/trackData/waypoint";

@Component({
    selector: "app-track-editor-ui",
    templateUrl: "./track-editor-ui.component.html",
    styleUrls: ["./track-editor-ui.component.css"]
})

export class TrackEditorUiComponent implements AfterViewInit {
    public readonly MAX_TITLE_LENGTH: number = 30;
    public readonly MAX_DESCRIPTION_LENGTH: number = 300;

    public name: string;
    public description: string ;
    public track: ITrackData;

    public constructor( private trackEditorService: TrackEditorService, private proxy: TracksProxyService,
                        private route: ActivatedRoute, private router: Router) {
        this.name = "";
        this.description = "";
        this.track = null;
    }

    public async ngAfterViewInit(): Promise<void> {
        try {
            await this.proxy.initialize();
            this.setTrack();
        } catch (error) {
            console.error(error);
        }
    }

    public async saveTrack(): Promise<void> {
        try {
            await this.proxy.initialize();
        } catch (error) {
            console.error(error);
        }

        if (this.isValidTrack() && !this.isAlreadyATrack()) {
            this.validateName();
            this.validateDescription();
            this.updateTrackWaypoints(this.trackEditorService.track.waypoints);
            this.track.name = this.name;
            this.track.description = this.description;
            this.track.image = this.trackEditorService.takeScreenShot();
            void this.proxy.saveTrack(this.track);
            this.router.navigate(["/admin"]);
        }
    }

    public isAlphaNumerical (keyCode: number): boolean {
        return NameValidator.isAlphaNumerical(keyCode);
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
                bestTimes: [], waypoints: [],
                image: ""
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
            bestTimes: track.bestTimes, waypoints: track.waypoints,
            image: track.image
        };
        this.name = track.name;
        this.description = track.description;
    }

    private updateTrackWaypoints(waypoints: Waypoint[]): void {
        // remove initial track waypoints(from server)
        this.track.waypoints.length = 0;

        // add current waypoints(from track-editor-service)
        waypoints.forEach((waypoint) => {
            const positionVector: THREE.Vector3 = waypoint.position;
            const position: [number, number, number] = [positionVector.x, positionVector.y, positionVector.z];
            this.track.waypoints.push(position);
        });

    }

    private isAlreadyATrack(): boolean {
        return this.proxy.findTrack(this.name) !== null && this.track.name !== this.name;
    }

    private isValidTrack(): boolean {

        return  this.isValidNameAndDescription() &&
                this.trackEditorService.track.isValid &&
                this.trackEditorService.track.isClosed;
    }

    private isValidNameAndDescription(): boolean {
        return  this.name.length > 0 &&
                this.description.length > 0 &&
                !NameValidator.isContainsOnlySpaces(this.name) &&
                !NameValidator.isContainsOnlySpaces(this.description);
    }
}

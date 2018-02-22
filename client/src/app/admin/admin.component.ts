import { Component, OnInit } from '@angular/core';
import { TRACKS } from './fakeTracks';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
    private tracks: any;


    public constructor() {
        this.tracks = TRACKS;
    }

    public ngOnInit(): void {
    }

    public popUpFunction(trackIndex: number): void {
        const popup: HTMLElement = document.getElementById(trackIndex.toString());
        popup.classList.toggle("show");
    }

}

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
 /* private tracks: JSON ;
  private tracks2: JSON ;
  private tracks3: JSON ;*/

  public constructor() {/*
    this.tracks = require("./fakeTracks.json");
    this.tracks2 = require("./ft2.json");
    this.tracks3 = require("./ft3.json");*/
  }

  public ngOnInit(): void {
  }

  public popUpFunction(trackIndex: number): void {
    const popup: HTMLElement = document.getElementById(trackIndex.toString());
    popup.classList.toggle("show");
  }

}

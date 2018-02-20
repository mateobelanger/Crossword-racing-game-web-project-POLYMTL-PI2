import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-track-editor-ui',
  templateUrl: './track-editor-ui.component.html',
  styleUrls: ['./track-editor-ui.component.css']
})

export class TrackEditorUiComponent implements OnInit {

  public track: string;

  public constructor() { }

  public ngOnInit(): void {
  }

}

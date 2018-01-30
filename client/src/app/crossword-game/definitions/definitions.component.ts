import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-definitions',
  templateUrl: './definitions.component.html',
  styleUrls: ['./definitions.component.css']
})
export class DefinitionsComponent implements OnInit {

  private definitions: Array<string>;

  constructor() {
    this.definitions = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"];
   }

  ngOnInit() {
  }

}

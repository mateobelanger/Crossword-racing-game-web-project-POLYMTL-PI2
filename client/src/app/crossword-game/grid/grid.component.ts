import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  private userGrid: Array<Array<string>>;

  public constructor() {
    this.userGrid = [["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                     ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                     ["A", "-", "C", "D", "E", "F", "G", "H", "I", "K"],
                     ["A", "B", "", "D", "E", "F", "G", "H", "I", "K"],
                     ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                     ["A", "B", "C", "D", "E", "-", "G", "H", "I", "K"],
                     ["A", "", "C", "D", "E", "F", "G", "H", "I", "K"],
                     ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                     ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                     ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"]];
  }

  ngOnInit() {
  }

}

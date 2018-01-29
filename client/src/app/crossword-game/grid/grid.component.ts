import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  private grid: Array<Array<string>>;

  public constructor() {
    this.grid = [["-", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                 ["1", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                 ["2", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                 ["3", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                 ["4", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                 ["5", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                 ["6", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                 ["7", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                 ["8", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                 ["9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K"],
                 ["10", "A", "B", "C", "D", "E", "F", "G", "H", "I", "K"]];
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

    private userGrid: Array<Array<string>>;

    public constructor() {
        this.userGrid = [["", "", "", "", "", "", "", "", "", ""],
                         ["", "", "", "", "", "", "", "", "", ""],
                         ["", "", "", "", "", "", "", "", "", ""],
                         ["", "", "", "", "", "", "", "", "", ""],
                         ["", "", "", "-", "-", "", "", "", "", ""],
                         ["", "", "", "", "", "", "", "", "", ""],
                         ["", "", "", "", "", "", "", "", "", ""],
                         ["", "", "", "", "", "", "", "", "", ""],
                         ["", "", "", "", "", "", "", "", "", ""],
                         ["", "", "", "", "", "", "", "", "", ""]];
    }

    public ngOnInit(): void {
    }

    public trackByIndex(index: number, value: number): number {
        return index;
    }

}

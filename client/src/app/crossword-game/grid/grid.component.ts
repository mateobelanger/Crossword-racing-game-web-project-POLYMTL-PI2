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

    public changeCssOnSelection(id: number): void {
        document.getElementById(id.toString()).setAttribute("class", "selected col");
    }

}

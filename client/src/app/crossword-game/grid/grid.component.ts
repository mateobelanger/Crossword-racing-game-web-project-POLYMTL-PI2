import { Component, OnInit } from '@angular/core';

const UPPERCASE_A: number = 65;
const UPPERCASE_Z: number = 90;
const LOWERCASE_A: number = 97;
const LOWERCASE_Z: number = 122;

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

    public isLetter(keyCode: number): boolean {
        return (keyCode >= UPPERCASE_A && keyCode <= UPPERCASE_Z ||
                keyCode >= LOWERCASE_A && keyCode <= LOWERCASE_Z );
    }

    public trackByIndex(index: number, value: number): number {
        return index;
    }

    public changeCssOnSelection(id: number): void {
        document.getElementById(id.toString()).setAttribute("class", "selected col");
    }

}

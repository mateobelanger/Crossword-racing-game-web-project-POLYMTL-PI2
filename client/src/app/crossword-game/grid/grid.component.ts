import { Component } from "@angular/core";
import { GridService } from "../grid.service";

@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})

export class GridComponent {

    public constructor(private gridService: GridService) {}

    public trackByIndex(index: number): number {
        return index;
    }

    public keyDown(keyCode: number, row: number, column: number): void {
        this.gridService.keyDown(keyCode, row, column);
    }

    public keyUp(row: number, column: number): void {
        this.gridService.keyUp(row, column);
    }

    public onSelect(row: number, column: number): void {
        this.gridService.selectWord(row, column);
        this.focusOnSelectedWord();
    }

    public focusOnSelectedWord(): void {
        this.focusOnCell(this.gridService.idOfFirstEmptyCell());
    }

    private focusOnCell(id: number): void {
        const input: HTMLElement = document.getElementById(id.toString());
        if (input) {
            input.focus();
        }
    } //component 

}

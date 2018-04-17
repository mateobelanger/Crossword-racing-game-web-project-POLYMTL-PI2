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

    public keyUp(row: number, column: number): void {
        this.gridService.keyUp(row, column);
    }

    public onSelect(row: number, column: number): void {
        this.gridService.selectWord(row, column);
    }
}

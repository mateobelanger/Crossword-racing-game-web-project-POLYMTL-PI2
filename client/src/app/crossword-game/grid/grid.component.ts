import { Component, OnInit } from "@angular/core";
import { GridService } from "../grid.service";

@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})

export class GridComponent implements OnInit {

    public constructor(private gridService: GridService) {
    }

    public ngOnInit(): void {
        this.gridService.fillGrid();
    }

    public trackByIndex(index: number): number {
        return index;
    }

}

import { Component } from "@angular/core";
import { GridService } from "../grid.service";
import { SelectionMediatorService } from "../selection-mediator.service";

@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})

export class GridComponent {

    public constructor(private selectionMediatorService: SelectionMediatorService, private gridService: GridService) {
        this.gridService.fillGrid();
        this.selectionMediatorService.init(); // TODO 
    }



    public trackByIndex(index: number): number {
        return index;
    }

}

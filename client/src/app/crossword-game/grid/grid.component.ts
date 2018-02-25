import { Component } from "@angular/core";
import { GridService } from "../grid.service";
import { ValidationMediatorService } from "../validation-mediator.service";

@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})

export class GridComponent {

    public constructor(private validationMediatorService: ValidationMediatorService, private gridService: GridService) {
        this.gridService.initialize();
        this.validationMediatorService.initialize();
    }

    public trackByIndex(index: number): number {
        return index;
    }

}

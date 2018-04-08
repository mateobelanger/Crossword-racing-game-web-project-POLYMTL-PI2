import { Injectable } from "@angular/core";
import { GRID_SIZE, BLACK_CELL } from "../../../../common/constants";

@Injectable()
export class UserGridService {

    public userGrid: string[][];

    public constructor() {
        this.userGrid = [];
    }

    public initialize(): void {
        this.userGrid = [];
        for (let i: number = 0; i < GRID_SIZE; i++) {
            const row: string[] = [];
            for (let j: number = 0; j < GRID_SIZE; j++) {
                row.push(BLACK_CELL);
            }
            this.userGrid.push(row);
        }
    }

}

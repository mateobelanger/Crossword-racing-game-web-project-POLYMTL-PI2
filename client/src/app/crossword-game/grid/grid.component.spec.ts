import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";

import { GridComponent } from "./grid.component";
import { FormsModule } from "@angular/forms";
import { routes } from "../../app-routes.module";
import { AppModule } from "../../app.module";
import { GridService } from "../grid.service";
import { ValidatorService } from "../validator.service";
import { WordService } from "../word.service";
import { UserGridService } from "../user-grid.service";

describe("GridComponent", () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule, FormsModule],
            providers: [GridService, ValidatorService, WordService, UserGridService, {provide: APP_BASE_HREF, useValue : "/" }]
        })
        .compileComponents().catch( (error: Error) => console.error(error));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

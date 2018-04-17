import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResultTableComponent } from "./result-table.component";
import { AppModule } from "../../../../app.module";
import { routes } from "../../../../app-routes.module";
import { APP_BASE_HREF } from "@angular/common";

describe("ResultTableComponent", () => {
    let component: ResultTableComponent;
    let fixture: ComponentFixture<ResultTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
        })
            .compileComponents()
            .catch((error: Error) => { console.error(error); });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResultTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
});

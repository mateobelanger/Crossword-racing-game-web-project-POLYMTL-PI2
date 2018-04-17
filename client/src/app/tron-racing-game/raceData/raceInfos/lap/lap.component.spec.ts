import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LapComponent } from "./lap.component";
import { AppModule } from "../../../../app.module";
import { routes } from "../../../../app-routes.module";
import { APP_BASE_HREF } from "@angular/common";
import { InputHandlerService } from "../../../physics&interactions/controller/input-handler.service";

describe("LapComponent", () => {
    let component: LapComponent;
    let fixture: ComponentFixture<LapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{provide: APP_BASE_HREF, useValue : "/" }, InputHandlerService]
        })
            .compileComponents()
            .catch((error: Error) => { console.error(error); });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

});

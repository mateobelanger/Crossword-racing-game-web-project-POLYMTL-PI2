import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";

import { SoloConfigurationComponent } from "./solo-configuration.component";
import { routes } from "../../../app-routes.module";
import { AppModule } from "../../../app.module";

describe("SoloConfigurationComponent", () => {
    let component: SoloConfigurationComponent;
    let fixture: ComponentFixture<SoloConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
        })
        .compileComponents().catch( (error: Error) => console.error(error));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SoloConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

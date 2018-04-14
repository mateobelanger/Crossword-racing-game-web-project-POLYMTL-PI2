import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";

import { SoloConfigurationComponent } from "./soloConfiguration.component";
import { routes } from "../../../app-routes.module";
import { AppModule } from "../../../app.module";


describe("SoloConfigurationComponent", () => {
    let component: SoloConfigurationComponent;
    let fixture: ComponentFixture<SoloConfigurationComponent>;

    beforeEach(async(() => {
        // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
        })
        .compileComponents();
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

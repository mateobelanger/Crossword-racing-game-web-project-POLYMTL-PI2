import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LobbyComponent } from "./lobby.component";
import { routes } from "../../app-routes.module";
import { AppModule } from "../../app.module";
import { APP_BASE_HREF } from "@angular/common";

const GUEST_NAME: string = "barb";

describe("LobbyComponent", () => {
    let component: LobbyComponent;
    let fixture: ComponentFixture<LobbyComponent>;

    beforeEach(async(() => {
        // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LobbyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should change the attribute", () => {
        component.guestName = GUEST_NAME;
        expect(component.guestName).toBe(GUEST_NAME);
    });

    it("should consider guestName to be a valid name", () => {
        component.guestName = GUEST_NAME;
        expect(component.isValidName()).toBe(true);
    });

    it("should not consider guestName to be a valid name", () => {
        component.guestName = "";
        expect(component.isValidName()).toBe(false);
    });

});

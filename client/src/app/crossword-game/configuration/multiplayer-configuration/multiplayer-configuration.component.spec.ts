import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MultiplayerConfigurationComponent } from "./multiplayer-configuration.component";
import { routes } from "../../../app-routes.module";
import { AppModule } from "../../../app.module";
import { APP_BASE_HREF } from "@angular/common";
import { SocketService } from "../../socket.service";
import { GameStateService } from "../../game-state.service";

describe("MultiplayerConfigurationComponent", () => {
    let component: MultiplayerConfigurationComponent;
    let fixture: ComponentFixture<MultiplayerConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: "/" }, GameStateService, SocketService]
        })
        .compileComponents().catch( (error: Error) => console.error(error));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

});

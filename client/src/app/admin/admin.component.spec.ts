import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";

import { AppModule } from "../app.module";
import { routes } from "../app-routes.module";
import { AdminComponent } from "./admin.component";
import { TrackData } from "../../../../common/trackData";
import { TracksProxyService } from "../racing-game/tracks-proxy.service";

describe("AdminComponent", () => {

    const tracks: TrackData[] = [
        {
            name: "Test",
            description: "Test description",
            timesPlayed: 12,
            // tslint:disable-next-line:no-magic-numbers
            bestTimes: [["gen", 2], ["p-o ;)", 1]],
            // tslint:disable-next-line:no-magic-numbers
            waypoints: [[1, 1, 1], [2, 2, 2]]
        },
        {
            name: "Test2",
            description: "Test description",
            timesPlayed: 12,
            // tslint:disable-next-line:no-magic-numbers
            bestTimes: [["gen", 2], ["p-o ;)", 1]],
            // tslint:disable-next-line:no-magic-numbers
            waypoints: [[1, 1, 1], [2, 2, 2]]
        },
        {
            name: "Test3",
            description: "Test description",
            timesPlayed: 12,
            bestTimes: [["gen", 1], ["p-o ;)", 1]],
            // tslint:disable-next-line:no-magic-numbers
            waypoints: [[1, 1, 1], [2, 2, 2]]
        }
    ];

    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;
    let spyInitialize: jasmine.Spy;
    let spyDelete: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [TracksProxyService, { provide: APP_BASE_HREF, useValue: "/" }]
        });


        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;

        // TwainService actually injected into the component
        const proxyService: TracksProxyService = fixture.debugElement.injector.get(TracksProxyService);

        // Set up spy on the "initialize" method
        spyInitialize = spyOn(proxyService, "initialize")
            .and.returnValue(Promise.resolve(tracks));

        // Set up spy on the "deleteTrack" method
        spyDelete = spyOn(proxyService, "deleteTrack")
            .and.returnValue(Promise.resolve(tracks.pop()));

    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should not have tracks before OnInit", () => {
        expect(component.tracks).toBeUndefined();
        expect(spyInitialize.calls.any()).toBe(false, "initialize not yet called");
    });

    it("should not have tracks before proxy service returned tracks", () => {
        fixture.detectChanges();
        // initialize service is async => still has not returned with tracks
        expect(component.tracks).toBeUndefined();
        expect(spyInitialize.calls.any()).toBe(true, 'initialize called');
    });

    it("should have tracks once proxy service returned tracks", () => {

        fixture.detectChanges();
        async(() => {
            fixture.whenStable().then(() => {   // wait for async initialize
                expect(component.tracks).toBe(tracks);
            });
        });
    });

    it("should not call deleteTrack by itself", () => {
        fixture.detectChanges();
        expect(spyDelete.calls.any()).toBe(false, "delete not yet called");
    });


    it("should call delete from proxy when deleting track", () => {

        async(() => {
            fixture.detectChanges();

            fixture.whenStable().then(() => {       // wait for async delete
                fixture.detectChanges();
                component.deleteTrack("test3");
                expect(spyDelete.calls.any()).toBe(true, 'delete called');
                tracks.pop();
                expect(component.tracks).toBe(tracks);
            });
        });
    });

});

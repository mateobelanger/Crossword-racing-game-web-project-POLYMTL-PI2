import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";

import { TrackListComponent } from "./track-list.component";
import { routes } from "../app-routes.module";
import { AppModule } from "../app.module";
import { ITrackData } from "../../../../common/ItrackData";
import { TracksProxyService } from "./tracks/tracks-proxy.service";

const tracks: ITrackData[] = [
    {
        name: "Test",
        description: "Test description",
        timesPlayed: 12,
        // tslint:disable-next-line:no-magic-numbers
        bestTimes: [["gen", 2], ["p-o ;)", 1]],
        // tslint:disable-next-line:no-magic-numbers
        waypoints: [[1, 1, 1], [2, 2, 2]],
        image: "ab"
    },
    {
        name: "Test2",
        description: "Test description",
        timesPlayed: 12,
        // tslint:disable-next-line:no-magic-numbers
        bestTimes: [["gen", 2], ["p-o ;)", 1]],
        // tslint:disable-next-line:no-magic-numbers
        waypoints: [[1, 1, 1], [2, 2, 2]],
        image: "cd"
    },
    {
        name: "Test3",
        description: "Test description",
        timesPlayed: 12,
        bestTimes: [["gen", 1], ["p-o ;)", 1]],
        // tslint:disable-next-line:no-magic-numbers
        waypoints: [[1, 1, 1], [2, 2, 2]],
        image: "ef"
    }
];

describe("RacingGameComponent", () => {
    let component: TrackListComponent;
    let fixture: ComponentFixture<TrackListComponent>;
    let spyInitialize: jasmine.Spy;

    beforeEach(async(() => {
    // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [TracksProxyService, { provide: APP_BASE_HREF, useValue: "/" }]
        });


        fixture = TestBed.createComponent(TrackListComponent);
        component = fixture.componentInstance;

        // proxyService injected into the component
        const proxyService: TracksProxyService = fixture.debugElement.injector.get(TracksProxyService);

        // Set up spy on the "initialize" method
        spyInitialize = spyOn(proxyService, "initialize")
            .and.returnValue(Promise.resolve(tracks));

    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should not have tracks before OnInit", () => {
        expect(component.tracks).toBeUndefined();
        expect(spyInitialize.calls.any()).toBe(false, "initialize not yet called");
    });

    it("should not have tracks before proxy service returned tracks", () => {
        // fixture.detectChanges();
        // initialize service is async => still has not returned with tracks
        expect(component.tracks).toBeUndefined();
        expect(spyInitialize.calls.any()).toBe(false, "initialize called");
    });

    // it("should have tracks once proxy service returned tracks", () => {

    //     fixture.detectChanges();
    //     async(() => {
    //         fixture.whenStable().then(() => {   // wait for async initialize
    //             expect(component.tracks).toBe(tracks);
    //         }).catch((error: Error) => { console.error(error); });
    //     });
    // });
            

});

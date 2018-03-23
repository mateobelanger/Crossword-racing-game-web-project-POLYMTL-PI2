import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { TrackEditorUiComponent } from './track-editor-ui.component';
import { routes } from '../../app-routes.module';
import { AppModule } from '../../app.module';
import { ITrackData } from '../../../../../common/ItrackData';
import { TracksProxyService } from "../../racing-game/tracks-proxy.service";

const fakeTrack: ITrackData = {
    name: "Test3",
    description: "Test description",
    timesPlayed: 12,
    bestTimes: [],
    // tslint:disable-next-line:no-magic-numbers
    waypoints: [[1, 1, 1], [2, 2, 2]]

};

const tracks: ITrackData[] = [
    {
        name: "Test",
        description: "Test description",
        timesPlayed: 12,
        bestTimes: [],
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
    }
];

describe('TrackEditorUiComponent', () => {
    let component: TrackEditorUiComponent;
    let fixture: ComponentFixture<TrackEditorUiComponent>;
    let spyInitialize: jasmine.Spy;
    let spySaveTrack: jasmine.Spy;

    beforeEach(async(() => {
        // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackEditorUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        // TwainService actually injected into the component
        const proxyService: TracksProxyService = fixture.debugElement.injector.get(TracksProxyService);

        // Set up spy on the "initialize" method
        spyInitialize = spyOn(proxyService, "initialize")
            .and.returnValue(Promise.resolve(tracks));

        // Set up spy on the "saveTrack" method
        spySaveTrack = spyOn(proxyService, "saveTrack")
            .and.returnValue(Promise.resolve(tracks.push(fakeTrack)));
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("shouldn't save a track with a title longer than 30 chars", () => {
        let longTitle: string = "";
        for (let i: number = 0; i < component.MAX_TITLE_LENGTH; i++) {
            longTitle += "abc";
        }
        component.name = longTitle;
        component.validateName();
        expect(component.name.length).toBeLessThanOrEqual(component.MAX_TITLE_LENGTH);
    });

    it("shouldn't save a track with a description longer than 300 chars", () => {
        let longDescription: string = "";
        for (let i: number = 0; i < component.MAX_DESCRIPTION_LENGTH; i++) {
            longDescription += "abc";
        }
        component.description = longDescription;
        component.validateDescription();
        expect(component.description.length).toBeLessThanOrEqual(component.MAX_DESCRIPTION_LENGTH);
    });

    it("should only accept alphanumerical characters", () => {
        const alphaNumerical: string = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let acceptsAlphaNum: boolean = true;
        for (const char of alphaNumerical) {
            if (!component.isAlphaNum(char.charCodeAt(0))) {
                acceptsAlphaNum = false;
                break;
            }
        }
        expect(acceptsAlphaNum).toBe(true);

        const symbols: string = "-=`~_+[]{};\':\"\\,.<>/?";
        let acceptsSymbols: boolean = false;
        for (const char of symbols) {
            if (component.isAlphaNum(char.charCodeAt(0))) {
                acceptsSymbols = true;
                break;
            }
        }
        expect(acceptsSymbols).toBe(false);
    });

    it("should not have track before OnInit", () => {
        expect(component.track).toBeNull();
        expect(spyInitialize.calls.any()).toBe(false, "initialize not yet called");
    });

    it("should have track once proxy service returned track", () => {

        fixture.detectChanges();
        async(() => {
            fixture.whenStable().then(() => {   // wait for async initialize
                expect(component.track).toBe(fakeTrack);
            });
        });
    });

    it("should not call saveTrack by itself", () => {
        fixture.detectChanges();
        expect(spySaveTrack.calls.any()).toBe(false, "saveTrack not yet called");
    });


    it("should call delete from proxy when saving track", () => {

        async(() => {
            fixture.detectChanges();
            component.track = fakeTrack;

            fixture.whenStable().then(() => {       // wait for async saveTrack
                fixture.detectChanges();
                component.saveTrack();
                expect(spySaveTrack.calls.any()).toBe(true, "saveTrack called");
            });
        });
    });
});


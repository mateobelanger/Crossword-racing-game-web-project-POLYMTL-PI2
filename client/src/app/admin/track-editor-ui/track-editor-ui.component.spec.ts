import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { TrackEditorUiComponent } from './track-editor-ui.component';
import { routes } from '../../app-routes.module';
import { AppModule } from '../../app.module';
import { TrackData } from '../../../../../common/trackData';

const fakeTrack: TrackData = {
    name: "test",
    description: "test description",
    timesPlayed: 0,
    bestTimes: [],
    // tslint:disable-next-line:no-magic-numbers
    waypoints: [[1, 1, 1], [2, 2, 2]]
};

describe('TrackEditorUiComponent', () => {
    let component: TrackEditorUiComponent;
    let fixture: ComponentFixture<TrackEditorUiComponent>;

    beforeEach(async(() => {
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
        component.track = fakeTrack;
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
});


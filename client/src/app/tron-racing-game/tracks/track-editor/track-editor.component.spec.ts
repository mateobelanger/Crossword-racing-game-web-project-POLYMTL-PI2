import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ActivatedRoute } from "@angular/router";

import { TrackEditorComponent } from "./track-editor.component";
import { TrackEditorService } from "./track-editor.service";
import { TrackEditorRenderService } from "./track-editor-render.service";
import { TracksProxyService } from "../tracks-proxy.service";

describe("TrackEditorComponent", () => {

    const fakeActivatedRoute: ActivatedRoute = {
        snapshot: { data: {} }
    } as ActivatedRoute;

    let component: TrackEditorComponent;
    let fixture: ComponentFixture<TrackEditorComponent>;

    beforeEach(async(() => {
        // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
            declarations: [TrackEditorComponent],
            imports: [HttpClientTestingModule],
            providers: [TrackEditorService, TrackEditorRenderService,
                        TracksProxyService, { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

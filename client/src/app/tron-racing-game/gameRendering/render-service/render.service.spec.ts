import { TestBed, inject } from "@angular/core/testing";

import { RenderService } from "./render.service";
import { routes } from "../../../app-routes.module";
import { AppModule } from "../../../app.module";
import { APP_BASE_HREF } from "@angular/common";

describe("RenderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{provide: APP_BASE_HREF, useValue : '/' }]
        });
    });

    it("should be created", inject([RenderService], (service: RenderService) => {
        expect(service).toBeTruthy();
    }));
});

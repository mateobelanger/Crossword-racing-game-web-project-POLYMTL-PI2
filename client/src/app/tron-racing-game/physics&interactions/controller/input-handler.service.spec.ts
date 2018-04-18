import { TestBed, inject } from "@angular/core/testing";

import { InputHandlerService } from "./input-handler.service";
import { routes } from "../../../app-routes.module";
import { AppModule } from "../../../app.module";
import { APP_BASE_HREF } from "@angular/common";

describe("InputHandlerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [routes, AppModule],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
    });
  });

  it("should be created", inject([InputHandlerService], (service: InputHandlerService) => {
    expect(service).toBeTruthy();
  }));
});

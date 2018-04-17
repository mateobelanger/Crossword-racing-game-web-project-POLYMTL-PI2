import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";

import { EndOfGameModalComponent } from "./end-of-game-modal.component";
import { routes } from "../../app-routes.module";
import { AppModule } from "../../app.module";
import { GridService } from "../grid.service";
import { ValidatorService } from "../validator.service";
import { UserGridService } from "../user-grid.service";
import { WordService } from "../word.service";

describe("EndOfGameModalComponent", () => {
  let component: EndOfGameModalComponent;
  let fixture: ComponentFixture<EndOfGameModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [routes, AppModule],
      providers: [GridService, ValidatorService, UserGridService, WordService,
                  { provide: APP_BASE_HREF, useValue: "/" }]
    })
    .compileComponents()
    .catch( (error: Error) => {
      console.error(error);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndOfGameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});

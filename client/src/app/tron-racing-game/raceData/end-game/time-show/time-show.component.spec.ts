import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TimeShowComponent } from "./time-show.component";
import { APP_BASE_HREF } from "@angular/common";
import { AppModule } from "../../../../app.module";
import { routes } from "../../../../app-routes.module";
import { Input } from "@angular/core";


describe("TimeShowComponent", () => {
   // let component: TimeShowComponent;
   let fixture: ComponentFixture<TimeShowComponent>;

   beforeEach(async(() => {
       // tslint:disable-next-line:no-floating-promises
       TestBed.configureTestingModule({
           imports: [routes, AppModule],
           providers: [{ provide: APP_BASE_HREF, useValue: "/" }, Input]
       })
       .compileComponents().catch( (error: Error) => console.error(error));
   }));

   beforeEach(() => {
       fixture = TestBed.createComponent(TimeShowComponent);
       // component = fixture.componentInstance;
       fixture.detectChanges();
   });
/*
   it('should create', () => {
       expect(component).toBeTruthy();
   });*/
});

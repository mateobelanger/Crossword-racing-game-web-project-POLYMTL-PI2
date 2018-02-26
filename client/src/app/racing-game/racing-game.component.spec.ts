import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { RacingGameComponent } from './racing-game.component';
import { routes } from '../app-routes.module';
import { AppModule } from '../app.module';

describe('RacingGameComponent', () => {
    let component: RacingGameComponent;
    let fixture: ComponentFixture<RacingGameComponent>;

    beforeEach(async(() => {
    // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RacingGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

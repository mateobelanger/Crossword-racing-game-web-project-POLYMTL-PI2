import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { GameUiComponent } from './game-ui.component';
import { routes } from '../../app-routes.module';
import { AppModule } from '../../app.module';

describe('GameUiComponent', () => {
    let component: GameUiComponent;
    let fixture: ComponentFixture<GameUiComponent>;

    beforeEach(async(() => {
        // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    // TODO TEST : Cannot read property 'substring' of null
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

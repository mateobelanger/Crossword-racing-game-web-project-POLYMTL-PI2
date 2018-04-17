import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownComponent } from './countdown.component';
import { routes } from '../../../../app-routes.module';
import { AppModule } from '../../../../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('CountdownComponent', () => {
    let component: CountdownComponent;
    let fixture: ComponentFixture<CountdownComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
        })
            .compileComponents()
            .catch((error: Error) => { console.error(error); });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CountdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

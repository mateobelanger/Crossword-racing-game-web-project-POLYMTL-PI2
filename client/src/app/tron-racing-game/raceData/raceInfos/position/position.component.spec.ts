import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionComponent } from './position.component';
import { AppModule } from '../../../../app.module';
import { routes } from '../../../../app-routes.module';
import { APP_BASE_HREF } from '@angular/common';

describe('PositionComponent', () => {
    let component: PositionComponent;
    let fixture: ComponentFixture<PositionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{provide: APP_BASE_HREF, useValue : '/' }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PositionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

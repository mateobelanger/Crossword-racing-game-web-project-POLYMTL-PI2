import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { ValidationMediatorService } from '../validation-mediator.service';
import { DefinitionsService } from '../definitions.service';
import { DefinitionsComponent } from './definitions.component';
import { routes } from '../../app-routes.module';
import { AppModule } from '../../app.module';

describe('DefinitionsComponent', () => {
    let component: DefinitionsComponent;
    let fixture: ComponentFixture<DefinitionsComponent>;

    beforeEach(async(() => {
        // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
        imports: [routes, AppModule],
        providers: [ValidationMediatorService, DefinitionsService, {provide: APP_BASE_HREF, useValue : '/' }]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

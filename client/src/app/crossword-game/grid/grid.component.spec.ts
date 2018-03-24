import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { GridComponent } from './grid.component';
import { FormsModule } from '@angular/forms';
import { GridService } from "../grid.service";
import { routes } from '../../app-routes.module';
import { AppModule } from '../../app.module';
import { ValidatorService } from '../validator.service';

describe('GridComponent', () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;

    beforeEach(async(() => {
        // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
            imports: [routes, AppModule, FormsModule],
            providers: [GridService, ValidatorService, {provide: APP_BASE_HREF, useValue : '/' }]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

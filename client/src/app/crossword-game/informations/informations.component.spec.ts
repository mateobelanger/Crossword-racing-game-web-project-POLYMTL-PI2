import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationsComponent } from './informations.component';
import { routes } from '../../app-routes.module';

describe('InformationsComponent', () => {
    let component: InformationsComponent;
    let fixture: ComponentFixture<InformationsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ InformationsComponent ],
        imports: [ routes ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

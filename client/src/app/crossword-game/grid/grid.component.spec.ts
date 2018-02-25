import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridComponent } from './grid.component';
import { FormsModule } from '@angular/forms';
import { WordService } from '../word.service';

describe('GridComponent', () => {
    let component: GridComponent;
    let fixture: ComponentFixture<GridComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [ GridComponent ],
        imports: [ FormsModule ],
        providers: [WordService]
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

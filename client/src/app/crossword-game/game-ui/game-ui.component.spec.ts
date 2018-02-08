import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameUiComponent } from './game-ui.component';
import { InformationsComponent } from '../informations/informations.component';
import { GridComponent } from '../grid/grid.component';
import { DefinitionsComponent } from '../definitions/definitions.component';
import { FormsModule } from '@angular/forms';
import { routes } from '../../app-routes.module';

describe('GameUiComponent', () => {
    let component: GameUiComponent;
    let fixture: ComponentFixture<GameUiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            GameUiComponent,
            InformationsComponent,
            GridComponent,
            DefinitionsComponent
        ],
        imports: [ FormsModule, routes ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameUiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

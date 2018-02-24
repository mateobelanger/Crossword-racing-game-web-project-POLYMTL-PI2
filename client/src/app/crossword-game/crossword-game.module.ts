import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CrosswordGameComponent } from './crossword-game.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { GameUiComponent } from './game-ui/game-ui.component';
import { GridComponent } from './grid/grid.component';
import { DefinitionsComponent } from './definitions/definitions.component';
import { routes } from '../app-routes.module';
import { InformationsComponent } from './informations/informations.component';
import { WordService } from './word.service';
import { InputValidationService } from './input-validation.service';
import { GridService } from './grid.service';
import { DefinitionsService } from './definitions.service';
import { SelectionMediatorService } from './selection-mediator.service';

@NgModule({
    imports: [
        CommonModule,
        routes,
        FormsModule
    ],
    declarations: [
        CrosswordGameComponent,
        ConfigurationComponent,
        GameUiComponent,
        GridComponent,
        DefinitionsComponent,
        InformationsComponent
    ],

    providers: [
        WordService,
        InputValidationService,
        GridService,
        DefinitionsService,
        SelectionMediatorService
    ],

    exports: [
        CrosswordGameComponent
    ]


})
export class CrosswordGameModule { }

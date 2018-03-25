import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routes } from '../app-routes.module';

import { CrosswordGameComponent } from './crossword-game.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { GameUiComponent } from './game-ui/game-ui.component';
import { GridComponent } from './grid/grid.component';
import { DefinitionsComponent } from './definitions/definitions.component';
import { InformationsComponent } from './informations/informations.component';

import { WordService } from './word.service';
import { GridService } from './grid.service';
import { ValidatorService } from './validator.service';
import { EndOfGameModalComponent } from './end-of-game-modal/end-of-game-modal.component';


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
        InformationsComponent,
        EndOfGameModalComponent
    ],

    providers: [
        WordService,
        GridService,
        ValidatorService
    ],

    exports: [
        CrosswordGameComponent
    ]


})
export class CrosswordGameModule { }

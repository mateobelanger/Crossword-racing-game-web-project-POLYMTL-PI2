import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CrosswordGameComponent } from './crossword-game.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { GameUiComponent } from './game-ui/game-ui.component';
import { GridComponent } from './grid/grid.component';
import { DefinitionsComponent } from './definitions/definitions.component';
import { routes } from '../app-routes.module';

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
    DefinitionsComponent
  ],

  exports: [
    CrosswordGameComponent,
  ]


})
export class CrosswordGameModule { }

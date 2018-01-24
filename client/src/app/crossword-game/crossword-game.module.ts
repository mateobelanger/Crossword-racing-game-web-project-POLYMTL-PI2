import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrosswordGameComponent } from './crossword-game.component';
import { ConfigurationComponent } from './configuration/configuration.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CrosswordGameComponent,
    ConfigurationComponent,
  ],

  exports: [
    CrosswordGameComponent,
  ]


})
export class CrosswordGameModule { }

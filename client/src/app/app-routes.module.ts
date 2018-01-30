import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule} from '@angular/router';

import { HomepageComponent } from './homepage/homepage.component';
import { CrosswordGameComponent } from './crossword-game/crossword-game.component';
import { GameUiComponent } from './crossword-game/game-ui/game-ui.component';
import { RacingGameComponent } from './racing-game/racing-game.component';


import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';


export const appRoutes: Routes = [
  { path : '', redirectTo: 'homepage', pathMatch: 'full' },
  { path : 'homepage', component: HomepageComponent },
  { path : 'crossword-game', component: CrosswordGameComponent },
  { path : 'crossword-game/:difficulty/ui', component: GameUiComponent },
  { path : 'racing-game', component: RacingGameComponent },

];

export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes);


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [

  ],
  declarations: []
})
export class AppRoutesModule { }


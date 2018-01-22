import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";


import { RacingGameComponent } from './racing-game.component';
import { GameComponent } from "./game-component/game.component";
import { RenderService } from "./render-service/render.service";
import { BasicService } from "./basic.service";

@NgModule({
  
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule
  ],

  declarations: [
    RacingGameComponent,
    GameComponent
  ],
  
  exports: [
    RacingGameComponent,
  ],

  providers: [
    RenderService,
    BasicService
  ],

})
export class RacingGameModule { }

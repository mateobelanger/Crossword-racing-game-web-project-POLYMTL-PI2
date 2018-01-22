import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from '@angular/router';

import { AppComponent } from "./app.component";
import { GameComponent } from "./racing-game/game-component/game.component";

import { RenderService } from "./racing-game/render-service/render.service";
import { BasicService } from "./racing-game/basic.service";

import { HomepageComponent } from './homepage/homepage.component'
import { CrosswordGameComponent } from './crossword-game/crossword-game.component';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { AdminComponent } from './admin/admin.component';

import { routes } from './app-routes.module'





@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        HomepageComponent,
        CrosswordGameComponent,
        RacingGameComponent,
        AdminComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        routes
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

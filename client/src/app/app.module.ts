import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { GameComponent } from "./racing-game/game-component/game.component";

import { RenderService } from "./racing-game/render-service/render.service";
import { BasicService } from "./racing-game/basic.service";
import { CrosswordGameComponent } from './crossword-game/crossword-game.component';
import { RacingGameComponent } from './racing-game/racing-game.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
    declarations: [
        AppComponent,
        GameComponent,
        CrosswordGameComponent,
        RacingGameComponent,
        HomepageComponent,
        AdminComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        RenderService,
        BasicService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

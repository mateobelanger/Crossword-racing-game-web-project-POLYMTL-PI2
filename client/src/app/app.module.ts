import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";


import { AppComponent } from "./app.component";



// Module
import { HomepageModule} from './homepage/homepage.module';
import { CrosswordGameModule} from './crossword-game/crossword-game.module';
import { RacingGameModule} from './racing-game/racing-game.module';



// Routing
import { routes } from './app-routes.module';


@NgModule({
    declarations: [
        AppComponent,

    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        routes,
        HomepageModule,
        CrosswordGameModule,
        RacingGameModule,

    ],
    providers: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

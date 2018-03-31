import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
// Modules
import { HomepageModule } from "./homepage/homepage.module";
import { CrosswordGameModule } from "./crossword-game/crossword-game.module";
import { TronRacingGameModule } from "./tron-racing-game/tron-racing-game.module";
import { AdminModule } from "./tron-racing-game/admin/admin.module";

// Routing
import { routes } from "./app-routes.module";

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
        TronRacingGameModule,
        AdminModule

    ],
    providers: [ ],
    bootstrap: [AppComponent]
})
export class AppModule { }

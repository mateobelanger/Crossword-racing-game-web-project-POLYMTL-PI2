import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModuleWithProviders } from "@angular/core/src/metadata/ng_module";
import { Routes, RouterModule} from "@angular/router";

import { HomepageComponent } from "./homepage/homepage.component";
import { SoloConfigurationComponent } from "./crossword-game/configuration/solo-configuration/solo-configuration.component";
import { GameUiComponent } from "./crossword-game/game-ui/game-ui.component";
import { TrackListComponent } from "./tron-racing-game/track-list.component";
import { AdminComponent } from "./tron-racing-game/admin/admin.component";

import { GameFrameComponent } from "./tron-racing-game/game-frame/game-frame.component";
import { HomeComponent } from "./crossword-game/home/home.component";
// tslint:disable-next-line:max-line-length
import { MultiplayerConfigurationComponent } from "./crossword-game/configuration/multiplayer-configuration/multiplayer-configuration.component";
import { LobbyComponent } from "./crossword-game/lobby/lobby.component";
import { TrackEditorUiComponent } from "./tron-racing-game/admin/track-editor-ui/track-editor-ui.component";

export const appRoutes: Routes = [
  { path : "", redirectTo: "homepage", pathMatch: "full" },
  { path : "homepage", component: HomepageComponent },
  { path : "crossword-game", component: HomeComponent},
  { path : "crossword-game/create-multiplayer-game", component: MultiplayerConfigurationComponent},
  { path : "crossword-game/lobby", component: LobbyComponent},
  { path : "crossword-game/selectDifficulty", component: SoloConfigurationComponent },
  { path : "crossword-game/:difficulty/ui", component: GameUiComponent },
  { path : "racing-game", component: TrackListComponent },
  { path : "admin", component: AdminComponent },
  { path : "admin/track-editor/:trackName", component: TrackEditorUiComponent },
  { path : "racing-game-scene/:trackName/:difficulty", component: GameFrameComponent },
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

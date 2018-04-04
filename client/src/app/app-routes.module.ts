import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ModuleWithProviders } from "@angular/core/src/metadata/ng_module";
import { Routes, RouterModule} from "@angular/router";

import { HomepageComponent } from "./homepage/homepage.component";
import { CrosswordGameComponent } from "./crossword-game/crossword-game.component";
import { GameUiComponent } from "./crossword-game/game-ui/game-ui.component";
import { RacingGameComponent } from "./racing-game/racing-game.component";
import { AdminComponent } from "./admin/admin.component";

import { TrackEditorUiComponent } from "./admin/track-editor-ui/track-editor-ui.component";
import { RacingGameSceneComponent } from "./racing-game/racing-game-scene/racing-game-scene.component";
import { HostConfigurationComponent } from "./crossword-game/host-configuration/host-configuration.component";
import { CreateOnlineGameComponent } from "./crossword-game/create-online-game/create-online-game.component";
import { LobbyComponent } from "./crossword-game/lobby/lobby.component";


export const appRoutes: Routes = [
  { path : "", redirectTo: "homepage", pathMatch: "full" },
  { path : "homepage", component: HomepageComponent },
  { path : "crossword-game", component: HostConfigurationComponent},
  { path : "crossword-game/online/create-online-game", component: CreateOnlineGameComponent},
  { path : "crossword-game/online/lobby", component: LobbyComponent},
  { path : "crossword-game/selectDifficulty", component: CrosswordGameComponent },
  { path : "crossword-game/:difficulty/ui", component: GameUiComponent },
  { path : "racing-game", component: RacingGameComponent },
  { path : "admin", component: AdminComponent },
  { path : "admin/track-editor/:trackName", component: TrackEditorUiComponent },
  { path : "racing-game-scene/:trackName", component: RacingGameSceneComponent },
  { path : "racing-game-scene", component: RacingGameSceneComponent } // TODO : *a retirer avant la remise**
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


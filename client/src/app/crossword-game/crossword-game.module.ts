import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { routes } from "../app-routes.module";

import { SoloConfigurationComponent } from "./configuration/soloConfiguration/soloConfiguration.component";
import { GameUiComponent } from "./game-ui/game-ui.component";
import { GridComponent } from "./grid/grid.component";
import { DefinitionsComponent } from "./definitions/definitions.component";
import { InformationsComponent } from "./informations/informations.component";

import { WordService } from "./word.service";
import { EndOfGameModalComponent } from "./end-of-game-modal/end-of-game-modal.component";
import { HostConfigurationComponent } from "./host-configuration/host-configuration.component";
import { GameStateService } from "./game-state.service";
import { SocketService } from "./socket.service";
import { LobbyComponent } from "./lobby/lobby.component";
import { LobbyService } from "./lobby/lobby.service";
import { OnlineConfigurationComponent } from "./configuration/onlineConfiguration/onlineConfiguration.component";
import { DifficultyConfigurationComponent } from "./configuration/difficultyConfiguration/difficultyConfiguration.component";
import { SelectionService } from "./selection/selection.service";
import { SelectionStateService } from "./selection-state/selection-state.service";


@NgModule({
    imports: [
        CommonModule,
        routes,
        FormsModule
    ],
    declarations: [
        SoloConfigurationComponent,
        GameUiComponent,
        GridComponent,
        DefinitionsComponent,
        InformationsComponent,
        EndOfGameModalComponent,
        HostConfigurationComponent,
        LobbyComponent,
        OnlineConfigurationComponent,
        DifficultyConfigurationComponent
    ],

    providers: [
        WordService,
        GameStateService,
        SocketService,
        LobbyService,
        SelectionService,
        SelectionStateService
    ],

    exports: [
    ]


})
export class CrosswordGameModule { }

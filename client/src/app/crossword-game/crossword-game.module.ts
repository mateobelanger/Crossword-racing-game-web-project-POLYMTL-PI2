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
import { GridService } from "./grid.service";
import { ValidatorService } from "./validator.service";
import { EndOfGameModalComponent } from "./end-of-game-modal/end-of-game-modal.component";
import { HostConfigurationComponent } from "./host-configuration/host-configuration.component";
import { ConfigurationHandlerService } from "./configuration-handler.service";
import { SocketService } from "./socket.service";
import { LobbyComponent } from "./lobby/lobby.component";
import { LobbyService } from "./lobby/lobby.service";
import { OnlineConfigurationComponent } from "./configuration/onlineConfiguration/onlineConfiguration.component";
import { DifficultyConfigurationComponent } from "./configuration/difficultyConfiguration/difficultyConfiguration.component";


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
        GridService,
        ValidatorService,
        ConfigurationHandlerService,
        SocketService,
        LobbyService
    ],

    exports: [
    ]


})
export class CrosswordGameModule { }

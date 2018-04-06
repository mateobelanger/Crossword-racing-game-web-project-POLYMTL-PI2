import { Component } from "@angular/core";
import { ConfigurationHandlerService } from "../../configuration-handler.service";
import { Difficulty } from "../../../../../../common/constants";

@Component({
    selector: "app-crossword-game",
    templateUrl: "./soloConfiguration.component.html",
    styleUrls: ["./soloConfiguration.component.css"]
})
export class SoloConfigurationComponent {

    public constructor(private configurationHandlerService: ConfigurationHandlerService) {
        configurationHandlerService.difficulty = null;
    }

    public get difficulty(): Difficulty {
        return this.configurationHandlerService.difficulty;
    }

}

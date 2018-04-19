import { Injectable } from "@angular/core";
import { SkyboxService } from "../skybox.service";
import { SceneLightsService } from "../scene-lights/scene-lights.service";
import { LandService } from "../land.service";

@Injectable()
export class SceneLoaderService {

    private scene: THREE.Scene;

    public constructor(private _skyboxService: SkyboxService,
                       private _sceneLightsService: SceneLightsService,
                       private _landService: LandService) { }

    public initialize(scene: THREE.Scene): void {
        this.scene = scene;
        this.generateScene();
    }

    private generateScene(): void {
        this._skyboxService.initialize(this.scene);
        this._sceneLightsService.initialize(this.scene);
        this._landService.initialize(this.scene);
    }

    public updateScene(): void {
        this._skyboxService.updateScene();
        this._sceneLightsService.updateScene();
    }

}

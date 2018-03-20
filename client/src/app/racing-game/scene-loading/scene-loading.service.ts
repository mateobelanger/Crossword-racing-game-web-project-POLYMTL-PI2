import { Injectable } from '@angular/core';
import { SkyboxService } from '../skybox.service';
import { SceneLightsService } from '../scene-lights/scene-lights.service';

//export enum SceneState { DAY, NIGHT }

@Injectable()
export class SceneLoadingService {

    private scene: THREE.Scene;
    // private sceneState: SceneState;

    public constructor(private skyboxService: SkyboxService,
                       private sceneLightsService: SceneLightsService) {
        //this.scene = null;
        //this.sceneState = SceneState.DAY;
    }

    public initialize(scene: THREE.Scene): void {
        this.scene = scene;
        this.generateScene();
    }

    /*
    public changeState(): void {
        this.sceneState = this.sceneState === SceneState.DAY ? SceneState.NIGHT : SceneState.DAY;
        this.updateScene();
    }*/

    private generateScene(): void {
        this.skyboxService.initialize(this.scene);
        this.sceneLightsService.initialize(this.scene);
    }

    /*
    private updateScene(): void {
        this.skyboxService.initialize(this.scene, this.sceneState);
        this.sceneLightsService.updateLights(this.sceneState);
    }*/

}

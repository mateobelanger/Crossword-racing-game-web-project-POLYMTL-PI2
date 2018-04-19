import * as THREE from "three";

const NUMBER_OF_SEGMENTS: number = 32;
const INITIAL_SCALE_SIZE: number = 5;
const NO_RESCALE: number = 1;
const INTERVAL: number = 100;
const MIN_SPHERE_RADIUS: number = 1;
const MAX_SPHERE_RADIUS: number = 12;
const PORTAL_PATH: string = "../../../../assets/portal/glow.png";

export class Portal {

    private _sphereRadius: number;
    private _spriteRadius: number;
    private _sphericalMesh: THREE.Mesh;
    private _sprite: THREE.Sprite;

    public constructor(private _scene: THREE.Scene) {
        this._sphereRadius = MIN_SPHERE_RADIUS;
        this._spriteRadius = INITIAL_SCALE_SIZE;
        this._sphericalMesh = new THREE.Mesh();
        this._sprite = new THREE.Sprite();
    }

    public async portalAnimation(): Promise<void> {
        await this.growPortal();
        await this.shrinkPortal();
    }

    public createPortal(position: THREE.Vector3): void {
        this.createSphere(position);
        this.createGlowEffect();
    }

    public destroyPortal(): void {
        this._scene.remove(this._sphericalMesh);
    }

    public async growPortal(): Promise<{}> {
        return new Promise( (resolve, reject) => {
            const id: number = window.setInterval(() => {
                this.grow();
                if ( this._sphereRadius >= MAX_SPHERE_RADIUS) {
                    window.clearInterval(id);
                    resolve();
                }
            },                                    INTERVAL);

        });
    }

    private grow(): void {
        this._sphereRadius++;
        this._sphericalMesh.scale.set(this._sphereRadius, this._sphereRadius, this._sphereRadius);
    }

    public async shrinkPortal(): Promise<{}> {
        return new Promise( (resolve, reject) => {
            const id: number = window.setInterval(() => {
                if ( this._sphereRadius <= MIN_SPHERE_RADIUS) {
                    window.clearInterval(id);
                    resolve();
                } else {
                    this.shrink();
                }
            },                                    INTERVAL);
        });
    }

    private shrink(): void {
        this._sphereRadius--;
        this._sphericalMesh.scale.set(this._sphereRadius, this._sphereRadius, this._sphereRadius);
    }

    private createSphere( position: THREE.Vector3 ): void {
        const geometry: THREE.SphereGeometry = new THREE.SphereGeometry( this._sphereRadius, NUMBER_OF_SEGMENTS, NUMBER_OF_SEGMENTS );
        const material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial( { color: 0x000088 } );
        this._sphericalMesh = new THREE.Mesh( geometry, material );
        this._sphericalMesh.position.set(position.x, position.y, position.z);
        this._scene.add(this._sphericalMesh);
    }

    private createGlowEffect( ): void {
        const texture: THREE.Texture = new THREE.TextureLoader().load(PORTAL_PATH);

        const spriteMaterial: THREE.SpriteMaterial = new THREE.SpriteMaterial({
            map: texture, color: 0x0000FF, transparent: false, blending: THREE.AdditiveBlending
        });
        this._sprite = new THREE.Sprite( spriteMaterial );
        this._sprite.scale.set(this._spriteRadius, this._spriteRadius, NO_RESCALE);
        this._sphericalMesh.add(this._sprite);
    }

}

import * as THREE from "three";

const NUMBER_OF_SEGMENTS: number = 32;
const INITIAL_SCALE_SIZE: number = 5;
const NO_RESCALE: number = 1;
const INTERVAL: number = 100;
const MIN_SPHERE_RADIUS: number = 1;
const MAX_SPHERE_RADIUS: number = 12;

export class Portal {

    private sphereRadius: number;
    private spriteRadius: number;
    private sphericalMesh: THREE.Mesh;
    private sprite: THREE.Sprite;

    public constructor(private _scene: THREE.Scene) {
        this.sphereRadius = MIN_SPHERE_RADIUS;
        this.spriteRadius = INITIAL_SCALE_SIZE;
        this.sphericalMesh = new THREE.Mesh();
        this.sprite = new THREE.Sprite();
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
        this._scene.remove(this.sphericalMesh);
    }

    public async growPortal(): Promise<{}> {
        return new Promise( (resolve, reject) => {
            const id: number = window.setInterval(() => {
                this.grow();
                if ( this.sphereRadius >= MAX_SPHERE_RADIUS) {
                    window.clearInterval(id);
                    resolve();
                }
            },                                    INTERVAL);

        });
    }

    private grow(): void {
        this.sphereRadius++;
        this.sphericalMesh.scale.set(this.sphereRadius, this.sphereRadius, this.sphereRadius);
    }

    public async shrinkPortal(): Promise<{}> {
        return new Promise( (resolve, reject) => {
            const id: number = window.setInterval(() => {
                if ( this.sphereRadius <= MIN_SPHERE_RADIUS) {
                    window.clearInterval(id);
                    resolve();
                } else {
                    this.shrink();
                }
            },                                    INTERVAL);
        });
    }

    private shrink(): void {
        this.sphereRadius--;
        this.sphericalMesh.scale.set(this.sphereRadius, this.sphereRadius, this.sphereRadius);
    }

    private createSphere( position: THREE.Vector3 ): void {
        const geometry: THREE.SphereGeometry = new THREE.SphereGeometry( this.sphereRadius, NUMBER_OF_SEGMENTS, NUMBER_OF_SEGMENTS );
        const material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial( { color: 0x000088 } );
        this.sphericalMesh = new THREE.Mesh( geometry, material );
        this.sphericalMesh.position.set(position.x, position.y, position.z);
        this._scene.add(this.sphericalMesh);
    }

    private createGlowEffect( ): void {
        const texture: THREE.Texture = new THREE.TextureLoader().load("../../../../assets/portal/glow.png");

        const spriteMaterial: THREE.SpriteMaterial = new THREE.SpriteMaterial({
            map: texture, color: 0x0000FF, transparent: false, blending: THREE.AdditiveBlending
        });
        this.sprite = new THREE.Sprite( spriteMaterial );
        this.sprite.scale.set(this.spriteRadius, this.spriteRadius, NO_RESCALE);
        this.sphericalMesh.add(this.sprite);
    }

}

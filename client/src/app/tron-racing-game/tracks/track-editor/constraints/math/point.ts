import * as THREE from "three";

export  class Point {

    private readonly _x: number = 0;

    private readonly _y: number = 0;

    public constructor(point3d: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) {
        this._x = point3d.x;
        this._y = point3d.y;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }
}

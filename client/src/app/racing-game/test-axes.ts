import { Mesh, BoxGeometry, MeshBasicMaterial} from "three";

const INITIAL_POSITION: number = 1;
const AXE_POSITION: number = 5;
const AXE_PROJECTION: number = 10;

export class TestAxes {
    // AXES
    private boxAxeX: Mesh;
    private boxAxeY: Mesh;
    private boxAxeZ: Mesh;

    public createBoxAxes(): void {
        // BLEU : X
        this.boxAxeX = new Mesh(
            new BoxGeometry(AXE_PROJECTION, INITIAL_POSITION, INITIAL_POSITION),
            new MeshBasicMaterial({color: 0x0000FF})
        );
        this.boxAxeX.position.x = AXE_POSITION;
        // VERT : Y
        this.boxAxeY = new Mesh(
            new BoxGeometry(INITIAL_POSITION , AXE_PROJECTION, INITIAL_POSITION),
            new MeshBasicMaterial({color: 0x00FF00})
        );
        this.boxAxeY.position.y = AXE_POSITION;

        // ROUGE : Z
        this.boxAxeZ = new Mesh(
            new BoxGeometry(INITIAL_POSITION, INITIAL_POSITION, AXE_PROJECTION),
            new MeshBasicMaterial({color: 0xFF0000})
        );
        this.boxAxeZ.position.z = AXE_POSITION;
    }

    public getBoxAxeX(): Mesh {
        return this.boxAxeX;
    }
    public getBoxAxeY(): Mesh {
        return this.boxAxeY;
    }
    public getBoxAxeZ(): Mesh {
        return this.boxAxeZ;
    }

}


/* tslint:disable: no-suspicious-comment
    //TODO: ROMOVE : TEST_AXES
    private axes: TestAxes;

    //TODO: ROMOVE : TEST_AXES
    this.axes = new TestAxes;

    //TODO: ROMOVE : TEST_AXES
    this.axes.createBoxAxes();
    this.scene.add(this.axes.getBoxAxeX());
    this.scene.add(this.axes.getBoxAxeY());
    this.scene.add(this.axes.getBoxAxeZ());
*/

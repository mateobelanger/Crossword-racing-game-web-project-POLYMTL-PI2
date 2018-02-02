import {Waypoint} from './waypoint';
import * as THREE from 'three';

export class Track 
{
    public constructor(private waypoints : Waypoint[] = []){
    }

    public getWaypoints() : Waypoint[]{
        return this.waypoints;
    }

    public getWaypoint(CircleId: number): Waypoint{
        const index: number = this.findWaypointIndex(CircleId);
        if(index !== -1)
            return this.waypoints[index];
        return null;
    }

    public addWaypoint(wayPoint : Waypoint){
        this.waypoints.push(wayPoint);
    }

    /*TODO : Ajouté temporairement pour tes */ 
    public addWaypointEvent(event : MouseEvent){
        let vectorTemp = new THREE.Vector3(event.layerX, event.layerY, 0 );
        let wayPointTemp = new Waypoint();
        wayPointTemp.setPosition(vectorTemp);
        this.waypoints.push(wayPointTemp);
    }

    /*TODO : Ajouté temporairement pour tes */ 
    public addWaypointWithMouse(position : THREE.Vector2){
        let vectorTemp = new THREE.Vector3();
        vectorTemp.x = position.x;
        vectorTemp.y = position.y;
        vectorTemp.z = 0; 
        let wayPointTemp = new Waypoint();
        wayPointTemp.setPosition(vectorTemp);
        this.waypoints.push(wayPointTemp);
    }

    public removeWaypoint() : Waypoint {
        return this.waypoints.pop()
    }

    private findWaypointIndex(id : number): number {
        let index : number = -1;
        this.waypoints.forEach((element, i) => {
            if(element.getCircleId() === id)
                index = i;
        });
        return index;
    }
}
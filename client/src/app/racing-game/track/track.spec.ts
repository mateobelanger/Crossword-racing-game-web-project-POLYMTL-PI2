import {Track} from "./track";
import { Vector3 } from "three";
 
describe("Track", () => {
    let waypoints : Vector3[] = [];
    let track: Track;
 
    beforeEach( () => {
        for (let i: number = 0; i < 10 ; i++) 
            waypoints.push(new Vector3(i * 10, 0, 0));
        track = new Track(waypoints);
    });
 
    afterEach(() => {
        waypoints = []
        track = undefined;
    });
 
    it("default constructor", ()=>{
        let aTrack: Track = new Track();
        expect(aTrack).toBeDefined();
        expect(aTrack.getWaypoints().length).toBe(0);
    });

    it("constructor with parameters", ()=>{   
        expect(track).toBeDefined();
        expect(track.getWaypoints()).toBe(waypoints);      
    });
 
    it("addWayPoint", () => {
        let waypoint: Vector3 = new Vector3 (1,1,1);
        track.addWaypoint(waypoint);
        waypoints.push(waypoint);
        expect(track.getWaypoints()).toBe(waypoints);
    });

    it("removeLSastWayPoint", () => {
        expect(track.getWaypoints().length).toBe(10);
        track.removeLastWaypoint();
        expect(track.getWaypoints().length).toBe(9);
    });
 
    it("modifyWayPointPosition", () => {
        track.modifyWaypointPosition(2, new Vector3(0,5,0));
        expect(track.getWaypoint(2).y).toBe(5);
    });
});
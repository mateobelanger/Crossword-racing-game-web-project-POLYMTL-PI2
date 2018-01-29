import {Track} from "./track";
import { Vector3 } from "three";
import { Waypoint} from './waypoint';
 
describe("Track", () => {
    let Waypoints : Waypoint[] = [];
    let track: Track;
 
    beforeEach( () => {
        for (let i: number = 0; i < 10 ; i++) 
        Waypoints.push(new Waypoint(new Vector3(i * 10, 0, 0), i));
        track = new Track(Waypoints);
    });
 
    afterEach(() => {
        Waypoints = []
        track = undefined;
    });
 
    it("default constructor", ()=>{
        let aTrack: Track = new Track();
        expect(aTrack).toBeDefined();
        expect(aTrack.getWaypoints().length).toBe(0);
    });

    it("constructor with parameters", ()=>{   
        expect(track).toBeDefined();
        expect(track.getWaypoints()).toBe(Waypoints);      
    });
 
    it("addWaypoint", () => {
        let waypoint: Waypoint = new Waypoint( new Vector3 (1,1,1), 100)
        track.addWaypoint(waypoint);
        Waypoints.push(waypoint);
        expect(track.getWaypoint(100)).toBe(waypoint);
    });

    it("removeWaypoint", () => {
        expect(track.getWaypoints().length).toBe(10);
        track.removeWaypoint(1);
        expect(track.getWaypoints().length).toBe(9);
        //checking if the right one has been removed
        track.removeWaypoint(1);
        expect(track.getWaypoints().length).toBe(9);
    });
 
    it("modifyWaypointPosition", () => {
        track.modifyWaypointPosition(2, new Vector3(0,5,0));
        expect(track.getWaypoint(2).getPosition().y).toBe(5);
    });
});
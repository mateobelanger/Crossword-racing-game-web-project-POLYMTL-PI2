import {Track} from "./track";
import { Vector3 } from "three";
import { Waypoint} from './waypoint';
 
describe("Track", () => {
    let waypoints : Waypoint[] = [];
    let track: Track;
 
    beforeEach( () => {
        for (let i: number = 0; i < 10 ; i++) {
            let waypoint : Waypoint = new Waypoint(new Vector3(i * 10, 0, 0));
            waypoint.bindCircle(i);//mock circleId
            waypoints.push(waypoint);
        }
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
 
    it("getWaypoints should return array of waypoint", ()=>{
        expect(track.getWaypoints()).toBeDefined();
        expect(track.getWaypoints().length).toBe(10);
    });

    it("getWaypoint should return matching circle id waypoint", ()=>{
        expect(track.getWaypoint(2)).toBeDefined();
        expect(track.getWaypoint(2).getPosition()).toEqual(new Vector3(20, 0, 0));
    });

    it("addWaypoint", () => {
        let waypoint: Waypoint = new Waypoint( new Vector3 (1,1,1));
        waypoint.bindCircle(10);//mock circle id
        track.addWaypoint(waypoint);
        waypoints.push(waypoint);
        expect(track.getWaypoint(10)).toBe(waypoint);
    });

    it("removeWaypoint", () => {
        expect(track.getWaypoints().length).toBe(10);
        track.removeWaypoint();
        expect(track.getWaypoints().length).toBe(9);
    });
 
    it("modifyWaypointPosition", () => {
        track.modifyWaypointPosition(2, new Vector3(0,5,0));
        expect(track.getWaypoint(2).getPosition().y).toBe(5);
    });

    
});
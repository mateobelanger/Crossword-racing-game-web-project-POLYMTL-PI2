import {Track} from "./track";
import { Vector3 } from "three";
import { WayPoint} from './wayPoint';

describe("Track", () => {
    let wayPoints : WayPoint[] = [];
    let track: Track;

    beforeEach( () => {
        for (let i: number = 0; i < 10 ; i++) 
        wayPoints.push(new WayPoint(new Vector3(i * 10, 0, 0), i));
        track = new Track(wayPoints);
    });

    afterEach(() => {
        wayPoints = []
        track = undefined;
    });

    it("default constructor", ()=>{
        let aTrack: Track = new Track();
        expect(aTrack).toBeDefined();
        expect(aTrack.getWayPoints().length).toBe(0);
    });

    it("constructor with parameters", ()=>{   
        expect(track).toBeDefined();
        expect(track.getWayPoints()).toBe(wayPoints);      
    });

    it("addWayPoint", () => {
        let waypoint: WayPoint = new WayPoint( new Vector3 (1,1,1), 100)
        track.addWayPoint(waypoint);
        wayPoints.push(waypoint);
        expect(track.getWayPoints()).toBe(wayPoints);
    });

    it("removeWayPoint", () => {
        expect(track.getWayPoints().length).toBe(10);
        track.removeWayPoint(1);
        expect(track.getWayPoints().length).toBe(9);
        //checking if the right one has been removed
        track.removeWayPoint(1);
        expect(track.getWayPoints().length).toBe(9);
    });

    it("modifyWayPointPosition", () => {
        track.modifyWayPointPosition(2, new Vector3(0,5,0));
        expect(track.getWaypoint(2).getPosition().y).toBe(5);
    });
});
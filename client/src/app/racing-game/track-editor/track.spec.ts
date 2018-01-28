import {Track} from "./track";
import { Vector3 } from "three";

describe("Track", () => {
    let dots : Vector3[] = [];
    let track: Track;

    beforeEach( () => {
        for (let i: number = 0; i < 10 ; i++) 
            dots.push(new Vector3(i * 10, 0, 0));
        track = new Track(dots);
    });

    afterEach(() => {
        dots = []
        track = undefined;
    });

    it("should be instantiable using default constructor", ()=>{
        let aTrack: Track = new Track();
        expect(aTrack).toBeDefined();
        expect(aTrack.getWayPoints().length).toBe(0);
    });

    it("should be instantiable using constructor with parameters", ()=>{   
        expect(track).toBeDefined();
        expect(track.getWayPoints()).toBe(dots);      
    });

    it("should add an element", () => {
        track.addWayPoint(new Vector3 (1,1,1));
        dots.push(new Vector3 (1,1,1));
        expect(track.getWayPoints()).toBe(dots);
    });

    it("should be able to remove an element", () => {
        expect(track.getWayPoints().length).toBe(10);
        track.removeWayPoint(new Vector3(50,0,0));
        expect(track.getWayPoints().length).toBe(9);

        //checking if the right one has been removed
        track.removeWayPoint(new Vector3(50,0,0));
        expect(track.getWayPoints().length).toBe(9);
    });
});
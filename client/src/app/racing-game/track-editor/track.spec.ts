import {Track} from "./track";
import { Vector3 } from "three";

describe("Track", () => {
    let dots : Vector3[];
    let track: Track;

    beforeEach( () => {
        for (let i: number = 0; i < 10 ; i++) 
            dots.push(new Vector3(i * 10, 0, 0));
        track = new Track(dots);
    });

    afterEach(() => {
        dots.length = 0;
        track = undefined;
    });

    it("should be instantiable using default constructor", ()=>{
        let aTrack: Track = new Track();
        expect(aTrack).toBeDefined();
        expect(aTrack.getWayPoints()).toBe([]);
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
        let dotsMinusOne: Vector3[] = [
            new Vector3(0,0,0),
            new Vector3(10,0,0),
            new Vector3(20,0,0),
            new Vector3(30,0,0),
            new Vector3(40,0,0),
            new Vector3(60,0,0),
            new Vector3(70,0,0),
            new Vector3(80,0,0),
            new Vector3(90,0,0),
        ];
        track.removeWayPoint(new Vector3(50,0,0));
        expect(track.getWayPoints).toBe(dotsMinusOne);
    });
});
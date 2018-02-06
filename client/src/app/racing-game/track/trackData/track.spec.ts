import { Track } from "./track";
import { Vector3 } from "three";
import { Waypoint} from './waypoint';

/* tslint:disable: no-magic-numbers */
describe("Track", () => {
    let waypoints: Waypoint[] = [];
    let track: Track;

    beforeEach( () => {
        for (let i: number = 0; i < 10 ; i++) {
            const waypoint: Waypoint = new Waypoint(new Vector3(i * 10, 0, 0));
            waypoint.bindCircle(i);
            waypoints.push(waypoint);
        }
        track = new Track(waypoints);
    });

    afterEach(() => {
        waypoints = [];
        track = undefined;
    });

    it("should be instantiated correctly using default constructor", () => {
        const aTrack: Track = new Track();
        expect(aTrack).toBeDefined();
        expect(aTrack.getWaypoints().length).toBe(0);
    });

    it("should be instantiated correctly when passing parameters", () => {
        expect(track).toBeDefined();
        expect(track.getWaypoints()).toBe(waypoints);
    });

    it("should return array of waypoint with getWaypoints", () => {
        expect(track.getWaypoints()).toBeDefined();
        expect(track.getWaypoints().length).toBe(10);
    });

    it("should return null with getWaypoint", () => {
        expect(track.getWaypoint(100)).toBeNull();
    });

    it("should return matching \"circleId\" waypoint with getWaypoint", () => {
        expect(track.getWaypoint(2)).toBeDefined();
        expect(track.getWaypoint(2).getPosition()).toEqual(new Vector3(20, 0, 0));
    });

    it("should addWaypoint", () => {
        const waypoint: Waypoint = new Waypoint( new Vector3 (1, 1, 1));
        waypoint.bindCircle(10);
        track.addWaypoint(waypoint);
        waypoints.push(waypoint);
        expect(track.getWaypoint(10)).toBe(waypoint);
    });

    it("should removeWaypoint", () => {
        expect(track.getWaypoints().length).toBe(10);
        track.removeWaypoint();
        expect(track.getWaypoints().length).toBe(9);
    });
});

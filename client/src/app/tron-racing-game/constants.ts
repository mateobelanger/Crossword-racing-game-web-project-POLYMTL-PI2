// tslint:disable:no-magic-numbers
// CAR
export const STRAIGHT_ANGLE_DEG: number = 180;
export const DEG_TO_RAD: number = Math.PI / STRAIGHT_ANGLE_DEG;
export const MIN_TO_SEC: number = 60;
export const MS_TO_SECONDS: number = 1000;
export const GRAVITY: number = -9.81;
export const RAD_TO_DEG: number = STRAIGHT_ANGLE_DEG / Math.PI;
export const PI_OVER_2: number = Math.PI / 2;

// TRACK-EDITOR
export const WAYPOINTS_POSITION_Z: number = 10;
export const CIRCLE_POSITION_Z: number = -1;
export const UPPER_PLANE_POSITION_Z: number = -1.05;
export const LOWER_PLANE_POSITION_Z: number = -1.06;
export const BACKGROUND_PLANE_POSITION_Z: number = -3;
export const TRACK_WIDTH: number = 20;
export const BACKGROUND_PLANE: string = "backgroundPlane";
export const POINT: string = "point";
export const EDITOR_LAND_WIDTH: number = 1000;
export const EDITOR_LAND_HEIGHT: number = 800;

// SKYBOX for now & others in the future
export const LAND_WIDTH: number = 1000;
export const LAND_HEIGHT: number = 800;
export const BACKGROUND_PLANE_POSITION_Y: number = -1;

// CONSTRAINTS
export enum PlaneType {VALID_FIRST_PLANE, INVALID_FIRST_PLANE, VALID_PLANE, INVALID_PLANE}

// COLLISIONS
export enum CollisionType {FRONT_CAR_HIT_FROM_LEFT, FRONT_CAR_HIT_FROM_RIGHT, FACE_TO_FACE}

// RACE
export const WAYPOINT_RADIUS: number = 12;
export const USERNAME: string = "user";
export const PLAYERS_NAME: string[] = ["bob1", USERNAME, "bob2", "bob3"];
export const MAX_N_LAPS: number = 3;
export enum VIRTUAL_PLAYER_SKILL {BEGGINER, EXPERT}
export const COUNTDOWN_TIME: number = 3;
export const enum GameState {COUTNDOWN, RACE, END}


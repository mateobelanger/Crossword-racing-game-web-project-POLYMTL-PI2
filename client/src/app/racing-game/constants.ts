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
export const POINTS_POSITION_Z: number = 0;
export const PLANE_POSITION_Z: number = -1;
export const BACKGROUND_PLANE_POSITION_Z: number = -3;
export const TRACKWIDTH: number = 20;
export const BACKGROUND_PLANE: string = "backgroundPlane";
export const POINT: string = "point";
export const EDITOR_LAND_WIDTH: number = 1000;
export const EDITOR_LAND_HEIGHT: number = 800;

// SKYBOX for now & others in the future
export const LAND_WIDTH: number = 500;
export const LAND_HEIGHT: number = 400;
export const BACKGROUND_PLANE_POSITION_Y: number = -3;

// CONSTRAINTS
export enum ErrorType {WIDTHLENGTHRATIO, ANGLE, INTERSECTS}
export enum PlaneType {VALID_FIRST_PLANE, INVALID_FIRST_PLANE, VALID_PLANE, INVALID_PLANE}

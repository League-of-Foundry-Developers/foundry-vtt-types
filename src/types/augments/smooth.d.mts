import type { Brand } from "../helperTypes.d.mts";
import * as graphicsSmooth from "@pixi/graphics-smooth";

type JOINT_TYPE = Brand<number, "PIXI.smooth.JOINT_TYPE">;
declare const JOINT_TYPE: Record<keyof typeof graphicsSmooth.JOINT_TYPE, PIXI.smooth.JOINT_TYPE>;

type LINE_SCALE_MODE = Brand<number, "PIXI.smooth.LINE_SCALE_MODE">;
declare const LINE_SCALE_MODE: Record<keyof typeof graphicsSmooth.LINE_SCALE_MODE, PIXI.smooth.LINE_SCALE_MODE>;

export * from "@pixi/graphics-smooth";
export { JOINT_TYPE, LINE_SCALE_MODE };

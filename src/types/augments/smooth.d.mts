import type { Brand } from "#utils";
import type * as graphicsSmooth from "@pixi/graphics-smooth";

type JOINT_TYPE = Brand<number, "PIXI.smooth.JOINT_TYPE">;
declare const JOINT_TYPE: {
  NONE: 0 & JOINT_TYPE;
  FILL: 1 & JOINT_TYPE;
  JOINT_BEVEL: 4 & JOINT_TYPE;
  JOINT_MITER: 8 & JOINT_TYPE;
  JOINT_ROUND: 12 & JOINT_TYPE;
  JOINT_CAP_BUTT: 16 & JOINT_TYPE;
  JOINT_CAP_SQUARE: 18 & JOINT_TYPE;
  JOINT_CAP_ROUND: 20 & JOINT_TYPE;
  FILL_EXPAND: 24 & JOINT_TYPE;
  CAP_BUTT: 32 & JOINT_TYPE;
  CAP_SQUARE: 64 & JOINT_TYPE;
  CAP_ROUND: 96 & JOINT_TYPE;
  CAP_BUTT2: 128 & JOINT_TYPE;
};

// Members include the library's enum member, since `lineStyle` rejects plain string literals.
type LINE_SCALE_MODE = Brand<string, "PIXI.smooth.LINE_SCALE_MODE">;
declare const LINE_SCALE_MODE: {
  NONE: graphicsSmooth.LINE_SCALE_MODE.NONE & LINE_SCALE_MODE;
  NORMAL: graphicsSmooth.LINE_SCALE_MODE.NORMAL & LINE_SCALE_MODE;
  HORIZONTAL: graphicsSmooth.LINE_SCALE_MODE.HORIZONTAL & LINE_SCALE_MODE;
  VERTICAL: graphicsSmooth.LINE_SCALE_MODE.VERTICAL & LINE_SCALE_MODE;
};

// eslint-disable-next-line
export * from "@pixi/graphics-smooth";
// eslint-disable-next-line
export { JOINT_TYPE, LINE_SCALE_MODE };

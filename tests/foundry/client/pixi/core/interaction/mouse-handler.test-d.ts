import { expectTypeOf } from "vitest";
import type { ValueOf } from "fvtt-types/utils";

() => {
  const myCanvas = new Canvas();

  if (!myCanvas.stage) return;

  const myMouseHandler = new MouseInteractionManager(myCanvas.stage, myCanvas.stage);

  expectTypeOf(myMouseHandler.state).toEqualTypeOf<ValueOf<(typeof MouseInteractionManager)["INTERACTION_STATES"]>>();
};

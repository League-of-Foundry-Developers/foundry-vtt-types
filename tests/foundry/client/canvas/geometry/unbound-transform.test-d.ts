import { expectTypeOf, test } from "vitest";

import UnboundTransform = foundry.canvas.geometry.UnboundTransform;

declare const someTransform: PIXI.Transform;

test("foundry/client/canvas/geometry/unbound-transform", () => {
  expectTypeOf(UnboundTransform.IDENTITY).toEqualTypeOf<UnboundTransform>();

  const myUT = new UnboundTransform();

  expectTypeOf(myUT.updateTransform(someTransform)).toBeVoid();
});

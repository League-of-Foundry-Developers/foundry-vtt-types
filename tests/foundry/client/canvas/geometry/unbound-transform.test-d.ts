import { expectTypeOf } from "vitest";

import UnboundTransform = foundry.canvas.geometry.UnboundTransform;

expectTypeOf(UnboundTransform.IDENTITY).toEqualTypeOf<UnboundTransform>();

const myUT = new UnboundTransform();
declare const someTransform: PIXI.Transform;

expectTypeOf(myUT.updateTransform(someTransform)).toBeVoid();

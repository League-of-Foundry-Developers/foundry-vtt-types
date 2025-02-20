import { expectTypeOf } from "vitest";

class MyRenderFlags extends RenderFlagsMixin(PIXI.Text) {}

const myRenderFlagObject = new MyRenderFlags();

expectTypeOf(myRenderFlagObject.renderFlags.flags.refresh.propagate).toEqualTypeOf<string[] | undefined>();

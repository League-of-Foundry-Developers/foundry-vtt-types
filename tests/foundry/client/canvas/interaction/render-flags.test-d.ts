import { describe, expectTypeOf, test } from "vitest";
import { RenderFlags, RenderFlagsMixin } from "#client/canvas/interaction/_module.mjs";

const validFlags = { someFlag: { propagate: ["otherFlag" as const] }, otherFlag: {} };

declare class MyRenderFlagsUsingObject extends RenderFlagsMixin(PIXI.Text) {
  static override RENDER_FLAGS: typeof validFlags;

  renderFlags: RenderFlags<typeof validFlags>;
}

describe("RenderFlagsMixin tests", () => {
  test("Flags", () => {
    const myRenderFlagObject = new MyRenderFlagsUsingObject();

    expectTypeOf(myRenderFlagObject.renderFlags.flags.someFlag.propagate).toEqualTypeOf<"otherFlag"[]>();
  });
});

describe("RenderFlags tests", () => {
  test("Flags", () => {
    new RenderFlags(validFlags);

    // @ts-expect-error "nonexistant" is not a valid flag.
    new RenderFlags({ someFlag: { propagate: ["nonexistant"] }, otherFlag: {} });

    // @ts-expect-error a flag that propagates to itself doesn't make any sense.
    new RenderFlags({ selfReferential: { propagate: ["selfReferential"] } });
  });
});

import { describe, expectTypeOf, test } from "vitest";

import RenderFlags = foundry.canvas.interaction.RenderFlags;
import RenderFlagsMixin = foundry.canvas.interaction.RenderFlagsMixin;

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
    new RenderFlags();
    const renderFlags = new RenderFlags(validFlags, { object: undefined, priority: "INTERFACE" });

    expectTypeOf(renderFlags.priority).toEqualTypeOf<"OBJECTS" | "INTERFACE" | "PERCEPTION">();
    expectTypeOf(renderFlags.handle("someFlag")).toBeBoolean();
    expectTypeOf(renderFlags.has("someFlag")).toBeBoolean();
    expectTypeOf(renderFlags.delete("someFlag")).toBeBoolean();
    expectTypeOf(renderFlags.set({ someFlag: true, otherFlag: null })).toBeVoid();
    expectTypeOf(renderFlags.clear()).toEqualTypeOf<Partial<Record<"someFlag" | "otherFlag", true>>>();

    renderFlags.add("someFlag");

    // @ts-expect-error "nonexistant" is not a registered flag.
    renderFlags.handle("nonexistant");
    // @ts-expect-error "nonexistant" is not a registered flag.
    renderFlags.set({ nonexistant: true });
    // @ts-expect-error "nonexistant" is not a registered flag.
    renderFlags.add("nonexistant");

    // @ts-expect-error "nonexistant" is not a valid flag.
    new RenderFlags({ someFlag: { propagate: ["nonexistant"] }, otherFlag: {} });

    // @ts-expect-error a flag that propagates to itself doesn't make any sense.
    new RenderFlags({ selfReferential: { propagate: ["selfReferential"] } });

    new RenderFlags({ deprecatedFlag: { deprecated: { since: 14, until: 16 } } });
  });
});

// The shape a subclass declares its `RENDER_FLAGS` in: the `string` index signature inherited from
// `RenderFlagsMixin.RENDER_FLAGS` is not a flag, so it takes no part in validation or key narrowing.
interface DeclaredFlags extends RenderFlagsMixin.RENDER_FLAGS {
  redraw: foundry.canvas.interaction.RenderFlag<this, "redraw">;

  refresh: foundry.canvas.interaction.RenderFlag<this, "refresh">;
}

declare const declaredFlags: RenderFlags<DeclaredFlags>;

describe("RenderFlags from a subclass RENDER_FLAGS interface", () => {
  test("Flags", () => {
    expectTypeOf(declaredFlags.clear()).toEqualTypeOf<Partial<Record<"redraw" | "refresh", true>>>();
    expectTypeOf(declaredFlags.handle("redraw")).toBeBoolean();
    expectTypeOf(declaredFlags.set({ redraw: true, refresh: null })).toBeVoid();

    declaredFlags.add("refresh");

    // @ts-expect-error "nonexistant" is not a registered flag.
    declaredFlags.handle("nonexistant");
    // @ts-expect-error "nonexistant" is not a registered flag.
    declaredFlags.set({ nonexistant: true });
  });
});

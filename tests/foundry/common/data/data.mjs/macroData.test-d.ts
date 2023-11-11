import { expectTypeOf } from "vitest";

// @ts-expect-error - a MacroData requires data.
new foundry.data.MacroData();

// @ts-expect-error - a MacroData requires a name.
new foundry.data.MacroData({});

expectTypeOf(new foundry.data.MacroData({ name: "foo" })).toEqualTypeOf<foundry.data.MacroData>();

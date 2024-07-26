import { expectTypeOf } from "vitest";

// @ts-expect-error - a MacroData requires data.
new foundry.documents.BaseMacro();

// @ts-expect-error - a MacroData requires a name.
new foundry.documents.BaseMacro({});

expectTypeOf(new foundry.documents.BaseMacro({ name: "foo" })).toEqualTypeOf<foundry.documents.BaseMacro>();

const myMacro = new foundry.documents.BaseMacro({ name: "foo" });

expectTypeOf(myMacro.type).toEqualTypeOf<"chat" | "script">();

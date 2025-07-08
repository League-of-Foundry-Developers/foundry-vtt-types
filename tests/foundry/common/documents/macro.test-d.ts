import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseMacro extends foundry.documents.BaseMacro {}

// @ts-expect-error a MacroData requires data.
new TestBaseMacro();

// @ts-expect-error a MacroData requires a name.
new TestBaseMacro({});

expectTypeOf(new TestBaseMacro({ name: "foo" })).toEqualTypeOf<TestBaseMacro>();

const myMacro = new TestBaseMacro({ name: "foo" });

expectTypeOf(myMacro.type).toEqualTypeOf<"chat" | "script">();

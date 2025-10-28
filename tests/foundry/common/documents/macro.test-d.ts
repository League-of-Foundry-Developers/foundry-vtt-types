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

const storedMacrosCreateDocuments = await TestBaseMacro.createDocuments([{ name: "Macro One" }]);
expectTypeOf(storedMacrosCreateDocuments).toEqualTypeOf<Macro.Stored[]>();

const tempMacrosCreateDocuments = await TestBaseMacro.createDocuments([{ name: "Macro One" }], { temporary: true });
expectTypeOf(tempMacrosCreateDocuments).toEqualTypeOf<Macro.Implementation[]>();

const storedMacroCreate = await TestBaseMacro.create({ name: "Macro One" });
expectTypeOf(storedMacroCreate).toEqualTypeOf<Macro.Stored | undefined>();

const tempMacroCreate = await TestBaseMacro.create({ name: "Macro One" }, { temporary: true });
expectTypeOf(tempMacroCreate).toEqualTypeOf<Macro.Implementation | undefined>();

const storedMacrosCreate = await TestBaseMacro.create([{ name: "Macro One" }]);
expectTypeOf(storedMacrosCreate).toEqualTypeOf<Macro.Stored[]>();

const tempMacrosCreate = await TestBaseMacro.create([{ name: "Macro One" }], { temporary: true });
expectTypeOf(tempMacrosCreate).toEqualTypeOf<Macro.Implementation[]>();

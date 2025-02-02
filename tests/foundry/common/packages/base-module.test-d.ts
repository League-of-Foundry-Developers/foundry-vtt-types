import { expectTypeOf } from "vitest";
import type AdditionalTypesField from "../../../../src/foundry/common/packages/sub-types.d.mts";
import type { AnyObject } from "fvtt-types/utils";

const baseModule = new foundry.packages.BaseModule({
  changelog: "Test",
});

// schema fields
expectTypeOf(baseModule.version).toEqualTypeOf<string>();
expectTypeOf(baseModule.library).toEqualTypeOf<boolean>();
expectTypeOf(baseModule.coreTranslation).toEqualTypeOf<boolean>();

// It's *not* ever undefined though, possibly as a product of the server's work?
expectTypeOf(baseModule.documentTypes).toEqualTypeOf<AnyObject | AdditionalTypesField.ServerTypeDeclarations>();

expectTypeOf(foundry.packages.BaseModule.defineSchema()).toEqualTypeOf<foundry.packages.BaseModule.Schema>();
expectTypeOf(foundry.packages.BaseModule.type).toEqualTypeOf<"module">();
expectTypeOf(foundry.packages.BaseModule.icon).toEqualTypeOf<string>();

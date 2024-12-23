import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";
import AdditionalTypesField = foundry.common.packages.subTypes.AdditionalTypesField;

const mySystem = new foundry.packages.BaseModule({
  changelog: "Test",
});

expectTypeOf(mySystem.version).toEqualTypeOf<string>();
expectTypeOf(mySystem.library).toEqualTypeOf<boolean>();
expectTypeOf(mySystem.coreTranslation).toEqualTypeOf<boolean>();
// It's *not* ever undefined though, possibly as a product of the server's work?
expectTypeOf(mySystem.documentTypes).toEqualTypeOf<AnyObject | AdditionalTypesField.ServerTypeDeclarations>();

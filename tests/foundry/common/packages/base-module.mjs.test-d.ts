import { expectTypeOf } from "vitest";
import type { AnyObject } from "../../../../src/types/utils.d.mts";
import type AdditionalTypesField from "../../../../src/foundry/common/packages/sub-types.d.mts";

const mySystem = new foundry.packages.BaseModule({
  changelog: "Test",
});

expectTypeOf(mySystem.version).toEqualTypeOf<string>();
expectTypeOf(mySystem.library).toEqualTypeOf<boolean>();
expectTypeOf(mySystem.coreTranslation).toEqualTypeOf<boolean>();
// It's *not* ever undefined though, possibly as a product of the server's work?
expectTypeOf(mySystem.documentTypes).toEqualTypeOf<AnyObject | AdditionalTypesField.ServerTypeDeclarations>();

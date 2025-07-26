import { expectTypeOf } from "vitest";

// Import necessary as this is otherwise inaccessible.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import type AdditionalTypesField from "../../../../src/foundry/common/packages/sub-types.d.mts";

const baseModule = new foundry.packages.BaseModule({
  id: "123",
  title: "Test Title",
});

// schema fields
expectTypeOf(baseModule.version).toEqualTypeOf<string>();
expectTypeOf(baseModule.library).toEqualTypeOf<boolean>();
expectTypeOf(baseModule.coreTranslation).toEqualTypeOf<boolean>();

// It's *not* ever undefined though, possibly as a product of the server's work?
expectTypeOf(baseModule.documentTypes).toEqualTypeOf<AdditionalTypesField.DocumentTypesConfiguration>();

expectTypeOf(foundry.packages.BaseModule.defineSchema()).toEqualTypeOf<foundry.packages.BaseModule.Schema>();
expectTypeOf(foundry.packages.BaseModule.type).toEqualTypeOf<"module">();
expectTypeOf(foundry.packages.BaseModule.icon).toEqualTypeOf<string>();

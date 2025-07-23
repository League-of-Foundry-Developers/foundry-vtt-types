import { expectTypeOf } from "vitest";

// Import necessary as this is otherwise inaccessible.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import type AdditionalTypesField from "../../../../src/foundry/common/packages/sub-types.d.mts";

const baseSystem = new foundry.packages.BaseSystem({
  id: "Test",
  title: "Test",
});

expectTypeOf(baseSystem.strictDataCleaning).toEqualTypeOf<boolean>();

// schema fields
expectTypeOf(baseSystem.version).toEqualTypeOf<string>();
expectTypeOf(baseSystem.documentTypes).toEqualTypeOf<AdditionalTypesField.DocumentTypesConfiguration>();
expectTypeOf(baseSystem.documentTypes.Actor["character"]).toEqualTypeOf<
  AdditionalTypesField.ServerSanitationFields | undefined
>();
expectTypeOf(baseSystem.background).toEqualTypeOf<string | undefined>();
expectTypeOf(baseSystem.initiative).toEqualTypeOf<string | undefined>();
expectTypeOf(baseSystem.grid.type).toEqualTypeOf<number>();
expectTypeOf(baseSystem.grid.distance).toEqualTypeOf<number>();
expectTypeOf(baseSystem.grid.units).toEqualTypeOf<string>();
expectTypeOf(baseSystem.grid.diagonals).toEqualTypeOf<number>();
expectTypeOf(baseSystem.primaryTokenAttribute).toEqualTypeOf<string | undefined>();
expectTypeOf(baseSystem.secondaryTokenAttribute).toEqualTypeOf<string | undefined>();

expectTypeOf(foundry.packages.BaseSystem.type).toEqualTypeOf<"system">();
expectTypeOf(foundry.packages.BaseSystem.icon).toEqualTypeOf<string>();

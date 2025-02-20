import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";
import type AdditionalTypesField from "../../../../src/foundry/common/packages/sub-types.d.mts";

const baseSystem = new foundry.packages.BaseSystem({
  changelog: "Test",
});

expectTypeOf(baseSystem.strictDataCleaning).toEqualTypeOf<boolean>();

// schema fields
expectTypeOf(baseSystem.version).toEqualTypeOf<string>();
expectTypeOf(baseSystem.documentTypes).toEqualTypeOf<AnyObject | AdditionalTypesField.ServerTypeDeclarations>();
expectTypeOf(baseSystem.documentTypes).toEqualTypeOf<AnyObject | AdditionalTypesField.ServerTypeDeclarations>();
expectTypeOf(baseSystem.background).toEqualTypeOf<string | undefined>();
expectTypeOf(baseSystem.initiative).toEqualTypeOf<string | undefined>();

// these all want undefined, but I don't think that's right
expectTypeOf(baseSystem.grid.type).toEqualTypeOf<number>();
expectTypeOf(baseSystem.grid.distance).toEqualTypeOf<number>();
expectTypeOf(baseSystem.grid.units).toEqualTypeOf<string>();
expectTypeOf(baseSystem.grid.diagonals).toEqualTypeOf<number>();

expectTypeOf(baseSystem.primaryTokenAttribute).toEqualTypeOf<string | undefined>();
expectTypeOf(baseSystem.secondaryTokenAttribute).toEqualTypeOf<string | undefined>();

expectTypeOf(foundry.packages.BaseSystem.type).toEqualTypeOf<"system">();
expectTypeOf(foundry.packages.BaseSystem.icon).toEqualTypeOf<string>();

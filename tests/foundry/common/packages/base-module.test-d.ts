import { expectTypeOf } from "vitest";

import AdditionalTypesField = foundry.packages.AdditionalTypesField;
import Module = foundry.packages.Module;

const baseModule = new foundry.packages.BaseModule({
  id: "123",
  title: "Test Title",
});

// schema fields
expectTypeOf(baseModule.version).toEqualTypeOf<string>();
expectTypeOf(baseModule.type).toEqualTypeOf<"module">();
expectTypeOf(baseModule.library).toEqualTypeOf<boolean>();
expectTypeOf(baseModule.coreTranslation).toEqualTypeOf<boolean>();

// It's *not* ever undefined though, possibly as a product of the server's work?
expectTypeOf(baseModule.documentTypes).toEqualTypeOf<AdditionalTypesField.DocumentTypesConfiguration>();

expectTypeOf(foundry.packages.BaseModule.defineSchema()).toEqualTypeOf<foundry.packages.BaseModule.Schema>();
expectTypeOf(foundry.packages.BaseModule.type).toEqualTypeOf<"module">();
expectTypeOf(foundry.packages.BaseModule.icon).toEqualTypeOf<string>();

expectTypeOf(baseModule.quickstart).toEqualTypeOf<Module.QuickstartData | undefined>();
expectTypeOf(baseModule.quickstart!.adventures["dnd5e"]).toEqualTypeOf<Module.QuickstartAdventureData | undefined>();
expectTypeOf(baseModule.quickstart!.adventures["dnd5e"]!.uuid).toEqualTypeOf<string>();
expectTypeOf(baseModule.quickstart!.postImport).toEqualTypeOf<boolean>();
expectTypeOf(baseModule.quickstart!.world.background).toEqualTypeOf<string | null>();
expectTypeOf(baseModule.quickstart!.world.cover).toEqualTypeOf<string | null>();
expectTypeOf(baseModule.quickstart!.world.description).toEqualTypeOf<string | undefined>();

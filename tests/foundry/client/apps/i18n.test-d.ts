import { expectTypeOf } from "vitest";

type Translations = {
  [K: string]: string | Translations;
};

new Localization();
const localization = new Localization("en.core");
expectTypeOf(localization.lang).toEqualTypeOf<string>();
expectTypeOf(localization.defaultModule).toEqualTypeOf<string>();
expectTypeOf(localization.translations).toEqualTypeOf<Translations>();
expectTypeOf(localization.initialize()).toEqualTypeOf<Promise<void>>();
expectTypeOf(localization.setLanguage("de")).toEqualTypeOf<Promise<void>>();
expectTypeOf(localization.has("WORLD.DetailTab")).toEqualTypeOf<boolean>();
expectTypeOf(localization.has("WORLD.DetailTab", true)).toEqualTypeOf<boolean>();
expectTypeOf(localization.localize("WORLD.DetailTab")).toEqualTypeOf<string>();
expectTypeOf(localization.format("DICE.ErrorNonNumeric")).toEqualTypeOf<string>();
expectTypeOf(localization.format("DICE.ErrorNonNumeric", { formula: "2d10" })).toEqualTypeOf<string>();

declare const itemArray: Item.Implementation[];
expectTypeOf(localization.sortObjects(itemArray, "name")).toEqualTypeOf<Item.Implementation[]>();

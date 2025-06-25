import { expectTypeOf } from "vitest";

import Localization = foundry.helpers.Localization;
import LightData = foundry.data.LightData;

expectTypeOf(Localization.localizeDataModel(LightData)).toBeVoid();
expectTypeOf(Localization.localizeDataModel(LightData, {})).toBeVoid();
expectTypeOf(
  Localization.localizeDataModel(LightData, { prefixes: ["foo", "bar"], prefixPath: "fizz.buzz" }),
).toBeVoid();
expectTypeOf(Localization.localizeDataModel(LightData, { prefixes: undefined, prefixPath: undefined })).toBeVoid();

expectTypeOf(Localization.localizeSchema(LightData.schema)).toBeVoid();
expectTypeOf(Localization.localizeSchema(LightData.schema, ["foo", "bar"])).toBeVoid();
expectTypeOf(Localization.localizeSchema(LightData.schema, undefined, {})).toBeVoid();
expectTypeOf(
  Localization.localizeSchema(LightData.schema, ["foo", "bar"], {
    prefixPath: "fizz.buzz",
  }),
).toBeVoid();
expectTypeOf(
  Localization.localizeSchema(LightData.schema, ["foo", "bar"], {
    prefixPath: undefined,
  }),
).toBeVoid();

new Localization();
const localization = new Localization("en.core");
expectTypeOf(localization.lang).toEqualTypeOf<string>();
expectTypeOf(localization.defaultModule).toEqualTypeOf<string>();
expectTypeOf(localization.translations).toEqualTypeOf<Localization.Translations>();
expectTypeOf(localization["_fallback"]).toEqualTypeOf<Localization.Translations>();
expectTypeOf(localization.initialize()).toEqualTypeOf<Promise<void>>();
expectTypeOf(localization.setLanguage("de")).toEqualTypeOf<Promise<void>>();

expectTypeOf(localization.has("WORLD.DetailTab")).toEqualTypeOf<boolean>();
expectTypeOf(localization.has("WORLD.DetailTab", true)).toEqualTypeOf<boolean>();

expectTypeOf(localization.localize("WORLD.DetailTab")).toEqualTypeOf<string>();

expectTypeOf(localization.format("DICE.ErrorNonNumeric")).toEqualTypeOf<string>();
expectTypeOf(localization.format("DICE.ErrorNonNumeric", { formula: "2d10" })).toEqualTypeOf<string>();

expectTypeOf(localization.getListFormatter()).toEqualTypeOf<Intl.ListFormat>();
expectTypeOf(localization.getListFormatter({})).toEqualTypeOf<Intl.ListFormat>();
expectTypeOf(localization.getListFormatter({ style: "short", type: "disjunction" })).toEqualTypeOf<Intl.ListFormat>();
expectTypeOf(localization.getListFormatter({ style: undefined, type: undefined })).toEqualTypeOf<Intl.ListFormat>();

// Avoiding testing with something as complicated as a Document for now
// declare const itemArray: Item.Implementation[];
// expectTypeOf(localization.sortObjects(itemArray, "name")).toEqualTypeOf<Item.Implementation[]>();

interface SomeObject {
  foo: number;
  bar: string;
}
declare const someObjectArray: SomeObject[];
expectTypeOf(localization.sortObjects(someObjectArray, "foo")).toEqualTypeOf<SomeObject[]>();
// @ts-expect-error baz is not a property of SomeObject
expectTypeOf(localization.sortObjects(someObjectArray, "baz")).toEqualTypeOf<SomeObject[]>();

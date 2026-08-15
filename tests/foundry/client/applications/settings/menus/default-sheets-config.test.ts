import { describe, expectTypeOf, test } from "vitest";

import DefaultSheetsConfig = foundry.applications.settings.menus.DefaultSheetsConfig;
import CategoryBrowser = foundry.applications.api.CategoryBrowser;

describe("DefaultSheetsConfig Tests", async () => {
  test("Construction", () => {
    expectTypeOf(new DefaultSheetsConfig()).toEqualTypeOf<DefaultSheetsConfig>();
  });

  const app = new DefaultSheetsConfig();

  test("_prepareCategoryData", async () => {
    const categoryData = await app["_prepareCategoryData"]();
    expectTypeOf(categoryData).toEqualTypeOf<Record<string, CategoryBrowser.CategoryData<DefaultSheetsConfig.Entry>>>();
    // runtime tests impossible until we decide on a standard test system
  });

  test("`sheetClasses` setting", () => {
    expectTypeOf(DefaultSheetsConfig.SETTING).toEqualTypeOf<"sheetClasses">();

    expectTypeOf(DefaultSheetsConfig.SCHEMA).toEqualTypeOf<
      foundry.data.fields.SchemaField<DefaultSheetsConfig.Schema>
    >();
    expectTypeOf(DefaultSheetsConfig.SCHEMA.fields.Actor).toEqualTypeOf<DefaultSheetsConfig._DocTOF>();

    expectTypeOf(DefaultSheetsConfig.registerSetting()).toBeVoid();
  });

  test("DEFAULT_OPTIONS", () => {
    expectTypeOf(DefaultSheetsConfig.DEFAULT_OPTIONS).toEqualTypeOf<DefaultSheetsConfig.DefaultOptions>();
  });

  test("Entry", () => {
    // The runtime pushes an id/name/label/value/choices record; there is no `field`.
    const entry: DefaultSheetsConfig.Entry = {
      id: "Actor-character",
      name: "Actor.character",
      label: "Character",
      value: "",
      choices: {},
    };
    expectTypeOf(entry.id).toBeString();
    expectTypeOf(entry.name).toBeString();
    expectTypeOf(entry.label).toBeString();
    expectTypeOf(entry.value).toBeString();
    expectTypeOf(entry.choices).toEqualTypeOf<Record<string, string>>();
  });
});

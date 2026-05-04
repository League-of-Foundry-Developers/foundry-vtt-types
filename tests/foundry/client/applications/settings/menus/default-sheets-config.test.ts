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
});

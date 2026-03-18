import { describe, expect, expectTypeOf, test } from "vitest";

import DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import Document = foundry.abstract.Document;

class TestItemSheetV2 extends DocumentSheetV2<Item.Implementation> {}

describe("DocumentSheetConfig Tests", async () => {
  const doc = new Item.implementation({ name: "foo", type: "base" });

  test("Construction", () => {
    // @ts-expect-error Any descendant of `DocumentSheetV2` must provide an options object with a `document`.
    expect(() => new DocumentSheetConfig()).toThrow();

    // We currently don't infer the `Document` generic from constructor options in `DocumentSheetV2` classes
    const app = new DocumentSheetConfig({ document: doc });
    expectTypeOf(app).toEqualTypeOf<
      DocumentSheetConfig<
        Document.Any,
        DocumentSheetConfig.RenderContext<Document.Any>,
        DocumentSheetConfig.Configuration<Document.Any>,
        DocumentSheetConfig.RenderOptions
      >
    >();

    const app2 = new DocumentSheetConfig<Item.Implementation>({ document: doc });
    expectTypeOf(app2).toEqualTypeOf<
      DocumentSheetConfig<
        Item.Implementation,
        DocumentSheetConfig.RenderContext<Item.Implementation>,
        DocumentSheetConfig.Configuration<Item.Implementation>,
        DocumentSheetConfig.RenderOptions
      >
    >();
  });

  // AppV2/HAM overrides not tested here

  test("Information static getters", () => {
    const { sheetClasses, defaultClasses, defaultClass } = DocumentSheetConfig.getSheetClassesForSubType(
      "Actor",
      "base",
    );

    expectTypeOf(sheetClasses).toEqualTypeOf<Record<string, string>>();
    expectTypeOf(defaultClasses).toEqualTypeOf<Record<string, string>>();
    expectTypeOf(defaultClass).toBeString();

    expectTypeOf(DocumentSheetConfig.getSheetThemeForDocument(doc)).toBeString();

    // runtime tests not possible until we standardize on a test system
  });

  test("Sheet Registration", async () => {
    expectTypeOf(await DocumentSheetConfig.initializeSheets()).toBeVoid();

    expectTypeOf(
      DocumentSheetConfig.registerSheet(Item.implementation, "core", TestItemSheetV2, {
        canBeDefault: false,
        canConfigure: true,
        label: "FVTT-Types Test Sheet",
        makeDefault: false,
        themes: {
          light: "Light!",
          dark: "Dark!",
        },
        types: ["base"],
      }),
    ).toBeVoid();

    doc.updateSource({ flags: { core: { sheetClass: "core.TestItemSheetV2" } } });

    expect(doc.sheet?.constructor.name).toBe("TestItemSheetV2");
    expect(doc.sheet).toBeInstanceOf(TestItemSheetV2);

    // @ts-expect-error flags are currently not given deletion keys
    doc.updateSource({ flags: { core: { "-=sheetClass": null } } });

    // force the sheet to be refreshed
    doc["_sheet"] = null;

    // In this test, we need to unregister the sheet class before attempting to re-initialize
    // `doc`'s sheet in order to get the expected behavior. This is not necessary in testing
    // done with a script macro.
    expectTypeOf(
      DocumentSheetConfig.unregisterSheet(Item.implementation, "core", TestItemSheetV2, { types: ["base"] }),
    ).toBeVoid();

    expect(doc.sheet).not.toBeInstanceOf(TestItemSheetV2);

    expectTypeOf(DocumentSheetConfig.updateDefaultSheets()).toBeVoid();
    expectTypeOf(DocumentSheetConfig.updateDefaultSheets(game.settings!.get("core", "sheetClasses"))).toBeVoid();
  });
});

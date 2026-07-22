import { expectTypeOf } from "vitest";

declare const doc: Adventure.Implementation;
const adventureExporter = new foundry.applications.sheets.AdventureExporter({ document: doc });

expectTypeOf(adventureExporter.document).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(adventureExporter.contentTree).toEqualTypeOf<
  Record<string, foundry.applications.sheets.AdventureExporter.AdventureContentTreeRoot>
>();

expectTypeOf(
  foundry.applications.sheets.AdventureExporter.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.AdventureExporter.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.AdventureExporter.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();

declare const folder: Folder.Implementation;
adventureExporter.addContent(folder);
adventureExporter.removeContent(doc);

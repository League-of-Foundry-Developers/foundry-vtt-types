import { expectTypeOf } from "vitest";

declare const doc: Scene.Implementation;
const gridConfig = new foundry.applications.apps.GridConfig({ document: doc });

expectTypeOf(gridConfig.document).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(gridConfig.title).toEqualTypeOf<string>();
expectTypeOf(gridConfig.sheet).toEqualTypeOf<foundry.applications.sheets.SceneConfig>();

expectTypeOf(
  foundry.applications.apps.GridConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.apps.GridConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

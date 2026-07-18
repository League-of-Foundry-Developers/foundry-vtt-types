import { expectTypeOf } from "vitest";

declare const doc: Scene.Implementation;
const sceneConfig = new foundry.applications.sheets.SceneConfig({ document: doc });

expectTypeOf(sceneConfig.document).toEqualTypeOf<Scene.Implementation>();

expectTypeOf(
  foundry.applications.sheets.SceneConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.SceneConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.SceneConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();
expectTypeOf(foundry.applications.sheets.SceneConfig._getGridTypes()).toEqualTypeOf<Record<CONST.GRID_TYPES, string>>();
expectTypeOf(foundry.applications.sheets.SceneConfig._getFogExplorationModes()).toEqualTypeOf<
  Record<CONST.FOG_EXPLORATION_MODES, string>
>();

declare class _TestSceneConfigSubclass extends foundry.applications.sheets.SceneConfig {
  protected override _onDrop(event: DragEvent): Promise<void>;
  protected override _getLevelContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];
}

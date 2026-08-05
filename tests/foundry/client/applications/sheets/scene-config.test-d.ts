import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import SceneConfig = foundry.applications.sheets.SceneConfig;

declare const doc: Scene.Implementation;
const sceneConfig = new SceneConfig({ document: doc });

expectTypeOf(sceneConfig.document).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(sceneConfig.defaultLevel).toEqualTypeOf<Level.Implementation>();

expectTypeOf(SceneConfig.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
expectTypeOf(SceneConfig.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();
expectTypeOf(SceneConfig._getGridTypes()).toEqualTypeOf<Record<CONST.GRID_TYPES, string>>();
expectTypeOf(SceneConfig._getFogExplorationModes()).toEqualTypeOf<Record<CONST.FOG_EXPLORATION_MODES, string>>();

expectTypeOf(sceneConfig._previewScene("grid.style")).toEqualTypeOf<void>();
expectTypeOf(sceneConfig._previewScene("", { force: true })).toEqualTypeOf<void>();

declare const context: SceneConfig.RenderContext;
expectTypeOf(context.tabClasses).toBeString();
expectTypeOf(context.gridTypes).toEqualTypeOf<Record<CONST.GRID_TYPES, string> | undefined>();
expectTypeOf(context.levels).toEqualTypeOf<SceneConfig.LevelContext[] | undefined>();
expectTypeOf(context.ownerships).toEqualTypeOf<SceneConfig.OwnershipChoice[] | undefined>();
expectTypeOf(context.background).toEqualTypeOf<SceneConfig.BackgroundContext | undefined>();
expectTypeOf(context.fog).toEqualTypeOf<SceneConfig.FogContext | undefined>();
expectTypeOf(context.transitionTypes).toEqualTypeOf<Record<string, string> | undefined>();

class CustomSceneConfig extends SceneConfig {
  protected override _getLevelContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[] {
    return super._getLevelContextOptions();
  }

  protected override _onDragStart(event: DragEvent): void {
    super._onDragStart(event);
  }

  protected override _onSortLevel(
    event: DragEvent,
    level: Level.Implementation,
  ): Promise<Level.Implementation[]> | void {
    return super._onSortLevel(event, level);
  }
}

expectTypeOf(CustomSceneConfig).toExtend<SceneConfig.AnyConstructor>();

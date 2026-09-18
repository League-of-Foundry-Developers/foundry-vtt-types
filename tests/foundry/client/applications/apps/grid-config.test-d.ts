import { expectTypeOf, test } from "vitest";

import GridConfig = foundry.applications.apps.GridConfig;

declare const scene: Scene.Implementation;

declare const context: GridConfig.RenderContext;

test("foundry/client/applications/apps/grid-config", () => {
  const gridConfig = new GridConfig({ document: scene });

  expectTypeOf(gridConfig.document).toEqualTypeOf<Scene.Implementation>();
  expectTypeOf(gridConfig.sheet).toEqualTypeOf<foundry.applications.sheets.SceneConfig.Any>();
  expectTypeOf(gridConfig.title).toBeString();
  expectTypeOf(context.scene).toEqualTypeOf<Scene.Implementation | null>();
  expectTypeOf(context.src).toEqualTypeOf<string | undefined>();
  expectTypeOf(context.scale).toBeNumber();
  expectTypeOf(context.gridTypes).toEqualTypeOf<Record<foundry.CONST.GRID_TYPES, string>>();
  expectTypeOf(context.buttons).toEqualTypeOf<foundry.applications.api.ApplicationV2.FormFooterButton[]>();
});

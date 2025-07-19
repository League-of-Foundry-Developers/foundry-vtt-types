import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

const sceneNavigation = new foundry.applications.ui.SceneNavigation({});

expectTypeOf(sceneNavigation.expanded).toEqualTypeOf<boolean>();

Hooks.on("getSceneContextOptions", (app, contextOptions) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.ui.SceneNavigation>();
  expectTypeOf(contextOptions).toEqualTypeOf<foundry.applications.ux.ContextMenu.Entry<HTMLElement>[]>();
});

expectTypeOf(foundry.applications.ui.SceneNavigation.DEFAULT_OPTIONS).toEqualTypeOf<
  DeepPartial<foundry.applications.api.ApplicationV2.Configuration> & object
>();
expectTypeOf(foundry.applications.ui.SceneNavigation.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

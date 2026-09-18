import { expectTypeOf, test } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

declare const renderOptions: foundry.applications.ui.SceneNavigation.RenderOptions;

declare const navContext: foundry.applications.ui.SceneNavigation.RenderContext;

// Each scene carries its status icons rather than a precomputed class string.
declare const scene: foundry.applications.ui.SceneNavigation.SceneContext;

declare const level: foundry.applications.ui.SceneNavigation.LevelContext;

declare const pip: foundry.applications.ui.SceneNavigation.UserPipContext;

test("foundry/client/applications/ui/scene-navigation", () => {
  const sceneNavigation = new foundry.applications.ui.SceneNavigation({});

  expectTypeOf(sceneNavigation.expanded).toEqualTypeOf<boolean>();

  Hooks.on("getSceneContextOptions", (app, contextOptions) => {
    expectTypeOf(app).toEqualTypeOf<
      | foundry.applications.ui.SceneNavigation.Any
      | foundry.applications.sidebar.tabs.SceneDirectory.Any
      | foundry.applications.sidebar.apps.Compendium.Any
    >();
    expectTypeOf(contextOptions).toEqualTypeOf<foundry.applications.ux.ContextMenu.Entry<HTMLElement>[]>();
  });

  expectTypeOf(foundry.applications.ui.SceneNavigation.DEFAULT_OPTIONS).toEqualTypeOf<
    DeepPartial<foundry.applications.api.ApplicationV2.Configuration> & object
  >();
  expectTypeOf(foundry.applications.ui.SceneNavigation.PARTS).toEqualTypeOf<
    Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
  >();

  expectTypeOf(sceneNavigation.expand()).toEqualTypeOf<void>();
  expectTypeOf(sceneNavigation.collapse()).toEqualTypeOf<Promise<void>>();
  expectTypeOf(sceneNavigation.toggleExpanded()).toEqualTypeOf<void>();
  expectTypeOf(sceneNavigation.toggleExpanded(true)).toEqualTypeOf<void>();

  // The canvas passes this when it finishes drawing a scene.
  sceneNavigation.render({ scrollToActiveLevel: true });
  expectTypeOf(renderOptions.scrollToActiveLevel).toEqualTypeOf<boolean | undefined>();
  expectTypeOf(navContext.canExpand).toEqualTypeOf<number>();
  expectTypeOf(navContext.scenes.active).toEqualTypeOf<foundry.applications.ui.SceneNavigation.SceneContext[]>();
  expectTypeOf(navContext.scenes.inactive).toEqualTypeOf<foundry.applications.ui.SceneNavigation.SceneContext[]>();

  // Both are only assigned when one of the navigable scenes is the currently viewed one, and `levels`
  // is additionally `null` for a scene with fewer than two available levels.
  expectTypeOf(navContext.scenes.viewed).toEqualTypeOf<
    foundry.applications.ui.SceneNavigation.SceneContext | undefined
  >();
  expectTypeOf(navContext.scenes.levels).toEqualTypeOf<
    foundry.applications.ui.SceneNavigation.LevelContext[] | null | undefined
  >();
  expectTypeOf(scene.icons).toEqualTypeOf<foundry.applications.ui.SceneNavigation.SceneIcon[]>();
  expectTypeOf(scene.icons[0]!.class).toEqualTypeOf<string>();
  expectTypeOf(scene.icons[0]!.tooltip).toEqualTypeOf<string>();
  expectTypeOf(level.sceneId).toEqualTypeOf<string>();
  expectTypeOf(level.users).toEqualTypeOf<foundry.applications.ui.SceneNavigation.UserPipContext[] | undefined>();
  expectTypeOf(pip.color).toEqualTypeOf<string>();
  expectTypeOf(pip.border).toEqualTypeOf<Color>();
});

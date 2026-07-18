import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

declare const manager: foundry.applications.sidebar.apps.ModuleManagement;
declare const root: foundry.packages.Module;

const app = new foundry.applications.settings.DependencyResolution({ manager, root });

expectTypeOf(
  foundry.applications.settings.DependencyResolution.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.settings.DependencyResolution.DefaultOptions>();
expectTypeOf(foundry.applications.settings.DependencyResolution.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(app.needsResolving).toEqualTypeOf<boolean>();
expectTypeOf(app.root).toEqualTypeOf<foundry.packages.Module>();
expectTypeOf(app._getRootRequiredBy()).toEqualTypeOf<Set<foundry.packages.Module>>();

declare class _TestDependencyResolutionSubclass extends foundry.applications.settings.DependencyResolution {
  protected override _prepareContext(
    options: DeepPartial<foundry.applications.settings.DependencyResolution.RenderOptions>,
  ): Promise<foundry.applications.settings.DependencyResolution.RenderContext>;
}

expectTypeOf(app).toEqualTypeOf<foundry.applications.settings.DependencyResolution>();

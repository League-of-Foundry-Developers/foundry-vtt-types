import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

declare const world: foundry.packages.World;

const app = new foundry.applications.sidebar.apps.WorldConfig({ world });

expectTypeOf(
  foundry.applications.sidebar.apps.WorldConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.sidebar.apps.WorldConfig.DefaultOptions>();
expectTypeOf(foundry.applications.sidebar.apps.WorldConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(app.world).toEqualTypeOf<foundry.packages.World>();
expectTypeOf(app.title).toEqualTypeOf<string>();

declare class _TestWorldConfigSubclass extends foundry.applications.sidebar.apps.WorldConfig {
  protected override _prepareContext(
    options: DeepPartial<foundry.applications.sidebar.apps.WorldConfig.RenderOptions>,
  ): Promise<foundry.applications.sidebar.apps.WorldConfig.RenderContext>;
}

expectTypeOf(app).toEqualTypeOf<foundry.applications.sidebar.apps.WorldConfig>();

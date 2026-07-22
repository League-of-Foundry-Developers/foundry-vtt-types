import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

const app = new foundry.applications.sidebar.apps.ControlsConfig();

expectTypeOf(
  foundry.applications.sidebar.apps.ControlsConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.sidebar.apps.ControlsConfig.DefaultOptions>();
expectTypeOf(foundry.applications.sidebar.apps.ControlsConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sidebar.apps.ControlsConfig.POINTER_CONTROLS).toEqualTypeOf<
  readonly (readonly [id: string, name: string, parts: string[], gmOnly?: boolean])[]
>();

declare const binding: foundry.helpers.interaction.ClientKeybindings.KeybindingActionBinding;
expectTypeOf(foundry.applications.sidebar.apps.ControlsConfig.humanizeBinding(binding)).toEqualTypeOf<string>();

declare class _TestControlsConfigSubclass extends foundry.applications.sidebar.apps.ControlsConfig {
  protected override _configureRenderOptions(
    options: DeepPartial<foundry.applications.sidebar.apps.ControlsConfig.RenderOptions>,
  ): void;

  protected override _prepareCategoryData(): Promise<
    Record<
      string,
      foundry.applications.api.CategoryBrowser.CategoryData<foundry.applications.sidebar.apps.ControlsConfig.Entry>
    >
  >;
}

expectTypeOf(app).toEqualTypeOf<foundry.applications.sidebar.apps.ControlsConfig>();

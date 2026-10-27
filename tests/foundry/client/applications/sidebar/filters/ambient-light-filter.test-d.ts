import { expectTypeOf, test } from "vitest";

import AmbientLightFilter = foundry.applications.sidebar.filters.AmbientLightFilter;
import AmbientLightTab = foundry.applications.sidebar.tabs.AmbientLightTab;

declare const tab: AmbientLightTab;

declare const context: AmbientLightFilter.RenderContext;

test("foundry/client/applications/sidebar/filters/ambient-light-filter", () => {
  const filter = new AmbientLightFilter(tab);

  expectTypeOf(AmbientLightFilter.DEFAULT_OPTIONS).toEqualTypeOf<AmbientLightFilter.DefaultOptions>();

  // Narrowed from PlaceableTab, since AmbientLightTab is the only tab that installs this filter.
  expectTypeOf(filter.tab).toEqualTypeOf<AmbientLightTab.Any>();
  expectTypeOf(filter.tab._filterState.animationType).toEqualTypeOf<
    foundry.canvas.sources.RenderedEffectSource.ConfiguredLightAnimations | "none" | null
  >();
  expectTypeOf(context.animationType.field).toEqualTypeOf<foundry.data.fields.StringField>();
  expectTypeOf(context.animationType.value).toBeString();
  expectTypeOf(context.color.value).toEqualTypeOf<string | null>();
  expectTypeOf(context.negative.value).toEqualTypeOf<"any" | "yes" | "no">();
  expectTypeOf(context.walls.field).toEqualTypeOf<foundry.data.fields.StringField>();
  expectTypeOf(context.vision).toEqualTypeOf<foundry.applications.sidebar.filters.PlaceableFilter.BooleanFilterField>();
  expectTypeOf(AmbientLightFilter._BOOLEAN_FIELD_FILTERS).toEqualTypeOf<Record<string, string>>();
  expectTypeOf(filter.tab._filterState.negative).toEqualTypeOf<boolean | null>();

  // The inherited elevation controls are still present.
  expectTypeOf(context.elevation.top.value).toEqualTypeOf<number | null>();

  class CustomAmbientLightFilter extends AmbientLightFilter {
    protected override _onChangeForm(
      formConfig: foundry.applications.api.ApplicationV2.FormConfiguration,
      event: Event,
    ): void {
      super._onChangeForm(formConfig, event);
    }
  }

  expectTypeOf(new CustomAmbientLightFilter(tab)).toEqualTypeOf<CustomAmbientLightFilter>();
});

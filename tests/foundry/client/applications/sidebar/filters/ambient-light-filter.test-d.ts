import { expectTypeOf } from "vitest";

import AmbientLightFilter = foundry.applications.sidebar.filters.AmbientLightFilter;
import AmbientLightTab = foundry.applications.sidebar.tabs.AmbientLightTab;

declare const tab: AmbientLightTab;

const filter = new AmbientLightFilter(tab);

expectTypeOf(AmbientLightFilter.DEFAULT_OPTIONS).toEqualTypeOf<AmbientLightFilter.DefaultOptions>();

// Narrowed from PlaceableTab, since AmbientLightTab is the only tab that installs this filter.
expectTypeOf(filter.tab).toEqualTypeOf<AmbientLightTab.Any>();
expectTypeOf(filter.tab._filterState.animationType).toEqualTypeOf<
  foundry.canvas.sources.RenderedEffectSource.ConfiguredLightAnimations | "none" | null
>();

declare const context: AmbientLightFilter.RenderContext;
expectTypeOf(context.animationType.field).toEqualTypeOf<foundry.data.fields.StringField>();
expectTypeOf(context.animationType.value).toBeString();
expectTypeOf(context.color.value).toEqualTypeOf<string | null>();
expectTypeOf(context.negative.value).toBeBoolean();
expectTypeOf(context.walls.field).toEqualTypeOf<foundry.data.fields.BooleanField>();
expectTypeOf(context.vision.value).toBeBoolean();

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

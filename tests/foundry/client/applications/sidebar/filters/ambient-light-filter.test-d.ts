import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import AmbientLightFilter = foundry.applications.sidebar.filters.AmbientLightFilter;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const tab: PlaceableTab.Any;

const filter = new AmbientLightFilter(tab);

expectTypeOf(filter).toEqualTypeOf<AmbientLightFilter>();

expectTypeOf(AmbientLightFilter.DEFAULT_OPTIONS).toEqualTypeOf<AmbientLightFilter.DefaultOptions>();
expectTypeOf(AmbientLightFilter.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestAmbientLightFilterSubclass extends AmbientLightFilter {
  protected override _prepareContext(
    options: DeepPartial<AmbientLightFilter.RenderOptions> & { isFirstRender: boolean },
  ): Promise<AmbientLightFilter.RenderContext>;
  protected override _attachFrameListeners(): void;
  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}

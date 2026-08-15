import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

const directory = new PlaceableDirectory();

expectTypeOf(PlaceableDirectory.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableDirectory.DefaultOptions>();
expectTypeOf(PlaceableDirectory.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();
expectTypeOf(PlaceableDirectory.tabName).toBeString();

// Undefined until the first sub-tab has been rendered.
expectTypeOf(directory.tab).toEqualTypeOf<PlaceableTab.Any | undefined>();

expectTypeOf(directory.close()).toEqualTypeOf<Promise<PlaceableDirectory | void>>();
expectTypeOf(directory.close({ renderContext: "deleteScene" })).toEqualTypeOf<Promise<PlaceableDirectory | void>>();
expectTypeOf(directory.changeTab("tokens", "sheet")).toEqualTypeOf<void>();
expectTypeOf(directory._updateFilterPip()).toEqualTypeOf<void>();

declare const object: foundry.canvas.placeables.PlaceableObject.Any;
expectTypeOf(directory.hoverEntry(object, true)).toEqualTypeOf<void>();
expectTypeOf(directory.isEntryVisible(object)).toBeBoolean();

// The canvas re-renders the tab part by passing `tabs`, and documents pass their render context through.
declare const renderOptions: PlaceableDirectory.RenderOptions;
expectTypeOf(renderOptions.tabs).toEqualTypeOf<boolean | undefined>();
expectTypeOf(renderOptions.renderContext).toEqualTypeOf<string | undefined>();
expectTypeOf(renderOptions.renderData).toEqualTypeOf<AnyObject | undefined>();

declare const layerTab: PlaceableDirectory.LayerTab;
expectTypeOf(layerTab.id).toBeString();
expectTypeOf(layerTab.disabled).toBeBoolean();
expectTypeOf(layerTab.order).toBeNumber();

class CustomPlaceableDirectory extends PlaceableDirectory {
  protected override _canRender(options: PlaceableDirectory.RenderOptions): boolean | void {
    return super._canRender(options);
  }

  protected override _getTabsConfig(group: string): PlaceableDirectory.TabsConfiguration | null {
    return super._getTabsConfig(group);
  }

  protected override async _renderTab(
    context: PlaceableDirectory.RenderContext,
    options: PlaceableDirectory.RenderOptions,
  ): Promise<void> {
    return super._renderTab(context, options);
  }

  protected override _onActivate(): void {
    super._onActivate();
  }

  protected override _onDeactivate(): void {
    super._onDeactivate();
  }
}

expectTypeOf(new CustomPlaceableDirectory()).toEqualTypeOf<CustomPlaceableDirectory>();

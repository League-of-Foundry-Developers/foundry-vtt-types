import { expectTypeOf } from "vitest";

import AmbientSoundTab = foundry.applications.sidebar.tabs.AmbientSoundTab;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import PlaceableFilter = foundry.applications.sidebar.filters.PlaceableFilter;

declare const directory: foundry.applications.sidebar.tabs.PlaceableDirectory;

const tab = new AmbientSoundTab({ collectionName: "sounds", directory });

// This tab adds no filter criteria of its own.
expectTypeOf(tab._filterState).toEqualTypeOf<PlaceableTab.FilterState>();
expectTypeOf(AmbientSoundTab.FILTER_CLASS).toEqualTypeOf<PlaceableFilter.AnyConstructor>();

class CustomAmbientSoundTab extends AmbientSoundTab {
  override _applyFilters(): void {
    super._applyFilters();
  }
}

expectTypeOf(new CustomAmbientSoundTab({ collectionName: "sounds", directory })).toEqualTypeOf<CustomAmbientSoundTab>();

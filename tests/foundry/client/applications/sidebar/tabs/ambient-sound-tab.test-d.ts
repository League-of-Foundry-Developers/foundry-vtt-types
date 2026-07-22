import { expectTypeOf } from "vitest";

import AmbientSoundTab = foundry.applications.sidebar.tabs.AmbientSoundTab;
import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;

declare const directory: PlaceableDirectory.Any;

const tab = new AmbientSoundTab({ collectionName: "sounds", directory });

expectTypeOf(tab).toEqualTypeOf<AmbientSoundTab>();

declare class _TestAmbientSoundTabSubclass extends AmbientSoundTab {
  protected override _applyFilters(): void;
}

import type { Identity } from "#utils";
import type PlaceableTab from "./placeable-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AmbientSoundTab: AmbientSoundTab.Any;
    }
  }
}

/**
 * The AmbientSound-specific placeables tab.
 */
declare class AmbientSoundTab extends PlaceableTab<"sounds"> {
  constructor(options: PlaceableTab.InputOptions<AmbientSoundTab.Configuration>);

  protected override _applyFilters(): void;

  #AmbientSoundTab: true;
}

declare namespace AmbientSoundTab {
  interface Any extends AnyAmbientSoundTab {}
  interface AnyConstructor extends Identity<typeof AnyAmbientSoundTab> {}

  interface Configuration extends PlaceableTab.Configuration<"sounds"> {}
}

declare abstract class AnyAmbientSoundTab extends AmbientSoundTab {
  constructor(...args: never);
}

export default AmbientSoundTab;

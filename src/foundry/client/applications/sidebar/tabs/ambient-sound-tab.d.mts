import type { DeepPartial, Identity } from "#utils";
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
declare class AmbientSoundTab<
  RenderContext extends AmbientSoundTab.RenderContext = AmbientSoundTab.RenderContext,
  Configuration extends AmbientSoundTab.Configuration = AmbientSoundTab.Configuration,
  RenderOptions extends AmbientSoundTab.RenderOptions = AmbientSoundTab.RenderOptions,
> extends PlaceableTab<RenderContext, Configuration, RenderOptions> {
  /**
   * @remarks Also re-initializes every sound source, so that filtered-out sounds stop playing.
   */
  override _applyFilters(): void;

  #AmbientSoundTab: true;
}

declare namespace AmbientSoundTab {
  interface Any extends AnyAmbientSoundTab {}
  interface AnyConstructor extends Identity<typeof AnyAmbientSoundTab> {}

  interface RenderContext extends PlaceableTab.RenderContext {}

  interface Configuration<
    AmbientSoundTab extends AmbientSoundTab.Any = AmbientSoundTab.Any,
  > extends PlaceableTab.Configuration<AmbientSoundTab> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<AmbientSoundTab extends AmbientSoundTab.Any = AmbientSoundTab.Any> = DeepPartial<
    Omit<Configuration<AmbientSoundTab>, "collectionName" | "directory">
  > &
    object;

  interface RenderOptions extends PlaceableTab.RenderOptions {}
}

declare abstract class AnyAmbientSoundTab extends AmbientSoundTab<
  AmbientSoundTab.RenderContext,
  AmbientSoundTab.Configuration,
  AmbientSoundTab.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientSoundTab;

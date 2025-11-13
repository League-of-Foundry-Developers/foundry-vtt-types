import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The Collection of Setting documents which exist within the active World.
 * This collection is accessible as {@linkcode foundry.helpers.ClientSettings.storage | game.settings.storage}`.get("world")`
 *
 * @see {@linkcode foundry.documents.Setting} The Setting document
 */
declare class WorldSettings extends foundry.documents.abstract.WorldCollection<"Setting", "WorldSettings"> {
  static override documentName: "Setting";

  /** @privateRemarks Fake type override */
  static override get instance(): WorldSettings.Implementation;

  override get directory(): null;

  /**
   * Return the Setting or Keybind document with the given key.
   * @param key  - The setting key
   * @param user - For user-scoped settings, the user ID. (default `null`)
   * @returns The Setting.
   */
  getSetting(key: string, user?: string | null): Setting.Stored | undefined;

  /**
   * Return the serialized value of the world setting as a string
   * @param key  - The setting key
   * @param user - For user-scoped settings, the user ID.
   * @returns The serialized setting string
   */
  getItem(key: string, user?: string): string | null;
}

declare namespace WorldSettings {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode WorldSettings.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode WorldSettings.ImplementationClass} instead. This will be removed in v15.
   */
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyWorldSettings {}
    interface AnyConstructor extends Identity<typeof AnyWorldSettings> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Setting"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Setting"> {}

  /** @deprecated Replaced by {@linkcode WorldSettings.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode WorldSettings.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

declare abstract class AnyWorldSettings extends WorldSettings {
  constructor(...args: never);
}

export default WorldSettings;

import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The Collection of Setting documents which exist within the active World.
 * This collection is accessible as game.settings.storage.get("world")
 *
 * @see {@linkcode Setting} The Setting document
 */
declare class WorldSettings extends foundry.documents.abstract.WorldCollection<"Setting", "WorldSettings"> {
  static documentName: "Setting";

  override get directory(): null;

  /**
   * Return the Setting or Keybind document with the given key.
   * @param key  - The setting key
   * @param user - For user-scoped settings, the user ID. (default `null`)
   * @returns The Setting.
   */
  getSetting(key: string, user?: string | null): ReturnType<this["find"]>;

  /**
   * Return the serialized value of the world setting as a string
   * @param key  - The setting key
   * @param user - For user-scoped settings, the user ID.
   * @returns The serialized setting string
   */
  getItem(key: string, user?: string): string | null;
}

declare namespace WorldSettings {
  interface Any extends AnyWorldSettings {}
  interface AnyConstructor extends Identity<typeof AnyWorldSettings> {}

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Setting"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Setting"> {}

  /**
   * @deprecated Replaced by {@linkcode GlobalLightSource.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode GlobalLightSource.Implementation}.
   */
  type Configured = Implementation;
}

declare abstract class AnyWorldSettings extends WorldSettings {
  constructor(...args: never);
}

export default WorldSettings;

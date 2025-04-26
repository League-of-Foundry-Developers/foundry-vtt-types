import type { Identity } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The Collection of Setting documents which exist within the active World.
   * This collection is accessible as game.settings.storage.get("world")
   *
   * @see {@link Setting | `Setting`} The Setting document
   */
  class WorldSettings extends WorldCollection<Setting.ImplementationClass, "WorldSettings"> {
    static documentName: "Setting";

    override get directory(): null;

    /**
     * Return the Setting or Keybind document with the given key.
     * @param key - The setting key
     * @returns The Setting.
     */
    getSetting(key: string): ReturnType<this["find"]>;

    /**
     * Return the serialized value of the world setting as a string
     * @param key - The setting key
     * @returns The serialized setting string
     */
    getItem(key: string): string | null;
  }

  namespace WorldSettings {
    interface Any extends AnyWorldSettings {}
    interface AnyConstructor extends Identity<typeof AnyWorldSettings> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"Setting"> {}
    interface Configured extends Document.ConfiguredCollection<"Setting"> {}
  }
}

declare abstract class AnyWorldSettings extends WorldSettings {
  constructor(...args: never);
}

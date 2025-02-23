export {};

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
    type Any = AnyWorldSettings;
    type AnyConstructor = typeof AnyWorldSettings;
  }
}

declare abstract class AnyWorldSettings extends WorldSettings {
  constructor(arg0: never, ...args: never[]);
}

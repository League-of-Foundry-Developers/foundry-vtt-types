/**
 * The Collection of Setting documents which exist within the active World.
 * This collection is accessible as game.settings.storage.get("world")
 *
 * @see {@link Setting} The Setting document
 */
declare class WorldSettings extends WorldCollection<typeof foundry.documents.BaseSetting, "WorldSettings"> {
  static override documentName: "Setting";

  override get directory(): undefined;

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

/**
 * The Collection of Setting documents which exist within the active World.
 * This collection is accessible as game.settings.storages.get("world")
 *
 * @see {@link Macro} The Macro entity
 * @see {@link MacroDirectory} The MacroDirectory sidebar directory
 */
declare class WorldSettings extends WorldCollection<typeof foundry.documents.BaseSetting, 'WorldSettings'> {
  /** @override */
  static documentName: 'Setting';

  /** @override */
  get directory(): null;

  /**
   * Return the serialized value of the world setting as a string
   * @param key - The setting key
   * @returns The serialized setting string
   * @remarks The documentation is incorrect, this actually returns a `Setting | undefined`
   */
  getSetting(key: string): ReturnType<this['find']>;

  /**
   * Return the serialized value of the world setting as a string
   * @param key - The setting key
   * @returns The serialized setting string
   */
  getItem(key: string): string | null;
}

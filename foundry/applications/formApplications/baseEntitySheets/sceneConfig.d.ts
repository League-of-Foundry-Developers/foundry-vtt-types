/**
 * A Scene configuration sheet
 * @see {@link Scene} The Scene Entity which is being configured
 */
declare class SceneConfig extends BaseEntitySheet {
  /**
   * Get an enumeration of the available grid types which can be applied to this Scene
   */
  protected static _getGridTypes(): Record<string, string>;
}

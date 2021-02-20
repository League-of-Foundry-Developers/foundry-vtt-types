/**
 * A directory list of Macro entities. Unlike other directories, this app is only rendered in pop-out mode.
 *
 * @see {@link Macros}        The EntityCollection of Macro Entities
 * @see {@link Macro}         The Macro Entity
 * @see {@link MacroConfig}   The Macro Configuration Sheet
 */
declare class MacroDirectory extends SidebarDirectory {
  static get defaultOptions(): MacroDirectory.Options;

  /**
   * @override
   */
  static get entity(): 'Macro';

  /**
   * @override
   * @see {@link Game.macros}
   */
  static get collection(): Game['macros'];

  /**
   * @override
   */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /**
   * @override
   * @remarks This is never called.
   */
  protected _onCreate(event: Event): Promise<void>;

  /**
   * @param selector - (unused)
   * @override
   */
  protected _canDragStart(selector: string | null): true;
}

declare namespace MacroDirectory {
  interface Options extends SidebarDirectory.Options {
    /**
     * @defaultValue `'macros'`
     */
    id: string;

    /**
     * @defaultValue `'templates/sidebar/macro-directory.html'`
     */
    template: string;

    /**
     * @defaultValue `true`
     */
    canDrag: boolean;

    /**
     * @defaultValue `680`
     */
    height: number;
  }
}

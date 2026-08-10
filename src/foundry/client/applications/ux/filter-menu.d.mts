import type { FixedInstanceType, Identity, InexactPartial } from "#utils";
import type ContextMenu from "./context-menu.d.mts";

/**
 * A specialized subclass of ContextMenu designed for displaying a menu of filter options.
 */
declare class FilterMenu<UsesJQuery extends boolean = false> extends ContextMenu<UsesJQuery> {
  /**
   * @param container - The HTML element that contains the context menu targets.
   * @param selector  - A CSS selector which activates the context menu.
   * @param options   - Additional options to configure the context menu.
   *                    (default: `{}`)
   */
  constructor(container: HTMLElement, selector: string, options?: FilterMenu.Options<UsesJQuery>);

  /**
   * @deprecated This constructor is not valid at runtime and should not be used. It only exists at the type level
   * so this class satisfies every constructor {@linkcode ContextMenu} declares, which TypeScript requires in
   * order for `implementation` to be overridden with a narrower return type.
   */
  constructor(
    container: HTMLElement,
    selector: string | null | undefined,
    menuItems: ContextMenu.Entry<ContextMenu.JQueryOrHTML<UsesJQuery>>[],
    options: ContextMenu.ConstructorOptions<UsesJQuery>,
  );

  protected override _preRenderEntries(options?: ContextMenu.RenderOptions): Promise<void>;

  /**
   * Retrieve the configured FilterMenu implementation.
   */
  static override get implementation(): FilterMenu.ImplementationClass;

  #FilterMenu: true;
}

declare namespace FilterMenu {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyFilterMenu {}
    interface AnyConstructor extends Identity<typeof AnyFilterMenu> {}
  }

  interface ImplementationClass extends Identity<typeof CONFIG.ux.FilterMenu> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface Options<UsesJQuery extends boolean = false> extends InexactPartial<
    ContextMenu.ConstructorOptions<UsesJQuery>
  > {
    /**
     * The menu item generator.
     */
    menuItems?: (() => ContextMenu.Entry<ContextMenu.JQueryOrHTML<UsesJQuery>>[]) | undefined;
  }
}

declare abstract class AnyFilterMenu extends FilterMenu<boolean> {
  constructor(...args: never);
}

export default FilterMenu;

import type { FixedInstanceType, Identity, InexactPartial } from "#utils";
import type ContextMenu from "./context-menu.d.mts";

/**
 * A specialized subclass of ContextMenu designed for displaying a menu of filter options.
 * @remarks At runtime this class overrides {@linkcode ContextMenu.implementation | ContextMenu's static `implementation`}
 * getter to return the configured `CONFIG.ux.FilterMenu` class instead, but that cannot be typed here: `FilterMenu`'s
 * constructor (`container, selector, options?`) is fundamentally incompatible with `ContextMenu`'s
 * (`container, selector, menuItems, options`), which TypeScript does not permit for a `static` member override. Use
 * {@linkcode FilterMenu.ImplementationClass} to refer to the configured class by type instead.
 */
declare class FilterMenu extends ContextMenu<false> {
  /**
   * @param container - The HTML element that contains the context menu targets.
   * @param selector  - A CSS selector which activates the context menu.
   * @param options   - Additional options to configure the context menu.
   *                    (default: `{}`)
   */
  constructor(container: HTMLElement, selector: string, options?: FilterMenu.Options);

  protected override _preRenderEntries(options?: ContextMenu.RenderOptions): Promise<void>;

  #FilterMenu: true;
}

declare namespace FilterMenu {
  interface Any extends AnyFilterMenu {}
  interface AnyConstructor extends Identity<typeof AnyFilterMenu> {}

  interface ImplementationClass extends Identity<typeof CONFIG.ux.FilterMenu> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  /** @internal */
  interface _Options {
    /**
     * The menu item generator.
     */
    menuItems?: (() => ContextMenu.Entry<HTMLElement>[]) | undefined;
  }

  interface Options extends InexactPartial<Omit<ContextMenu.ConstructorOptions<false>, "jQuery">>, _Options {}
}

declare abstract class AnyFilterMenu extends FilterMenu {
  constructor(...args: never);
}

export default FilterMenu;

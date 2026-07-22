import type { DeepPartial, Identity } from "#utils";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type PlaceableTab from "./placeable-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TokenTab: TokenTab.Any;
    }
  }
}

/**
 * The Token-specific placeables tab.
 */
declare class TokenTab extends PlaceableTab<"tokens"> {
  constructor(options: PlaceableTab.InputOptions<TokenTab.Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   actions: {
   *     selectGroup: TokenTab.#onSelectGroup
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: TokenTab.DefaultOptions;

  /** @defaultValue `"templates/sidebar/tabs/placeable/tokens.hbs"` */
  static override DIRECTORY_PARTIAL: string;

  /** @defaultValue `"templates/sidebar/tabs/placeable/token.hbs"` */
  static override ENTRY_PARTIAL: string;

  protected override _prepareDirectoryContext(
    context: DeepPartial<TokenTab.RenderContext>,
    options: DeepPartial<PlaceableTab.RenderOptions>,
  ): Promise<TokenTab.RenderContext>;

  protected override _prepareEntry(
    entry: TokenDocument.Implementation,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<TokenTab.EntryContext>;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  #TokenTab: true;
}

declare namespace TokenTab {
  interface Any extends AnyTokenTab {}
  interface AnyConstructor extends Identity<typeof AnyTokenTab> {}

  interface Configuration extends PlaceableTab.Configuration<"tokens"> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface EntryContext extends PlaceableTab.EntryContext {
    /** @remarks Added by {@linkcode TokenTab._prepareEntry | #_prepareEntry} */
    levelId: string | null;
  }

  interface GroupContext {
    /** @remarks Omitted for the catch-all "NoLevel" group */
    id?: string | undefined;
    label: string;
    entries: EntryContext[];
  }

  interface RenderContext extends PlaceableTab.RenderContext {
    /**
     * @remarks Added by {@linkcode TokenTab._prepareDirectoryContext | #_prepareDirectoryContext}, only if the
     * viewed Scene has more than one Level.
     */
    groups?: GroupContext[] | undefined;
  }
}

declare abstract class AnyTokenTab extends TokenTab {
  constructor(...args: never);
}

export default TokenTab;

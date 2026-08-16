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
declare class TokenTab<
  RenderContext extends TokenTab.RenderContext = TokenTab.RenderContext,
  Configuration extends TokenTab.Configuration = TokenTab.Configuration,
  RenderOptions extends TokenTab.RenderOptions = TokenTab.RenderOptions,
> extends PlaceableTab<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: TokenTab.DefaultOptions;

  /**
   * @defaultValue `"templates/sidebar/tabs/placeable/tokens.hbs"`
   */
  static override DIRECTORY_PARTIAL: string;

  /**
   * @defaultValue `"templates/sidebar/tabs/placeable/token.hbs"`
   */
  static override ENTRY_PARTIAL: string;

  /**
   * @remarks Groups the prepared entries by level, ordered from the topmost level down, with any tokens
   * on no known level in a trailing group. Only groups when the Scene has more than one level.
   */
  protected override _prepareDirectoryContext(
    context: RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<RenderContext>;

  protected override _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<TokenTab.EntryContext>;

  /**
   * @remarks Adds a "Change Level" entry directly before the inherited "Delete" entry.
   */
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  #TokenTab: true;

  static #TokenTabStatic: true;
}

declare namespace TokenTab {
  interface Any extends AnyTokenTab {}
  interface AnyConstructor extends Identity<typeof AnyTokenTab> {}

  interface EntryContext extends PlaceableTab.EntryContext {
    /** The ID of the level the token occupies. */
    levelId: string;
  }

  /** The tokens on a single level, rendered as one collapsible group. */
  interface Group {
    /** @remarks Absent from the group holding tokens on no known level. */
    id?: string | undefined;

    label: string;

    entries: EntryContext[];
  }

  interface RenderContext extends PlaceableTab.RenderContext {
    entries?: EntryContext[] | undefined;

    /** @remarks Only prepared when the Scene has more than one level. */
    groups?: Group[] | undefined;
  }

  interface Configuration<TokenTab extends TokenTab.Any = TokenTab.Any> extends PlaceableTab.Configuration<TokenTab> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<TokenTab extends TokenTab.Any = TokenTab.Any> = DeepPartial<
    Omit<Configuration<TokenTab>, "collectionName" | "directory">
  > &
    object;

  interface RenderOptions extends PlaceableTab.RenderOptions {}
}

declare abstract class AnyTokenTab extends TokenTab<
  TokenTab.RenderContext,
  TokenTab.Configuration,
  TokenTab.RenderOptions
> {
  constructor(...args: never);
}

export default TokenTab;

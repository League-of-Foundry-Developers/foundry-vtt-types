import type { DeepPartial, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CardsConfig: CardsConfig.Any;
      CardDeckConfig: CardDeckConfig.Any;
      CardHandConfig: CardHandConfig.Any;
      CardPileConfig: CardPileConfig.Any;
    }
  }
}

/**
 * A DocumentSheet application responsible for displaying and editing a single Cards stack.
 */
declare class CardsConfig<
  RenderContext extends CardsConfig.RenderContext = CardsConfig.RenderContext,
  Configuration extends CardsConfig.Configuration = CardsConfig.Configuration,
  RenderOptions extends CardsConfig.RenderOptions = CardsConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Cards.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare a sorted array of cards for display in the sheet.
   * @remarks Defaults to the sheet's current sort mode, which this call then updates.
   */
  protected _prepareCards(sortMode?: CardsConfig.SortMode): Card.Implementation[];

  /**
   * Configure footer buttons for the window.
   * @remarks Empty when the current User lacks the sheet's configured `editPermission`.
   */
  protected _prepareButtons(): ApplicationV2.FormFooterButton[];

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * The "dragstart" event handler for individual cards
   */
  protected _onDragStart(event: DragEvent): Promise<void>;

  /**
   * The "dragover" event handler for individual cards
   */
  protected _onDragOver(event: DragEvent): Promise<void>;

  /**
   * The "dragdrop" event handler for individual cards
   */
  protected _onDrop(event: DragEvent): Promise<Cards.Implementation | undefined>;

  #CardsConfig: true;
}

declare namespace CardsConfig {
  interface Any extends AnyCardsConfig {}
  interface AnyConstructor extends Identity<typeof AnyCardsConfig> {}

  /** The sorting mode for the list of cards. */
  type SortMode = "standard" | "shuffled";

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<Cards.Implementation>,
      IntentionalPartial<PreparePartContext> {
    inCompendium: boolean;
  }

  /** @remarks Added by {@linkcode CardsConfig._preparePartContext | #_preparePartContext} */
  interface PreparePartContext {
    /** @remarks Added for the `cards` part. */
    cards: Card.Implementation[];

    /** @remarks Added for the `cards` part. */
    cardTypes: typeof CONFIG.Card.typeLabels;

    /** @remarks Added for the `cards` part; `"fa-random"` while shuffled, `"fa-arrow-up-1-9"` otherwise. */
    sortModeIcon: string;

    /** @remarks Added for the `footer` part. */
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Cards.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {
    /**
     * The sort mode to apply when re-rendering the `cards` part.
     * @remarks Passed by the `toggleSort` action; when omitted the sheet keeps its current sort mode.
     */
    sortMode: SortMode | undefined;
  }
}

declare abstract class AnyCardsConfig extends CardsConfig<
  CardsConfig.RenderContext,
  CardsConfig.Configuration,
  CardsConfig.RenderOptions
> {
  constructor(...args: never);
}

/**
 * A CardsConfig subclass providing a sheet representation for Cards documents with the "deck" type.
 */
declare class CardDeckConfig<
  RenderContext extends CardDeckConfig.RenderContext = CardDeckConfig.RenderContext,
  Configuration extends CardDeckConfig.Configuration = CardDeckConfig.Configuration,
  RenderOptions extends CardDeckConfig.RenderOptions = CardDeckConfig.RenderOptions,
> extends CardsConfig<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _prepareButtons(): ApplicationV2.FormFooterButton[];

  static #CardDeckConfig: true;
}

declare namespace CardDeckConfig {
  interface Any extends AnyCardDeckConfig {}
  interface AnyConstructor extends Identity<typeof AnyCardDeckConfig> {}

  interface RenderContext extends CardsConfig.RenderContext, IntentionalPartial<PreparePartContext> {}

  /** @remarks Added by {@linkcode CardDeckConfig._preparePartContext | #_preparePartContext} */
  interface PreparePartContext {
    /** @remarks Only added when the part being rendered is also a tab of the `sheet` group. */
    tab: ApplicationV2.Tab;

    /** @remarks Added for the `tabs` part. */
    tabClasses: string;
  }

  interface Configuration extends CardsConfig.Configuration {}
  interface RenderOptions extends CardsConfig.RenderOptions {}
}

declare abstract class AnyCardDeckConfig extends CardDeckConfig<
  CardDeckConfig.RenderContext,
  CardDeckConfig.Configuration,
  CardDeckConfig.RenderOptions
> {
  constructor(...args: never);
}

/**
 * A CardsConfig subclass providing a sheet representation for Cards documents with the "hand" type.
 */
declare class CardHandConfig<
  RenderContext extends CardHandConfig.RenderContext = CardHandConfig.RenderContext,
  Configuration extends CardHandConfig.Configuration = CardHandConfig.Configuration,
  RenderOptions extends CardHandConfig.RenderOptions = CardHandConfig.RenderOptions,
> extends CardsConfig<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareButtons(): ApplicationV2.FormFooterButton[];

  static #CardHandConfig: true;
}

declare namespace CardHandConfig {
  interface Any extends AnyCardHandConfig {}
  interface AnyConstructor extends Identity<typeof AnyCardHandConfig> {}

  interface RenderContext extends CardsConfig.RenderContext {}
  interface Configuration extends CardsConfig.Configuration {}
  interface RenderOptions extends CardsConfig.RenderOptions {}
}

declare abstract class AnyCardHandConfig extends CardHandConfig<
  CardHandConfig.RenderContext,
  CardHandConfig.Configuration,
  CardHandConfig.RenderOptions
> {
  constructor(...args: never);
}

/**
 * A subclass of CardsConfig providing a sheet representation for Cards documents with the "pile" type.
 */
declare class CardPileConfig<
  RenderContext extends CardPileConfig.RenderContext = CardPileConfig.RenderContext,
  Configuration extends CardPileConfig.Configuration = CardPileConfig.Configuration,
  RenderOptions extends CardPileConfig.RenderOptions = CardPileConfig.RenderOptions,
> extends CardsConfig<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareButtons(): ApplicationV2.FormFooterButton[];
}

declare namespace CardPileConfig {
  interface Any extends AnyCardPileConfig {}
  interface AnyConstructor extends Identity<typeof AnyCardPileConfig> {}

  interface RenderContext extends CardsConfig.RenderContext {}
  interface Configuration extends CardsConfig.Configuration {}
  interface RenderOptions extends CardsConfig.RenderOptions {}
}

declare abstract class AnyCardPileConfig extends CardPileConfig<
  CardPileConfig.RenderContext,
  CardPileConfig.Configuration,
  CardPileConfig.RenderOptions
> {
  constructor(...args: never);
}

export { CardsConfig, CardDeckConfig, CardHandConfig, CardPileConfig };

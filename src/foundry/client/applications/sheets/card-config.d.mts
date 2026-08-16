import type { DeepPartial, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CardConfig: CardConfig.Any;
    }
  }
}

/**
 * A DocumentSheet application responsible for displaying and editing a single embedded Card document.
 */
declare class CardConfig<
  RenderContext extends CardConfig.RenderContext = CardConfig.RenderContext,
  Configuration extends CardConfig.Configuration = CardConfig.Configuration,
  RenderOptions extends CardConfig.RenderOptions = CardConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Card.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["card-config"],
   *   position: {width: 480},
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-card-diamond"
   *   },
   *   form: {
   *     closeOnSubmit: true
   *   },
   *   actions: {
   *     addFace: CardConfig.#onAddFace,
   *     deleteFace: CardConfig.#onDeleteFace
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   header: {template: "templates/cards/card/header.hbs"},
   *   tabs: {template: "templates/generic/tab-navigation.hbs"},
   *   details: {template: "templates/cards/card/details.hbs"},
   *   faces: {template: "templates/cards/card/faces.hbs", scrollable: [""]},
   *   back: {template: "templates/cards/card/back.hbs"},
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       {id: "details", icon: "fa-solid fa-memo"},
   *       {id: "faces", icon: "fa-solid fa-image-portrait"},
   *       {id: "back", icon: "fa-solid fa-card-heart"}
   *     ],
   *     initial: "details",
   *     labelPrefix: "CARD.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * Card types with pre-localized labels
   */
  static get TYPES(): Record<string, string>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  static #CardConfig: true;
}

declare namespace CardConfig {
  interface Any extends AnyCardConfig {}
  interface AnyConstructor extends Identity<typeof AnyCardConfig> {}

  /**
   * @remarks Every added member comes from
   * {@linkcode CardConfig._preparePartContext | #_preparePartContext}, which only sets the members the part
   * being rendered consumes, so they are all `IntentionalPartial`ed.
   */
  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<Card.Implementation>,
      IntentionalPartial<PreparePartContext> {}

  /** @remarks Added by {@linkcode CardConfig._preparePartContext | #_preparePartContext} */
  interface PreparePartContext {
    /** @remarks Only added when the part being rendered is also a tab of the `sheet` group. */
    tab: ApplicationV2.Tab;

    /** @remarks Added for the `details` part; the value of {@linkcode CardConfig.TYPES}. */
    types: Record<string, string>;

    /** @remarks Added for the `faces` part. */
    faceFields: Card.FaceSchema;

    /** @remarks Added for the `footer` part. */
    buttons: ApplicationV2.FormFooterButton[];

    /** @remarks Added for the `tabs` part. */
    tabClasses: string;
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Card.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyCardConfig extends CardConfig<
  CardConfig.RenderContext,
  CardConfig.Configuration,
  CardConfig.RenderOptions
> {
  constructor(...args: never);
}

export default CardConfig;

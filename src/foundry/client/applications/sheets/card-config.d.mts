import type { DeepPartial, Identity } from "#utils";
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
  RenderContext extends object = CardConfig.RenderContext,
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
   *   position: { width: 480 },
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

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       { id: "details", icon: "fa-solid fa-memo" },
   *       { id: "faces", icon: "fa-solid fa-image-portrait" },
   *       { id: "back", icon: "fa-solid fa-card-heart" }
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

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Card.Implementation> {
    tab?: ApplicationV2.Tab | undefined;
    tabs?: Record<string, ApplicationV2.Tab>;
    tabClasses?: string | undefined;
    types?: Record<string, string> | undefined;
    faceFields?: Card.FaceSchema | undefined;
    buttons?: ApplicationV2.FormFooterButton[] | undefined;
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

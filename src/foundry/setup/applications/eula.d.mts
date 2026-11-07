import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "#client/applications/api/application.d.mts";
import type HandlebarsApplicationMixin from "#client/applications/api/handlebars-application.d.mts";

/**
 * Display the End User License Agreement and prompt the user to agree before moving forwards.
 */
declare class EULA<
  RenderContext extends EULA.RenderContext = EULA.RenderContext,
  Configuration extends EULA.Configuration = EULA.Configuration,
  RenderOptions extends EULA.RenderOptions = EULA.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "eula",
   *   classes: ["themed", "theme-dark"],
   *   tag: "aside",
   *   window: {
   *     title: "End User License Agreement",
   *     icon: "fa-solid fa-file-contract",
   *     minimizable: false
   *   },
   *   position: {
   *     width: 800,
   *     height: "auto"
   *   },
   *   actions: {
   *     accept: EULA.#onClickAccept,
   *     decline: EULA.#onClickDecline
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: EULA.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   content: {
   *     id: "content",
   *     template: "templates/setup/parts/eula-content.hbs",
   *     scrollable: [""]
   *   },
   *   form: {
   *     id: "form",
   *     template: "templates/setup/parts/eula-form.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Does not call `super`; the context is only the fetched `license.html`.
   */
  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * @remarks Removes the window's controls and close button, so the agreement cannot be dismissed.
   */
  protected override _renderFrame(options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  static #EULA: true;
}

declare namespace EULA {
  interface Any extends AnyEULA {}
  interface AnyConstructor extends Identity<typeof AnyEULA> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    /** @remarks The text of `license.html`. */
    html: string;
  }

  interface Configuration<EULA extends EULA.Any = EULA.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<EULA> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<EULA extends EULA.Any = EULA.Any> = DeepPartial<Configuration<EULA>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyEULA extends EULA<EULA.RenderContext, EULA.Configuration, EULA.RenderOptions> {
  constructor(...args: never);
}

export default EULA;

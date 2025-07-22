import type { DeepPartial, FixedInstanceType, Mixin } from "#utils";
import type ApplicationV2 from "./application.d.mts";
import type DocumentSheetV2 from "./document-sheet.d.mts";

/**
 * The mixed application class augmented with [Handlebars](https://handlebarsjs.com) template rendering behavior.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class HandlebarsApplication {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__RenderContext]: {};

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__Configuration]: {};

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__RenderOptions]: {};

  /**
   * Configure a registry of template parts which are supported for this application for partial rendering.
   * @defaultValue `{}`
   */
  static PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * A record of all rendered template parts.
   * @defaultValue `{}`
   */
  get parts(): Record<string, HTMLElement>;

  protected _configureRenderOptions(options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>): void;

  /**
   * Allow subclasses to dynamically configure render parts.
   */
  protected _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected _preRender(
    context: DeepPartial<ApplicationV2.RenderContextOf<this>>,
    options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
  ): Promise<void>;

  /**
   * Render each configured application part using Handlebars templates.
   * @param context - Context data for the render operation
   * @param options - Options which configure application rendering behavior
   * @returns A single rendered HTMLElement for each requested part
   */
  protected _renderHTML(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
  ): Promise<Record<string, HTMLElement>>;

  /**
   * Prepare context that is specific to only a single rendered part.
   *
   * It is recommended to augment or mutate the shared context so that downstream methods like _onRender have
   * visibility into the data that was used for rendering. It is acceptable to return a different context object
   * rather than mutating the shared context at the expense of this transparency.
   *
   * @param partId  - The part being rendered
   * @param context - Shared context provided by _prepareContext
   * @param options - Options which configure application rendering behavior
   * @returns Context data for a specific part
   */
  protected _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Replace the HTML of the application with the result provided by Handlebars rendering.
   * @param result  - The result from Handlebars template rendering
   * @param content - The content element into which the rendered result must be inserted
   * @param options - Options which configure application rendering behavior
   */
  protected _replaceHTML(
    result: Record<string, HTMLElement>,
    content: HTMLElement,
    options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
  ): void;

  /**
   * Prepare data used to synchronize the state of a template part.
   * @param partId       - The id of the part being rendered
   * @param newElement   - The new rendered HTML element for the part
   * @param priorElement - The prior rendered HTML element for the part
   * @param state        - A state object which is used to synchronize after replacement
   */
  protected _preSyncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  /**
   * Synchronize the state of a template part after it has been rendered and replaced in the DOM.
   * @param partId       - The id of the part being rendered
   * @param newElement   - The new rendered HTML element for the part
   * @param priorElement - The prior rendered HTML element for the part
   * @param state        - A state object which is used to synchronize after replacement
   */
  protected _syncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  protected _tearDown(options: DeepPartial<ApplicationV2.ClosingOptions>): void;

  /**
   * Attach event listeners to rendered template parts.
   * @param partId      - The id of the part being rendered
   * @param htmlElement - The rendered HTML element for the part
   * @param options     - Rendering options passed to the render method
   */
  protected _attachPartListeners(
    partId: string,
    htmlElement: HTMLElement,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): void;
}

/**
 * Augment an Application class with [Handlebars](https://handlebarsjs.com) template rendering behavior.
 */
declare function HandlebarsApplicationMixin<BaseClass extends HandlebarsApplicationMixin.BaseClass>(
  BaseApplication: BaseClass,
): HandlebarsApplicationMixin.Mix<BaseClass>;

declare namespace HandlebarsApplicationMixin {
  interface AnyMixedConstructor extends ReturnType<typeof HandlebarsApplicationMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = ApplicationV2.Internal.Constructor;
  type Mix<BaseClass extends HandlebarsApplicationMixin.BaseClass> = Mixin<typeof HandlebarsApplication, BaseClass>;

  interface PartState {
    scrollPositions: Array<[el1: HTMLElement, scrollTop: number, scrollLeft: number]>;
    focus?: string | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RenderContext {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Configuration {}

  interface RenderOptions {
    parts: string[];
  }

  /**
   * @deprecated Merge {@linkcode ApplicationV2.RenderOptions} and {@linkcode HandlebarsApplicationMixin.RenderOptions} individually.
   */
  interface ApplicationV2RenderOptions extends RenderOptions, ApplicationV2.RenderOptions {}

  /**
   * @deprecated Merge {@linkcode DocumentSheetV2.RenderOptions} and {@linkcode HandlebarsApplicationMixin.RenderOptions} individually.
   */
  interface DocumentSheetV2RenderOptions extends RenderOptions, DocumentSheetV2.RenderOptions {}

  interface HandlebarsTemplatePart {
    /**
     * The template entry-point for the part
     */
    template: string;

    /**
     * A CSS id to assign to the top-level element of the rendered part.
     * This id string is automatically prefixed by the application id.
     */
    id?: string | null | undefined;

    /**
     * Does this rendered contents of this template part replace the children of the root element?
     */
    root?: boolean | null | undefined;

    /**
     * An array of CSS classes to apply to the top-level element of the
     * rendered part.
     */
    classes?: string[] | null | undefined;

    /**
     * An array of additional templates that are required to render the part.
     * If omitted, only the entry-point is inferred as required.
     */
    templates?: string[] | null | undefined;

    /**
     * An array of selectors within this part whose scroll positions should
     * be persisted during a re-render operation. A blank string is used
     * to denote that the root level of the part is scrollable.
     */
    scrollable?: string[] | null | undefined;

    /**
     * A registry of forms selectors and submission handlers.
     */
    forms?: Record<string, ApplicationV2.FormConfiguration> | null | undefined;
  }

  namespace HandlebarsApplication {
    /**
     * @deprecated Use {@linkcode ApplicationV2.RenderContextOf} instead.
     */
    // Note(LukeAbby): `object` is returned in the false case instead of `never` because otherwise errors will crop up at usage sites like "any cannot be assigned to `never`".
    type RenderContextFor<Instance extends HandlebarsApplication> =
      Instance extends ApplicationV2.Internal.Instance<infer RenderContext, infer _1, infer _2>
        ? RenderContext
        : object;

    /**
     * @deprecated Use {@linkcode ApplicationV2.ConfigurationOf} instead.
     */
    type ConfigurationFor<Instance extends HandlebarsApplication> =
      Instance extends ApplicationV2.Internal.Instance<infer _1, infer Configuration, infer _2>
        ? Configuration
        : unknown;

    /**
     * @deprecated Use {@linkcode ApplicationV2.RenderOptionsOf} instead.
     */
    type RenderOptionsFor<Instance extends HandlebarsApplication> =
      Instance extends ApplicationV2.Internal.Instance<infer _1, infer _2, infer RenderOptions>
        ? RenderOptions
        : object;
  }
}

export default HandlebarsApplicationMixin;

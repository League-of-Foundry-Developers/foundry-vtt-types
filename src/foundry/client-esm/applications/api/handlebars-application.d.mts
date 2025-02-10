import type { DeepPartial, FixedInstanceType, Mixin } from "fvtt-types/utils";
import type ApplicationV2 from "./application.d.mts";
import type DocumentSheetV2 from "./document-sheet.d.mts";

/**
 * Augment an Application class with [Handlebars](https://handlebarsjs.com) template rendering behavior.
 */
declare function HandlebarsApplicationMixin<BaseClass extends HandlebarsApplicationMixin.BaseClass>(
  BaseApplication: BaseClass,
): Mixin<typeof HandlebarsApplicationMixin.HandlebarsApplication, BaseClass>;

declare namespace HandlebarsApplicationMixin {
  type AnyMixedConstructor = ReturnType<typeof HandlebarsApplicationMixin<BaseClass>>;
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = ApplicationV2.Internal.Constructor;

  interface PartState {
    scrollPositions: Array<[el1: HTMLElement, scrollTop: number, scrollLeft: number]>;
    focus?: string | undefined;
  }

  interface RenderOptions {
    parts: string[];
  }
  interface ApplicationV2RenderOptions extends RenderOptions, ApplicationV2.RenderOptions {}
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
    id?: string;

    /**
     * An array of CSS classes to apply to the top-level element of the
     * rendered part.
     */
    classes?: string[];

    /**
     * An array of templates that are required to render the part.
     * If omitted, only the entry-point is inferred as required.
     */
    templates?: string[];

    /**
     * An array of selectors within this part whose scroll positions should
     * be persisted during a re-render operation. A blank string is used
     * to denote that the root level of the part is scrollable.
     */
    scrollable?: string[];

    /**
     * A registry of forms selectors and submission handlers.
     */
    forms?: Record<string, ApplicationV2.FormConfiguration>;
  }

  namespace HandlebarsApplication {
    // Note(LukeAbby): `unknown` is returned in the false case instead of `never` because otherwise errors will crop up at usage sites like "any cannot be assigned to `never`".
    type ConfigurationFor<Instance extends HandlebarsApplication> =
      Instance extends ApplicationV2.Internal.Instance<infer Configuration, infer _1, infer _2>
        ? Configuration
        : unknown;

    type RenderOptionsFor<Instance extends HandlebarsApplication> =
      Instance extends ApplicationV2.Internal.Instance<infer _1, infer RenderOptions, infer _2>
        ? RenderOptions
        : object;

    type RenderContextFor<Instance extends HandlebarsApplication> =
      Instance extends ApplicationV2.Internal.Instance<infer _1, infer _2, infer RenderContext>
        ? RenderContext
        : object;
  }

  /**
   * The mixed application class augmented with [Handlebars](https://handlebarsjs.com) template rendering behavior.
   *
   * @remarks This does NOT exist at runtime. This is only here to be used as a type when relevant as well as to avoid
   * issues with anonymous mixin classes.
   */
  class HandlebarsApplication {
    /** @privateRemarks All mixin classses should accept anything for its constructor. */
    constructor(...args: any[]);

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

    protected _preFirstRender(
      context: DeepPartial<HandlebarsApplication.RenderContextFor<this>>,
      options: DeepPartial<HandlebarsApplication.RenderOptionsFor<this>>,
    ): Promise<void>;

    /**
     * Render each configured application part using Handlebars templates.
     * @param context - Context data for the render operation
     * @param options - Options which configure application rendering behavior
     * @returns A single rendered HTMLElement for each requested part
     */
    protected _renderHTML(
      context: HandlebarsApplication.RenderContextFor<this>,
      options: DeepPartial<HandlebarsApplication.RenderOptionsFor<this>>,
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
      context: HandlebarsApplication.RenderContextFor<this>,
      options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
    ): Promise<HandlebarsApplication.RenderContextFor<this>>;

    /**
     * Replace the HTML of the application with the result provided by Handlebars rendering.
     * @param result  - The result from Handlebars template rendering
     * @param content - The content element into which the rendered result must be inserted
     * @param options - Options which configure application rendering behavior
     */
    protected _replaceHTML(
      result: Record<string, HTMLElement>,
      content: HTMLElement,
      options: DeepPartial<HandlebarsApplication.RenderOptionsFor<this>>,
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
}

export default HandlebarsApplicationMixin;

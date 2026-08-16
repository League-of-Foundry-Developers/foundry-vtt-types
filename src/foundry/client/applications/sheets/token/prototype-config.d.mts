import type { PrototypeToken } from "#common/data/data.mjs";
import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";
import type TokenApplicationMixin from "./mixin.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PrototypeTokenConfig: PrototypeTokenConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring an actor's PrototypeToken
 */
declare class PrototypeTokenConfig<
  RenderContext extends PrototypeTokenConfig.RenderContext = PrototypeTokenConfig.RenderContext,
  Configuration extends PrototypeTokenConfig.Configuration = PrototypeTokenConfig.Configuration,
  RenderOptions extends PrototypeTokenConfig.RenderOptions = PrototypeTokenConfig.RenderOptions,
> extends TokenApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  constructor(options: PrototypeTokenConfig.InputOptions<Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   tag: "form",
   *   classes: ["prototype-token-config"],
   *   actions: {
   *     assignToken: PrototypeTokenConfig.#onAssignToken,
   *     cycleImage: PrototypeTokenConfig.#onCycleImage,
   *     openOverridesConfig: PrototypeTokenConfig.#onOpenOverridesConfig
   *   },
   *   form: {
   *     handler: PrototypeTokenConfig.#onSubmit
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PrototypeTokenConfig.DefaultOptions;

  override isPrototype: true;

  override get title(): string;

  override get token(): PrototypeToken;

  /**
   * The preview.
   */
  protected override _preview: PrototypeToken | null;

  override get actor(): Actor.Implementation;

  protected override get _fields(): PrototypeToken.Schema;

  /**
   * Is this sheet visible to the user?
   */
  get isVisible(): boolean;

  /**
   * @throws If the sheet is not {@linkcode PrototypeTokenConfig.isVisible | #isVisible}.
   */
  protected override _canRender(options: DeepPartial<RenderOptions>): boolean | void;

  /**
   * @throws If the configured prototype token's parent Actor has no UUID.
   */
  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _prepareAppearanceTab(): Promise<PrototypeTokenConfig.AppearanceTabContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _prepareButtons(): ApplicationV2.FormFooterButton[];

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  /**
   * Preview changes.
   * @param changes - The changes to preview.
   */
  protected _previewChanges(changes: TokenApplicationMixin.SubmitData): void;

  /**
   * Customize how form data is extracted into an expanded object.
   * @param event    - The originating form submission event
   * @param form     - The form element that was submitted
   * @param formData - Processed data for the submitted form
   * @returns An expanded object of processed form data
   * @throws Subclasses may throw validation errors here to prevent form submission
   */
  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): TokenApplicationMixin.SubmitData;

  protected override _tearDown(options: ApplicationV2.ClosingOptions): void;

  static #PrototypeTokenConfigStatic: true;
  #PrototypeTokenConfig: true;
}

declare namespace PrototypeTokenConfig {
  interface Any extends AnyPrototypeTokenConfig {}
  interface AnyConstructor extends Identity<typeof AnyPrototypeTokenConfig> {}

  /** The options accepted by the {@linkcode PrototypeTokenConfig} constructor; `prototype` is required. */
  type InputOptions<Configuration extends PrototypeTokenConfig.Configuration> = DeepPartial<
    Omit<Configuration, "prototype">
  > & {
    prototype: PrototypeToken;
  };

  interface RenderContext extends TokenApplicationMixin.RenderContext<PrototypeToken>, ApplicationV2.RenderContext {
    /** @remarks The preview clone of the prototype token, not the prototype token itself. */
    document: PrototypeToken;

    /** @remarks The same value as {@linkcode RenderContext.document | context.document}. */
    model: PrototypeToken;

    source: PrototypeToken.Source;

    rootId: string;

    /** @remarks The localization of `"MEASUREMENT.GridUnits"`. */
    gridUnits: string;

    /**
     * @remarks Merged in for the `appearance` part, on top of the mixin's tab members; see
     * {@linkcode AppearanceTabContext.imagePreview}.
     */
    imagePreview?: ImagePreviewContext | undefined;
  }

  /** @remarks Added for the `appearance` part. */
  interface AppearanceTabContext extends TokenApplicationMixin.AppearanceTabContext {
    /**
     * @remarks Only added when the token has a texture source, or a wildcard path that matches at least one file.
     */
    imagePreview?: ImagePreviewContext | undefined;
  }

  /**
   * @remarks The wildcard-only members are absent unless the token uses `randomImg`.
   */
  interface ImagePreviewContext {
    src: string;

    /** @remarks `"token-image-preview wildcard"` for a wildcard image, otherwise `"token-image-preview"`. */
    cls: string;

    isVideo: boolean;

    hasPrev?: boolean | undefined;

    hasNext?: boolean | undefined;

    /** @remarks The 1-based index of the previewed image. */
    current?: number | undefined;

    total?: number | undefined;
  }

  interface Configuration<PrototypeTokenConfig extends PrototypeTokenConfig.Any = PrototypeTokenConfig.Any>
    extends TokenApplicationMixin.Configuration, ApplicationV2.Configuration<PrototypeTokenConfig> {
    /**
     * The prototype token being edited
     */
    prototype: PrototypeToken;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<PrototypeTokenConfig extends PrototypeTokenConfig.Any = PrototypeTokenConfig.Any> = DeepPartial<
    Configuration<PrototypeTokenConfig>
  > &
    object;

  interface RenderOptions extends TokenApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyPrototypeTokenConfig extends PrototypeTokenConfig<
  PrototypeTokenConfig.RenderContext,
  PrototypeTokenConfig.Configuration,
  PrototypeTokenConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PrototypeTokenConfig;

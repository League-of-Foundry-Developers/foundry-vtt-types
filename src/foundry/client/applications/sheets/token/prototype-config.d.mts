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

  /** @override */
  override isPrototype: true;

  override get title(): string;

  override get token(): PrototypeToken;

  /**
   * The preview.
   */
  protected override _preview: PrototypeToken | null;

  override get actor(): Actor.Implementation | null;

  protected override get _fields(): PrototypeToken.Schema;

  /**
   * Is this sheet visible to the user?
   */
  get isVisible(): boolean;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

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
  protected _previewChanges(changes: PrototypeToken.UpdateData): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): object;

  protected override _tearDown(options: DeepPartial<ApplicationV2.ClosingOptions>): void;

  #PrototypeTokenConfig: true;
}

declare namespace PrototypeTokenConfig {
  interface Any extends AnyPrototypeTokenConfig {}
  interface AnyConstructor extends Identity<typeof AnyPrototypeTokenConfig> {}

  interface RenderContext extends TokenApplicationMixin.RenderContext<PrototypeToken>, ApplicationV2.RenderContext {}

  interface AppearanceTabContext extends TokenApplicationMixin.AppearanceTabContext {
    imagePreview?:
      | {
          src: string;
          cls: string;
          isVideo: boolean;
          hasPrev?: boolean;
          hasNext?: boolean;
          current?: number;
          total?: number;
        }
      | undefined;
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

  /**
   * @remarks `prototype` is deliberately excluded from the `DeepPartial` applied to the rest of the
   * options, mirroring {@linkcode foundry.applications.api.DocumentSheetV2.InputOptions | DocumentSheetV2.InputOptions}.
   * `PrototypeToken` instances are not designed to be deep-partialed (their circular structure isn't
   * bounded the way {@linkcode Node} is), so allowing that recursion to reach into `prototype`
   * produces incorrect and extremely expensive-to-check types.
   */
  type InputOptions<Configuration extends PrototypeTokenConfig.Configuration = PrototypeTokenConfig.Configuration> =
    DeepPartial<Omit<Configuration, "prototype">> & {
      prototype: Configuration["prototype"];
    };

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

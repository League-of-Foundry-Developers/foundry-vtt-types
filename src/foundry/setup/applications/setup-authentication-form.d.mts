import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "#client/applications/api/application.d.mts";
import type HandlebarsApplicationMixin from "#client/applications/api/handlebars-application.d.mts";

/**
 * The Setup Authentication Form.
 * Prompt the user to provide a server administrator password if one has been configured.
 */
declare class SetupAuthenticationForm<
  RenderContext extends SetupAuthenticationForm.RenderContext = SetupAuthenticationForm.RenderContext,
  Configuration extends SetupAuthenticationForm.Configuration = SetupAuthenticationForm.Configuration,
  RenderOptions extends SetupAuthenticationForm.RenderOptions = SetupAuthenticationForm.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "setup-authentication",
   *   classes: ["application", "framed"],
   *   window: {
   *     frame: false,
   *     positioned: false
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: SetupAuthenticationForm.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   form: {
   *     template: "templates/setup/setup-authentication.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;
}

declare namespace SetupAuthenticationForm {
  interface Any extends AnySetupAuthenticationForm {}
  interface AnyConstructor extends Identity<typeof AnySetupAuthenticationForm> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    /** @remarks Whether the server requires an administrator username as well as a password. */
    usernameRequired: boolean;
  }

  interface Configuration<SetupAuthenticationForm extends SetupAuthenticationForm.Any = SetupAuthenticationForm.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<SetupAuthenticationForm> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<SetupAuthenticationForm extends SetupAuthenticationForm.Any = SetupAuthenticationForm.Any> =
    DeepPartial<Configuration<SetupAuthenticationForm>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnySetupAuthenticationForm extends SetupAuthenticationForm<
  SetupAuthenticationForm.RenderContext,
  SetupAuthenticationForm.Configuration,
  SetupAuthenticationForm.RenderOptions
> {
  constructor(...args: never);
}

export default SetupAuthenticationForm;

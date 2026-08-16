import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { DataField } from "#common/data/fields.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      UserConfig: UserConfig.Any;
    }
  }
}

/**
 * The User configuration application.
 */
declare class UserConfig<
  RenderContext extends UserConfig.RenderContext = UserConfig.RenderContext,
  Configuration extends UserConfig.Configuration = UserConfig.Configuration,
  RenderOptions extends UserConfig.RenderOptions = UserConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  User.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["user-config"],
   *   position: {width: 480},
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-user"
   *   },
   *   actions: {
   *     releaseCharacter: UserConfig.#onReleaseCharacter
   *   },
   *   form: {
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   form: {
   *     id: "form",
   *     template: "templates/sheets/user-config.hbs",
   *     scrollable: [""]
   *   },
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  override get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  static #UserConfig: true;
}

declare namespace UserConfig {
  interface Any extends AnyUserConfig {}
  interface AnyConstructor extends Identity<typeof AnyUserConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<User.Implementation> {
    /** @remarks The same value as {@linkcode DocumentSheetV2.RenderContext.document | context.document}. */
    user: User.Implementation;

    /**
     * @remarks Renders the `character` field as a choice between the Actors this User can observe, grouped by
     * whether they own them.
     */
    characterWidget: DataField.CustomFormGroup;

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<User.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyUserConfig extends UserConfig<
  UserConfig.RenderContext,
  UserConfig.Configuration,
  UserConfig.RenderOptions
> {
  constructor(...args: never);
}

export default UserConfig;

import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { CustomFormGroup } from "../forms/fields.d.mts";

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
  RenderContext extends object = UserConfig.RenderContext,
  Configuration extends UserConfig.Configuration = UserConfig.Configuration,
  RenderOptions extends UserConfig.RenderOptions = UserConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  User.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  get title(): string;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  /**
   * @privateRemarks Prevents duck typing
   */
  #private: true;
}

declare namespace UserConfig {
  interface Any extends AnyUserConfig {}
  interface AnyConstructor extends Identity<typeof AnyUserConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<User.Implementation> {
    user: User.Implementation;
    source: foundry.documents.BaseUser.Source;
    fields: foundry.documents.BaseUser.Schema;
    characterWidget: CustomFormGroup;
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<User.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyUserConfig extends UserConfig<object, UserConfig.Configuration, UserConfig.RenderOptions> {
  constructor(...args: never);
}

export default UserConfig;

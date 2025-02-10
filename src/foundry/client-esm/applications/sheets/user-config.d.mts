import type { InterfaceToObject, AnyObject, DeepPartial } from "fvtt-types/utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { CustomFormGroup } from "../forms/fields.d.mts";

/**
 * The User configuration application.
 */
declare class UserConfig<
  RenderContext extends AnyObject = InterfaceToObject<UserConfig.RenderContext>,
  Configuration extends
    DocumentSheetV2.Configuration<User.ConfiguredInstance> = DocumentSheetV2.Configuration<User.ConfiguredInstance>,
  RenderOptions extends
    HandlebarsApplicationMixin.DocumentSheetV2RenderOptions = HandlebarsApplicationMixin.DocumentSheetV2RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  User.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.Configuration<User.ConfiguredInstance>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  get title(): string;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  /**
   * @privateRemarks Prevents duck typing
   */
  #private: true;
}

declare namespace UserConfig {
  interface RenderContext {
    user: User.ConfiguredInstance;
    source: foundry.documents.BaseUser.Source;
    fields: foundry.documents.BaseUser.Schema;
    characterWidget: CustomFormGroup;
  }
}

export default UserConfig;

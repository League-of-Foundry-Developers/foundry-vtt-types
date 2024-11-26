import type { InterfaceToObject } from "../../../../types/helperTypes.d.mts";
import type { AnyObject, DeepPartial } from "../../../../types/utils.d.mts";
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
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
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
}

declare namespace UserConfig {
  interface RenderContext {
    user: User.ConfiguredInstance;
    source: foundry.documents.BaseUser.Source;
    fields: User["schema"]["fields"];
    characterWidget: CustomFormGroup;
  }
}

export default UserConfig;

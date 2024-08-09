import type { AnyObject, EmptyObject } from "../../../../types/utils.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The User configuration application.
 */
export default class UserConfig<
  Configuration extends
    DocumentSheetV2.Configuration<User.ConfiguredInstance> = DocumentSheetV2.Configuration<User.ConfiguredInstance>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
  RenderContext extends AnyObject = EmptyObject,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  User.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

import type { AnyObject, EmptyObject } from "../../../../types/utils.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The AmbientSound configuration application.
 */
export default class AmbientSoundConfig<
  Configuration extends
    DocumentSheetV2.Configuration<AmbientSoundDocument.ConfiguredInstance> = DocumentSheetV2.Configuration<AmbientSoundDocument.ConfiguredInstance>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
  RenderContext extends AnyObject = EmptyObject,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  AmbientSoundDocument.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

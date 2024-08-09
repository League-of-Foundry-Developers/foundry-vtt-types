import type { AnyObject, EmptyObject } from "../../../../types/utils.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The AmbientLight configuration application.
 */
export default class AmbientLightConfig<
  Configuration extends
    DocumentSheetV2.Configuration<AmbientLightDocument.ConfiguredInstance> = DocumentSheetV2.Configuration<AmbientLightDocument.ConfiguredInstance>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
  RenderContext extends AnyObject = EmptyObject,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  AmbientLightDocument.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

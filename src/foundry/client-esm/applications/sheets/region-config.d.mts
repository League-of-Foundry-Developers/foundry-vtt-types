import type { AnyObject, DeepPartial, EmptyObject } from "../../../../utils/index.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Scene Region configuration application.
 */
export default class RegionConfig<
  RenderContext extends AnyObject = EmptyObject,
  Configuration extends
    DocumentSheetV2.Configuration<RegionDocument.ConfiguredInstance> = DocumentSheetV2.Configuration<RegionDocument.ConfiguredInstance>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RegionDocument.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @privateRemarks Eon: While DEFAULT_OPTIONS and PARTS are overriden in core,
   * due to the static nature of these properties and the fact that the typing doesn't change
   * I've elected not to include them in the typing here.
   */

  override tabGroups: {
    /** @defaultValue `"identity"` */
    sheet: string;
  };

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: HandlebarsApplicationMixin.HandlebarsApplication.RenderContextFor<this>,
    options: DeepPartial<HandlebarsApplicationMixin.HandlebarsRenderOptions>,
  ): Promise<HandlebarsApplicationMixin.HandlebarsApplication.RenderContextFor<this>>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  #regionConfig: true;
}

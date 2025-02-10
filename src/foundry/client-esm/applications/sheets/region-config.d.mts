import type { AnyObject, DeepPartial, EmptyObject } from "fvtt-types/utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Scene Region configuration application.
 */
export default class RegionConfig<
  RenderContext extends AnyObject = EmptyObject,
  Configuration extends
    DocumentSheetV2.Configuration<RegionDocument.ConfiguredInstance> = DocumentSheetV2.Configuration<RegionDocument.ConfiguredInstance>,
  RenderOptions extends
    HandlebarsApplicationMixin.DocumentSheetV2RenderOptions = HandlebarsApplicationMixin.DocumentSheetV2RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RegionDocument.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.Configuration<RegionDocument.ConfiguredInstance>;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

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
    options: DeepPartial<RenderOptions>,
  ): Promise<HandlebarsApplicationMixin.HandlebarsApplication.RenderContextFor<this>>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  #regionConfig: true;
}

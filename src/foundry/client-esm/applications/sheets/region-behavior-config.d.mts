import type { AnyObject, DeepPartial, EmptyObject } from "../../../../utils/index.d.mts";
import type { FormFooterButton, FormNode } from "../_types.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The Scene Region configuration application.
 */
export default class RegionBehaviorConfig<
  RenderContext extends AnyObject = EmptyObject,
  Configuration extends
    DocumentSheetV2.Configuration<RegionBehavior.ConfiguredInstance> = DocumentSheetV2.Configuration<RegionBehavior.ConfiguredInstance>,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RegionBehavior.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @privateRemarks Eon: While constructor, DEFAULT_OPTIONS and PARTS are overriden in core,
   * due to the (static) nature of these properties and the fact that the typing doesn't change
   * I've elected not to include them in the typing here.
   */

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /** Prepare form field structure for rendering. */
  protected _getFields(): FormNode[];

  /** Get footer buttons for this behavior config sheet. */
  _getButtons(): Partial<FormFooterButton>[];

  #regionBehaviorConfig: true;
}

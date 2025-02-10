import type { AnyObject, DeepPartial, EmptyObject } from "fvtt-types/utils";
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
  RenderOptions extends
    HandlebarsApplicationMixin.DocumentSheetV2RenderOptions = HandlebarsApplicationMixin.DocumentSheetV2RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RegionBehavior.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {
  constructor(options: DeepPartial<Configuration> & { document: Document });

  static override DEFAULT_OPTIONS: DocumentSheetV2.Configuration<RegionBehavior.ConfiguredInstance>;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /** Prepare form field structure for rendering. */
  protected _getFields(): FormNode[];

  /** Get footer buttons for this behavior config sheet. */
  _getButtons(): FormFooterButton[];

  #regionBehaviorConfig: true;
}

import type { AnyObject, DeepPartial, EmptyObject } from "../../../../utils/index.d.mts";
import type { ApplicationTab, FormFooterButton } from "../_types.d.mts";
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

  /** Prepare an array of form header tabs*/
  #getTabs(): Record<string, Partial<ApplicationTab>>;

  /** Prepare an array of form footer buttons */
  #getFooterButtons(): Partial<FormFooterButton>[];

  /** Handle mouse-hover events on a shape */
  #onShapeHoverIn(event: MouseEvent): void;

  /** Handle mouse-unhover events for shape. */
  #onShapeHoverOut(event: MouseEvent): void;

  /** Handle button clicks to move the shape up. */
  static #onShapeMoveUp(this: RegionConfig, event: PointerEvent): Promise<void>;

  /** Handle button clicks to move the shape down. */
  static #onShapeMoveDown(this: RegionConfig, event: PointerEvent): Promise<void>;

  /** Handle button clicks to create shapes from the controlled walls. */
  static #onShapeCreateFromWalls(this: RegionConfig, event: PointerEvent): Promise<void>;

  /** Handle button clicks to toggle the hold field of a shape. */
  static #onShapeToggleHole(this: RegionConfig, event: PointerEvent): Promise<void>;

  /** Handle button clicks to remove a shape */
  static #onShapeRemove(this: RegionConfig, event: PointerEvent): Promise<boolean | string | null>;

  /**
   * Get the shape index from a control button click.
   * @param event     - The button-click event
   * @returns         - The shape index
   */
  #getControlShapeIndex(event: PointerEvent): number;

  /** Handle button clicks to create a new behavior. */
  static #onBehaviorCreate(this: RegionConfig, _event: PointerEvent): Promise<void>;

  /** Handle button clicks to delete a behavior. */
  static #onBehaviorDelete(this: RegionConfig, event: PointerEvent): Promise<void>;

  /** Handle button clicks to edit a behavior. */
  static #onBehaviorEdit(this: RegionConfig, event: PointerEvent): Promise<void>;

  /** Handle button clicks to toggle a behavior. */
  static #onBehaviorToggle(this: RegionConfig, event: PointerEvent): Promise<void>;

  /**
   * Get the RegionBehavior document from a control button click.
   * @param event     - The button-click event
   * @returns         - The RegionBehavior document
   */
  #getControlBehavior(event: PointerEvent): Promise<RegionBehavior.ConfiguredInstance>;
}

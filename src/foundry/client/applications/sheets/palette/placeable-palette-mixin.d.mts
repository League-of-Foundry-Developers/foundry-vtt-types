import type { AnyObject, DeepPartial, FixedInstanceType, InexactPartial, Mixin } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";

import Document = foundry.abstract.Document;

/**
 * The mixed application class augmented with placeable palette functionality.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class PlaceablePalette {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__RenderContext]: {};

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__Configuration]: {};

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  readonly [ApplicationV2.Internal.__RenderOptions]: {};

  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["placeable-palette", "faded-ui"],
   *   initialData: {},
   *   position: {
   *     scale: .8,
   *     width: 375
   *   },
   *   form: {
   *     closeOnSubmit: false,
   *     submitOnChange: true
   *   },
   *   actions: {
   *     closeDetails: PlaceablePalette.#onCloseDetails,
   *     closePalette: PlaceablePalette.#onClosePalette,
   *     commit: PlaceablePalette.#onCommit,
   *     reset: PlaceablePalette.#onReset
   *   },
   *   preview: false
   * }
   * ```
   */
  static DEFAULT_OPTIONS: PlaceablePaletteMixin.DefaultOptions;

  /**
   * The named Document type that this palette represents.
   * @remarks Must be set by every concrete subclass; there is no base value.
   */
  static documentName: string;

  /**
   * The setting key where default data is saved.
   * @remarks Must be set by every concrete subclass; there is no base value.
   */
  static SETTING_KEY: string;

  /**
   * If defined, switch to this tool after committing settings so the user can immediately draw with them.
   */
  static COMMIT_TOOL: string | undefined;

  /**
   * The all controlled documents for this palette's placeables layer.
   */
  get controlled(): Document.Any[];

  /**
   * The initial creation data for a new document.
   */
  get createData(): AnyObject;

  /**
   * The initial creation data for a new document, reading from the live palette instance if one is open, otherwise
   * falling back to the stored settings, with level and elevation synced to the currently viewed level.
   */
  static get createData(): AnyObject;

  /**
   * Get the default level and elevation data for a given level, used when syncing to the currently viewed level.
   */
  protected static _getDefaultLevelData(): AnyObject;

  /**
   * The fields the user has modified from their default values.
   * @remarks Foundry marks this `@internal`; not otherwise referenced outside this class.
   */
  _dirtyFields: Set<string>;

  /**
   * The fields that have differing values across the set of controlled documents.
   * @remarks Foundry marks this `@internal`; not otherwise referenced outside this class.
   */
  _multiFields: Set<string>;

  /**
   * The class of the document that backs this form.
   */
  get documentClass(): Document.AnyConstructor;

  /**
   * The placeable document.
   */
  get documentName(): string;

  /**
   * Whether the palette is editing multiple placeables.
   */
  get isSelect(): boolean;

  /**
   * The canvas layer for this palette's placeable.
   */
  get layer(): foundry.canvas.layers.PlaceablesLayer.Any | null;

  /**
   * The schema of the user's stored palette values.
   */
  static get schema(): fields.SchemaField.Any;

  get title(): string;

  get isEditable(): boolean;

  /**
   * Configure an appropriate preset to apply.
   * @param formData - The palette data.
   * @param options  - Render options.
   *                   (default: `{}`)
   */
  protected _applyPreset(formData: AnyObject, options?: DeepPartial<PlaceablePaletteMixin.RenderOptions>): AnyObject;

  protected _configureRenderOptions(options: DeepPartial<PlaceablePaletteMixin.RenderOptions>): void;

  protected _prepareContext(
    options: DeepPartial<PlaceablePaletteMixin.RenderOptions> & { isFirstRender: boolean },
  ): Promise<PlaceablePaletteMixin.RenderContext>;

  render(options?: DeepPartial<PlaceablePaletteMixin.RenderOptions>): Promise<void>;
  render(options: boolean, _options?: DeepPartial<PlaceablePaletteMixin.RenderOptions>): Promise<void>;

  protected _onClose(options: DeepPartial<PlaceablePaletteMixin.RenderOptions>): void;

  protected _onFirstRender(
    context: DeepPartial<PlaceablePaletteMixin.RenderContext>,
    options: DeepPartial<PlaceablePaletteMixin.RenderOptions>,
  ): Promise<void>;

  protected _onRender(
    context: DeepPartial<PlaceablePaletteMixin.RenderContext>,
    options: DeepPartial<PlaceablePaletteMixin.RenderOptions>,
  ): Promise<void>;

  protected _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): AnyObject;

  protected _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: AnyObject,
    options?: unknown,
  ): Promise<foundry.applications.api.DocumentSheetV2.SubmitResult>;

  protected _renderFrame(options: DeepPartial<PlaceablePaletteMixin.RenderOptions>): Promise<HTMLElement>;

  protected _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Determine which fields have values that are not the same across all selected documents.
   * @param docs - The documents to compare.
   */
  protected _determineMultiFields(docs: Document.Any[]): Set<string>;

  /**
   * Determine whether the given preset creation data matches the currently stored palette settings.
   * @param createData - The preset creation data to compare against.
   */
  static isActivePreset(createData: AnyObject): boolean;

  /**
   * Set a multi-value placeholder on the given element.
   * @param element - The element.
   */
  protected _setPlaceholder(element: HTMLElement): void;
}

/**
 * Augment a placeable config so that it can be used to bulk edit and set default creation data.
 */
declare function PlaceablePaletteMixin<BaseClass extends PlaceablePaletteMixin.BaseClass>(
  BaseConfig: BaseClass,
): PlaceablePaletteMixin.Mix<BaseClass>;

declare namespace PlaceablePaletteMixin {
  interface AnyMixedConstructor extends ReturnType<typeof PlaceablePaletteMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = ApplicationV2.Internal.Constructor;
  type Mix<BaseClass extends PlaceablePaletteMixin.BaseClass> = Mixin<typeof PlaceablePalette, BaseClass>;

  /** @internal */
  interface _Configuration {
    /**
     * The document previewed by this palette.
     * @remarks Defaults to a new, unsaved document of {@linkcode PlaceablePalette.documentClass | documentClass},
     * constructed in the constructor if not provided.
     */
    document: Document.Any;
  }

  interface Configuration extends ApplicationV2.Configuration, InexactPartial<_Configuration> {
    /**
     * Initial data to populate the dialog with, overriding the user's previous choices, if any.
     * @defaultValue `{}`
     */
    initialData: AnyObject;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface RenderContext extends ApplicationV2.RenderContext {
    /** @remarks Unconditionally set by {@linkcode PlaceablePalette._prepareContext | #_prepareContext} */
    rootId: string;

    /** @remarks Unconditionally set by {@linkcode PlaceablePalette._prepareContext | #_prepareContext} */
    isSelect: boolean;

    /** @remarks Unconditionally set by {@linkcode PlaceablePalette._prepareContext | #_prepareContext} */
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface RenderOptions extends ApplicationV2.RenderOptions {
    /**
     * Reset the palette's stored data to the given preset.
     * @remarks Consumed by {@linkcode PlaceablePalette._applyPreset | #_applyPreset} and
     * {@linkcode PlaceablePalette.render | #render}.
     */
    preset?: AnyObject | undefined;

    /**
     * Do not reset level or elevation when applying a preset.
     * @remarks Consumed by {@linkcode PlaceablePalette.render | #render}.
     */
    preservePlacement?: boolean | undefined;
  }
}

export default PlaceablePaletteMixin;

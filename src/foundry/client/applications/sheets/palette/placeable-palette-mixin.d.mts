import type { AnyMutableObject, AnyObject, DeepPartial, FixedInstanceType, Mixin } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type PlaceableConfig from "../placeable-config.d.mts";
import type PlaceablesLayer from "#client/canvas/layers/base/placeables-layer.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

import Document = foundry.abstract.Document;

/**
 * The mixed application class augmented with placeable palette functionality.
 *
 * @remarks This does NOT exist at runtime. This is only here to be used as a type when relevant as well as to avoid
 * issues with anonymous mixin classes.
 *
 * A concrete palette must also declare `static SETTING_KEY` and `static documentName`. The mixin reads both through
 * `this.constructor`.
 *
 * @privateRemarks `_prepareContext`, `_configureRenderOptions`, `_onChangeForm`, `_onClose`, `_onFirstRender`,
 * `_onRender`, and `_renderFrame` are inherited from `BaseConfig` rather than redeclared here. Their
 * self-referential application signatures cause TypeScript to exceed its stack depth when checking a concrete class
 * composed through this mixin.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class PlaceablePalette {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  // Mixin override.
  static DEFAULT_OPTIONS: PlaceablePaletteMixin.DefaultOptions;

  /**
   * The all controlled documents for this palette's placeables layer.
   *
   * @remarks Concrete palettes narrow this to their own document implementation.
   */
  get controlled(): Document.Any[];

  /**
   * The initial creation data for a new document.
   */
  get createData(): AnyMutableObject;

  /**
   * The initial creation data for a new document, reading from the live palette instance if one is open, otherwise
   * falling back to the stored settings, with level and elevation synced to the currently viewed level.
   */
  static get createData(): AnyMutableObject;

  /**
   * Get the default level and elevation data for a given level, used when syncing to the currently viewed level.
   */
  protected static _getDefaultLevelData(): AnyMutableObject;

  /**
   * If defined, switch to this tool after committing settings so the user can immediately draw with them.
   *
   * @remarks Declared but left `undefined` on the mixin; only {@linkcode foundry.applications.sheets.palette.WallPalette}
   * assigns it.
   *
   * @defaultValue `undefined`
   */
  static COMMIT_TOOL: string | undefined;

  /**
   * The fields the user has modified from their default values.
   * @internal
   */
  _dirtyFields: Set<string>;

  /**
   * The fields that have differing values across the set of controlled documents.
   * @internal
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
   *
   * @remarks `null` when the canvas has no layer registered for {@linkcode PlaceablePalette.documentName | #documentName}.
   */
  get layer(): PlaceablesLayer.Any | null;

  /**
   * The schema of the user's stored palette values.
   *
   * @remarks Built fresh on each call from the document's schema, minus `_id` and underscore-prefixed internal fields.
   * Concrete palettes prune further.
   */
  static get schema(): SchemaField.Any;

  // Mixin override.
  get title(): string;

  // Mixin override.
  get isEditable(): boolean;

  /**
   * Configure an appropriate preset to apply.
   *
   * @privateRemarks The base implementation returns the preset, but the RegionPalette override returns nothing.
   * @param formData - The palette data.
   * @param options  - Render options.
   */
  protected _applyPreset(formData: AnyObject, options?: PlaceablePaletteMixin.RenderOptions): AnyMutableObject | void;

  /**
   * Determine which fields have values that are not the same across all selected documents.
   */
  protected _determineMultiFields(docs: Document.Any[]): Set<string>;

  /**
   * Determine whether the given preset creation data matches the currently stored palette settings.
   * @param createData - The preset creation data to compare against.
   */
  static isActivePreset(createData: AnyObject): boolean;

  /**
   * Set a multi-value placeholder on the given element.
   */
  protected _setPlaceholder(element: HTMLElement): void;

  static #PlaceablePaletteStatic: true;
  #PlaceablePalette: true;
}

/**
 * Augment a placeable config so that it can be used to bulk edit and set default creation data.
 */
declare function PlaceablePaletteMixin<BaseClass extends PlaceablePaletteMixin.BaseClass>(
  BaseConfig: BaseClass,
): PlaceablePaletteMixin.Mix<BaseClass>;

declare namespace PlaceablePaletteMixin {
  type AnyMixedConstructor = ReturnType<typeof PlaceablePaletteMixin<BaseClass>>;
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  /**
   * @remarks Foundry's JSDoc says `Constructor<ApplicationV2>`, but the mixin body assigns `this._preview`, reads the
   * `preview` configuration option, and calls `super._processFormData` / `super._processSubmitData` — all of which come
   * from {@linkcode foundry.applications.sheets.PlaceableConfig}. Every call site in V14 passes a `PlaceableConfig`
   * subclass, so the constraint follows the runtime rather than the JSDoc.
   */
  type BaseClass = PlaceableConfig.AnyConstructor;

  type Mix<BaseClass extends PlaceablePaletteMixin.BaseClass> = Mixin<typeof PlaceablePalette, BaseClass>;

  interface RenderContext {
    rootId: string;

    isSelect: boolean;

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface _Configuration {
    /**
     * Initial data to populate the dialog with, overriding the user's previous choices, if any.
     */
    initialData: AnyObject;
  }

  interface Configuration extends ApplicationV2.Configuration, _Configuration {}

  type DefaultOptions = DeepPartial<_Configuration> & PlaceableConfig.DefaultOptions;

  interface _RenderOptions {
    /**
     * Reset the palette's stored data to the given preset.
     */
    preset?: AnyObject | undefined;

    /**
     * Do not reset level or elevation when applying a preset.
     */
    preservePlacement?: boolean | undefined;
  }

  interface RenderOptions extends ApplicationV2.RenderOptions, _RenderOptions {}
}

export default PlaceablePaletteMixin;

import type { AnyObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      BasePlaceableHUD: BasePlaceableHUD.Any;
    }
  }
}

/**
 * An abstract base class for displaying a heads-up-display interface bound to a Placeable Object on the Canvas.
 */
declare class BasePlaceableHUD<
  ActiveHUDObject extends PlaceableObject.Any = PlaceableObject,
  RenderContext extends object = BasePlaceableHUD.RenderContext,
  Configuration extends BasePlaceableHUD.Configuration = BasePlaceableHUD.Configuration,
  RenderOptions extends BasePlaceableHUD.RenderOptions = BasePlaceableHUD.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  // Fake override.

  /**
   * @defaultValue
   * ```js
   * {
   *   id: "placeable-hud-{id}",
   *   classes: ["placeable-hud"],
   *   tag: "form",
   *   window: {
   *     frame: false,
   *     positioned: true
   *   },
   *   form: {
   *     handler: BasePlaceableHUD.#onSubmit,
   *     submitOnChange: true,
   *     closeOnSubmit: false
   *   },
   *   actions: {
   *     config: BasePlaceableHUD.#onConfigure,
   *     visibility: BasePlaceableHUD.#onToggleVisibility,
   *     locked: BasePlaceableHUD.#onToggleLocked,
   *     sort: BasePlaceableHUD.#onSort,
   *     togglePalette: BasePlaceableHUD.#onTogglePalette
   *   },
   *   position: {}
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: BasePlaceableHUD.DefaultOptions;

  /** @defaultValue `BasePlaceableHUD` */
  static override BASE_APPLICATION: typeof ApplicationV2;

  /**
   * Reference a PlaceableObject this HUD is currently bound to.
   * @remarks `undefined` before the first {@linkcode BasePlaceableHUD.bind | #bind} call and after
   * the HUD has been closed.
   */
  get object(): ActiveHUDObject;

  /**
   * Convenience access to the Document which this HUD modifies.
   * @remarks `undefined` before the first {@linkcode BasePlaceableHUD.bind | #bind} call and after
   * the HUD has been closed.
   */
  get document(): ActiveHUDObject["document"];

  /**
   * Convenience access for the canvas layer which this HUD modifies
   * @remarks `undefined` before the first {@linkcode BasePlaceableHUD.bind | #bind} call and after
   * the HUD has been closed.
   */
  get layer(): ActiveHUDObject["layer"];

  /**
   * The palette that is currently expanded, if any.
   */
  get activePalette(): string | null;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _updatePosition(position: ApplicationV2.Position): ApplicationV2.Position;

  protected override _postRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _preClose(options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Insert the application HTML element into the DOM.
   * Subclasses may override this method to customize how the application is inserted.
   * @param element - The element to insert
   */
  protected override _insertElement(element: HTMLElement): Promise<void>;

  /**
   * Bind the HUD to a new PlaceableObject and display it.
   * @param object - A PlaceableObject instance to which the HUD should be bound
   */
  bind(object: ActiveHUDObject): Promise<void>;

  /**
   * @throws If {@linkcode BasePlaceableHUD.RenderOptions.object | options.object} is not a
   * `PlaceableObject` in the currently viewed Scene.
   */
  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * Toggle the expanded state of the given palette.
   * @param palette - The palette to toggle or null to collapse of the currently expanded palette
   * @param active  - Force the palette to be active or inactive
   */
  togglePalette(palette: string | null, active?: boolean): void;

  /**
   * Handle submission of the BasePlaceableHUD form.
   */
  protected _onSubmit(
    event: SubmitEvent | Event,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): Promise<void>;

  /**
   * Special submission process for elevation changes.
   */
  protected _onSubmitElevation(
    event: SubmitEvent | Event,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): Promise<void>;

  /**
   * Parse an attribute bar input string into a new value for the attribute field.
   * @param name  - The name of the attribute
   * @param attr  - The current value of the attribute
   * @param input - The raw string input value
   * @returns The parsed input value
   */
  protected _parseAttributeInput(
    name: string,
    attr: AnyObject | number,
    input: string,
  ): BasePlaceableHUD.ParsedAttributeInput;

  /**
   * @deprecated "`BasePlaceableHUD#clear` is deprecated in favor of
   * {@linkcode BasePlaceableHUD.close | BasePlaceableHUD#close}" (since v13, until v15)
   */
  clear(): void;

  #BasePlaceableHUD: true;
}

declare namespace BasePlaceableHUD {
  interface Any extends AnyBasePlaceableHUD {}
  interface AnyConstructor extends Identity<typeof AnyBasePlaceableHUD> {}

  /**
   * @remarks In addition to the properties below, the entire result of the bound document's
   * `toObject()` is merged into the context, with `elevation` (if numeric) made relative to
   * `canvas.level.elevation.base`.
   */
  interface RenderContext extends ApplicationV2.RenderContext {
    id: string;
    classes: string;

    /**
     * @remarks Foundry assigns `this.appId` here, but `ApplicationV2` instances have no `appId`
     * property (only the `static _appId` counter), so at runtime this is always `undefined`.
     */
    appId: string | undefined;

    isGM: boolean;
    isGamePaused: boolean;
    icons: typeof CONFIG.controlIcons;
    visibilityClass: string;
    lockedClass: string;
  }

  interface Configuration<
    BasePlaceableHUD extends BasePlaceableHUD.Any = BasePlaceableHUD.Any,
  > extends ApplicationV2.Configuration<BasePlaceableHUD> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<BasePlaceableHUD extends BasePlaceableHUD.Any = BasePlaceableHUD.Any> = DeepPartial<
    Configuration<BasePlaceableHUD>
  > &
    object;

  interface RenderOptions extends ApplicationV2.RenderOptions {
    /**
     * A PlaceableObject to bind the HUD to, passed by {@linkcode BasePlaceableHUD.bind | #bind}
     * and consumed by {@linkcode BasePlaceableHUD._canRender | #_canRender} and
     * {@linkcode BasePlaceableHUD._configureRenderOptions | #_configureRenderOptions}.
     */
    object?: PlaceableObject.Any | undefined;
  }

  /** The parsed input value */
  interface ParsedAttributeInput {
    attribute: string;

    value: number;

    delta?: number | undefined;

    isDelta: boolean;

    isBar: boolean;
  }
}

declare abstract class AnyBasePlaceableHUD extends BasePlaceableHUD<
  PlaceableObject.Any,
  object,
  BasePlaceableHUD.Configuration,
  BasePlaceableHUD.RenderOptions
> {
  constructor(...args: never);
}

export default BasePlaceableHUD;

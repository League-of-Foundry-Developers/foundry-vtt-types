import type { FixedInstanceType, HandleEmptyObject, InexactPartial, IntentionalPartial, RequiredProps } from "#utils";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import ShapeObjectMixin from "#client/canvas/placeables/mixins/shapes.mjs";
import type { AmbientLightShapeControls } from "#client/canvas/placeables/lights/_module.d.mts";
import type { PreciseText } from "#client/canvas/containers/_module.d.mts";
import type { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.d.mts";
import type { PointLightSource, PointDarknessSource } from "#client/canvas/sources/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { LightData } from "#client/data/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      AmbientLight: AmbientLight.Implementation;
    }
  }
}

/**
 * An AmbientLight is an implementation of PlaceableObject which represents a dynamic light source within the Scene.
 * @see {@linkcode foundry.documents.AmbientLightDocument}
 * @see {@linkcode foundry.canvas.layers.LightingLayer}
 */
declare class AmbientLight extends ShapeObjectMixin(PlaceableObject<AmbientLightDocument.Implementation>) {
  // fake type override
  static override get implementation(): AmbientLight.ImplementationClass;

  /**
   * The area that is affected by this light.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  field: PIXI.Graphics | undefined;

  /**
   * A reference to the PointSource object which defines this light or darkness area of effect.
   * This is undefined if the AmbientLight does not provide an active source of light.
   * @remarks This is not initialized to a value, but {@linkcode AmbientLight._onCreate | AmbientLight#_onCreate}
   * calls {@linkcode AmbientLight.initializeLightSource | AmbientLight#initializeLightSource}, so it could be set immediately.
   *
   * Set `undefined` in {@linkcode AmbientLight._destroy | AmbientLight#_destroy}.
   */
  lightSource: PointLightSource.Implementation | PointDarknessSource.Implementation | undefined;

  /**
   * The shape controls.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  controls: AmbientLightShapeControls | undefined;

  /**
   * The tooltip.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw.
   */
  tooltip: PreciseText | undefined;

  static override embeddedName: "AmbientLight";

  static override RENDER_FLAGS: AmbientLight.RENDER_FLAGS;

  // fake type override
  renderFlags: RenderFlags<AmbientLight.RENDER_FLAGS>;

  override get sourceId(): string;

  /**
   * A convenience accessor to the LightData configuration object
   */
  get config(): LightData;

  /**
   * Test whether a specific AmbientLight source provides global illumination
   */
  get global(): boolean;

  /**
   * The maximum radius in pixels of the light field
   */
  get radius(): number;

  /**
   * Get the pixel radius of dim light emitted by this light source
   */
  get dimRadius(): number;

  /**
   * Get the pixel radius of bright light emitted by this light source
   */
  get brightRadius(): number;

  /**
   * Check if the point source is a LightSource instance
   * @remarks Checks via `instanceof` against the configured class, not simply PointLightSource
   */
  get isLightSource(): boolean;

  /**
   * Check if the point source is a DarknessSource instance
   * @remarks Checks via `instanceof` against the configured class, not simply PointDarknessSource
   */
  get isDarknessSource(): boolean;

  /**
   * Is the source of this Ambient Light disabled?
   */
  protected _isLightSourceDisabled(): boolean;

  /**
   * Does this Ambient Light actively emit darkness light given its properties and the current darkness level of the Scene?
   */
  get emitsDarkness(): boolean;

  /**
   * Does this Ambient Light actively emit positive light given its properties and the current darkness level of the Scene?
   */
  get emitsLight(): boolean;

  override get isInteractable(): boolean;

  protected override _destroy(options: PIXI.IDestroyOptions | boolean | undefined): void;

  // fake type override
  override draw(options?: HandleEmptyObject<AmbientLight.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<AmbientLight.DrawOptions>): Promise<void>;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  protected override _applyRenderFlags(flags: AmbientLight.RenderFlags): void;

  /**
   * Refresh the position of the AmbientLight.
   */
  protected _refreshPosition(): void;

  /**
   * Refresh the rotation of the AmbientLight.
   */
  protected _refreshRotation(): void;

  /**
   * Refresh the size of the AmbientLight.
   */
  protected _refreshSize(): void;

  /**
   * Refresh the shape of the light field-of-effect. This is refreshed when the AmbientLight fov polygon changes.
   */
  protected _refreshField(): void;

  /**
   * Refresh the tooltip.
   */
  protected _refreshTooltip(): void;

  /**
   * Return the text which should be displayed in the tooltip.
   */
  protected _getTooltipText(): string;

  /**
   * Get the text style that should be used for the tooltip.
   */
  protected _getTextStyle(): PIXI.TextStyle;

  protected override _getMeasuredShapes(): foundry.data.BaseShapeData[];

  protected override _refreshState(): void;

  /**
   * Update the LightSource associated with this AmbientLight object.
   * Darkness sources always generate edges. Light sources only do so if their priority is strictly greater than 0.
   * If any aspect changes (deletion, switching between darkness/light, or priority change), the source may be destroyed
   * and recreated as needed, and relevant perception flags are set.
   * @param options - Options which modify how the source is updated.
   */
  initializeLightSource(options?: AmbientLight.InitializeLightSourceOptions): void;

  /**
   * Get the light source data.
   */
  protected _getLightSourceData(): AmbientLight.LightSourceData;

  protected override _onCreate(
    data: AmbientLightDocument.CreateData,
    options: AmbientLightDocument.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected override _onUpdate(
    changed: AmbientLightDocument.UpdateData,
    options: AmbientLightDocument.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected override _onDelete(options: AmbientLightDocument.Database.OnDeleteOptions, userId: string): void;

  override _hasShapeChanged(changed: AmbientLightDocument.UpdateData): boolean;

  protected override _canHUD(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _canConfigure(user: User.Implementation, event?: Canvas.Event.Pointer): boolean;

  protected override _onControl(options: AmbientLight.ControlOptions): void;

  protected override _onRelease(options: HandleEmptyObject<AmbientLight.ReleaseOptions>): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  protected override _updateDragPreviews(event: Canvas.Event.Pointer): void;

  #AmbientLight: true;
}

declare namespace AmbientLight {
  /**
   * The implementation of the `AmbientLight` placeable configured through `CONFIG.AmbientLight.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode AmbientLightDocument.Implementation}
   * which refers to the implementation for the AmbientLight document.
   */
  type Implementation = FixedInstanceType<ImplementationClass>;

  /**
   * The implementation of the `AmbientLight` placeable configured through `CONFIG.AmbientLight.objectClass`
   * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
   *
   * Not to be confused with {@linkcode AmbientLightDocument.ImplementationClass}
   * which refers to the implementation for the AmbientLight document.
   */
  type ImplementationClass = PlaceableObject.ImplementationClassFor<"AmbientLight">;

  interface RENDER_FLAGS extends PlaceableObject.RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshField", "refreshElevation"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{ propagate: ["refreshPosition"] }` */
    refreshField: RenderFlag<this, "refreshField">;

    /** @defaultValue `{}` */
    refreshPosition: RenderFlag<this, "refreshPosition">;

    /** @defaultValue `{}` */
    refreshState: RenderFlag<this, "refreshState">;

    /** @defaultValue `{}` */
    refreshElevation: RenderFlag<this, "refreshElevation">;
  }

  interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

  interface DrawOptions extends PlaceableObject.DrawOptions {}

  interface RefreshOptions extends PlaceableObject.RefreshOptions {}

  interface ControlOptions extends PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

  /** @internal */
  interface _InitializeLightSourceOptions {
    /**
     * Indicate that this SoundSource has been deleted.
     * @defaultValue `false`
     */
    deleted: boolean;
  }

  interface InitializeLightSourceOptions extends InexactPartial<_InitializeLightSourceOptions> {}

  /**
   * @remarks {@linkcode AmbientLight._getLightSourceData | AmbientLight#_getLightSourceData} calls `mergeObject` on the return of
   * {@linkcode LightData.toObject | LightData#toObject(false)} and the enumerated properties below and returns the result. This gets passed
   * to {@linkcode PointLightSource.initialize | AmbientLight#lightSource#initialize()}, so this is a `RequiredProps<IntentionalPartial<>>`
   * rather than a `Pick<>`
   */
  type LightSourceData = foundry.data.fields.SchemaField.InitializedData<LightData.Schema> &
    RequiredProps<
      IntentionalPartial<PointLightSource.SourceData>,
      "x" | "y" | "elevation" | "rotation" | "walls" | "vision" | "dim" | "bright" | "seed" | "disabled" | "preview"
    >;
}

export default AmbientLight;

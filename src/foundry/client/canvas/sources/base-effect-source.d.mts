import type { IntentionalPartial, AnyObject, Identity, InexactPartial } from "#utils";
import type * as placeables from "#client/canvas/placeables/_module.d.mts";
import type { EnvironmentCanvasGroup } from "#client/canvas/groups/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * TODO - Re-document after ESM refactor.
 * An abstract base class which defines a framework for effect sources which originate radially from a specific point.
 * This abstraction is used by the LightSource, VisionSource, SoundSource, and MovementSource subclasses.
 *
 * @example A standard PointSource lifecycle:
 * ```js
 * const source = new PointSource({object}); // Create the point source
 * source.initialize(data);                  // Configure the point source with new data
 * source.refresh();                         // Refresh the point source
 * source.destroy();                         // Destroy the point source
 * ```
 * @privateRemarks The TODO is foundry's
 */
declare abstract class BaseEffectSource<
  SourceData extends BaseEffectSource.SourceData,
  SourceShape extends PIXI.Polygon,
> {
  /**
   * An effect source is constructed by providing configuration options.
   * @param options - Options which modify the base effect source instance
   */
  constructor(options?: BaseEffectSource.ConstructorOptions);

  /**
   * The type of source represented by this data structure.
   * Each subclass must implement this attribute.
   * @remarks Effectively abstract, must be defined by subclasses; `undefined` in `BaseEffectSource`
   */
  static sourceType: string | undefined;

  /**
   * The target collection into the effects canvas group.
   * @abstract
   * @remarks Is `undefined` in `BaseEffectSource`
   */
  static effectsCollection: string | undefined;

  /**
   * Effect source default data.
   * @defaultValue
   * ```js
   * {
   *   x: 0,
   *   y: 0,
   *   elevation: 0,
   *   disabled: false
   * }
   * ```
   */
  static defaultData: BaseEffectSource.SourceData;

  /**
   * Some other object which is responsible for this source.
   * @privateRemarks see {@linkcode BaseEffectSource.ConstructorOptions.object}
   */
  object: placeables.PlaceableObject.Any | EnvironmentCanvasGroup.Implementation | null;

  /**
   * The source id linked to this effect source.
   * @remarks Foundry types this as Readonly<string>, but does nothing to that effect at runtime
   */
  sourceId: string | undefined;

  /**
   * The data of this source.
   */
  data: SourceData;

  /**
   * The geometric shape of the effect source which is generated later.
   * @remarks This is `undefined` prior to the first call to {@linkcode BaseEffectSource.initialize | BaseEffectSource#Initialize}
   *
   * Only ever `number[]` in {@linkcode foundry.canvas.sources.GlobalLightSource}, and only if
   * {@linkcode foundry.canvas.sources.GlobalLightSource.customPolygon | #customPolygon} is set
   * to a `number[]` before initialization.
   */
  shape: SourceShape | number[] | undefined;

  /**
   * A collection of boolean flags which control rendering and refresh behavior for the source.
   * @defaultValue `{}`
   */
  protected _flags: BaseEffectSource.Flags;

  /**
   * The x-coordinate of the point source origin.
   */
  get x(): number;

  /**
   * The y-coordinate of the point source origin.
   */
  get y(): number;

  /**
   * The elevation bound to this source.
   */
  get elevation(): number;

  /**
   * The EffectsCanvasGroup collection linked to this effect source.
   */
  get effectsCollection(): Collection<this>;

  /**
   * Returns the update ID associated with this source.
   * The update ID is increased whenever the shape of the source changes.
   */
  get updateId(): number;

  /**
   * Is this source currently active?
   * A source is active if it is attached to an effect collection and is not disabled or suppressed.
   */
  get active(): boolean;

  /**
   * Is this source attached to an effect collection?
   */
  get attached(): boolean;

  /**
   * Is this source temporarily suppressed?
   */
  get suppressed(): boolean;

  /**
   * Records of suppression strings with a boolean value.
   * If any of this record is true, the source is suppressed.
   * @defaultValue `{}`
   */
  suppression: Record<string, boolean>;

  /**
   * Initialize and configure the source using provided data.
   * @param data    - Provided data for configuration
   * @param options - Additional options which modify source initialization
   * @returns The initialized source
   * @privateRemarks This should be returning `this`, but allowing the Initialized overrides requires returning a specific class
   */
  initialize(
    data?: InexactPartial<SourceData>,
    options?: BaseEffectSource.InitializeOptions,
  ): BaseEffectSource<SourceData, SourceShape>;

  /**
   * Subclass specific data initialization steps.
   * @param data - Provided data for configuration
   */
  protected abstract _initialize(
    /** @privateRemarks `IntentionalPartial` because `#initialize` has filtered invalid keys and replaced any nullish values before calling this */
    data: IntentionalPartial<SourceData>,
  ): void;

  /** Create the polygon shape (or shapes) for this source using configured data. */
  protected abstract _createShapes(): void;

  /**
   * Subclass specific configuration steps. Occurs after data initialization and shape computation.
   * Only called if the source is attached and not disabled.
   * @param changes - Changes to the source data which were applied
   * @remarks Not actually abstract, but is a no-op in `BaseEffectSource`
   * @privateRemarks This is actually passed *flattened* partial data, and while we were very close to having
   * that be a non-issue, `RenderedEffectSource`'s data's `animation` and `GlobalLightSource`'s `darkness`
   * properties are objects, so this can't just be `IntentionalPartial<SourceData>` until we have a `Flatten<>`
   * type.
   */
  // TODO: Flatten<IntentionalPartial<SourceData>>
  protected _configure(changes: AnyObject): void;

  /**
   * Refresh the state and uniforms of the source.
   * Only active sources are refreshed.
   */
  refresh(): void;

  /**
   * Subclass-specific refresh steps.
   */
  protected _refresh(): void;

  /**
   * Steps that must be performed when the source is destroyed.
   */
  destroy(): void;

  /**
   * Subclass specific destruction steps.
   */
  protected _destroy(): void;

  /**
   * Add this BaseEffectSource instance to the active collection.
   * @remarks
   * @throws If this Source doesn't have a {@linkcode sourceId}
   */
  add(): void;

  /**
   * Remove this BaseEffectSource instance from the active collection.
   */
  remove(): void;

  /**
   * Test whether the point is contained within the shape of the source.
   * @param point - The point.
   * @returns Is inside the source?
   */
  testPoint(point: Canvas.ElevatedPoint): boolean;

  #BaseEffectSource: true;
}

declare namespace BaseEffectSource {
  interface Any extends AnyBaseEffectSource {}
  interface AnyConstructor extends Identity<typeof AnyBaseEffectSource> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * An optional PlaceableObject which is responsible for this source
     * @remarks The {@linkcode EnvironmentCanvasGroup} passes itself when creating the global light source during its construction,
     * as an exception to Foundry's typing of just {@linkcode PlaceableObject}. Otherwise, is only ever {@linkcode placeables.AmbientLight | AmbientLight},
     * {@linkcode placeables.AmbientSound | AmbientSound}, or {@linkcode placeables.Token | Token} in Foundry usage
     */
    object: placeables.PlaceableObject.Any | EnvironmentCanvasGroup.Implementation;

    /**
     * A unique ID for this source. This will be set automatically if an object is provided, otherwise is required.
     * @remarks The above is misleading; sourceId **was** only inferred if you passed a `PlaceableObject`
     * _instead_ of an options object to the constructor (which was a deprecated path removed in v13),
     * _not_ if you pass in `{ object: PlaceableObject }`, where you're expected to also pass `sourceId`
     * yourself, if you want it to be {@linkcode BaseEffectSource.add | added} to its
     * {@linkcode BaseEffectSource.effectsCollection | #effectsCollection}
     */
    sourceId: string;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}

  interface SourceData {
    /**
     * The x-coordinate of the source location
     * @defaultValue `0`
     */
    x: number;

    /**
     * The y-coordinate of the source location
     * @defaultValue `0`
     */
    y: number;

    /**
     * The elevation of the point source
     * @defaultValue `0`
     */
    elevation: number;

    /**
     * Whether or not the source is disabled
     * @defaultValue `false`
     */
    disabled: boolean;
  }

  /** @internal */
  type _InitializeOptions = InexactPartial<{
    /**
     * Should source data be reset to default values before applying changes?
     * @defaultValue `false`
     */
    reset: boolean;
  }>;

  interface InitializeOptions extends _InitializeOptions {}

  /** @privateRemarks The `| number` is from Foundry's typing, but core only uses boolean flags in v12.331 */
  interface Flags extends Record<string, boolean | number | undefined> {
    renderSoftEdges?: boolean;
    initializedMeshes?: boolean;
    hasColor?: boolean;
  }
}

export default BaseEffectSource;

declare abstract class AnyBaseEffectSource extends BaseEffectSource<BaseEffectSource.SourceData, PIXI.Polygon> {
  constructor(...args: never);
}

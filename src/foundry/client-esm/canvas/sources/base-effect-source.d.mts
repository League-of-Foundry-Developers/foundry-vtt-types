import type { NullishProps, IntentionalPartial, AnyObject, Identity } from "fvtt-types/utils";

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
   * @remarks Passing a PlaceableObject is deprecated, and will be removed in v13
   */
  // not null (property access)
  constructor(options?: BaseEffectSource.ConstructorOptions | PlaceableObject);

  /**
   * The type of source represented by this data structure.
   * Each subclass must implement this attribute.
   * @remarks Effectively abstract, must be defined by subclasses; `undefined` in `BaseEffectSource`
   */
  static sourceType: string | undefined;

  /**
   * The target collection into the effects canvas group.
   * @remarks Foundry marked `@abstract`; Is `undefined` in `BaseEffectSource`
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
   * @privateRemarks In Foundry practice this appears to only ever be `null`, `Token.ConfiguredInstance`, or `EffectsCanvasGroup` in v12
   */
  object: PlaceableObject.Any | CanvasGroupMixin.AnyMixed | null;

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
   * @remarks This only isn't `undefined` in subclasses implementing `_createShapes()`, usually via {@link foundry.canvas.sources.PointEffectSourceMixin | `PointEffectSourceMixin`}
   */
  shape: SourceShape | undefined;

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
  get effectsCollection(): foundry.utils.Collection<this>;

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
   */
  // options: not null (destructured)
  initialize(data?: NullishProps<SourceData> | null, options?: BaseEffectSource.InitializeOptions): this;

  /**
   * Subclass specific data initialization steps.
   * @param data - Provided data for configuration
   * @remarks Not actually `abstract`, but a is a no-op in `BaseEffectSource`
   */
  protected _initialize(
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
   */
  add(): void;

  /**
   * Remove this BaseEffectSource instance from the active collection.
   */
  remove(): void;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks `"BaseEffectSource#sourceType is deprecated. Use BaseEffectSource.sourceType instead."`
   */
  get sourceType(): string;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"BaseEffectSource#_createShape is deprecated in favor of BaseEffectSource#_createShapes."`
   */
  protected _createShape(): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"BaseEffectSource#disabled is deprecated in favor of BaseEffectSource#data#disabled or BaseEffectSource#active depending on your use case."`
   */
  get disabled(): boolean;
}

declare namespace BaseEffectSource {
  interface Any extends AnyBaseEffectSource {}
  interface AnyConstructor extends Identity<typeof AnyBaseEffectSource> {}

  /** @internal */
  type _ConstructorOptions = NullishProps<{
    /**
     * An optional PlaceableObject which is responsible for this source
     * @remarks Only the global light source is passed the ECG
     */
    object: PlaceableObject.Any | EffectsCanvasGroup.Any;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {
    /**
     * A unique ID for this source. This will be set automatically if an
     * object is provided, otherwise is required.
     * @remarks The above is misleading; sourceId will only be inferred if you pass a `PlaceableObject`
     * _instead_ of an options object to the constructor (which is a deprecated path removed in v13),
     * _not_ if you pass in `{ object: PlaceableObject }`, where you're expected to also pass `sourceId`
     * yourself.
     */
    sourceId?: string;
  }

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
  type _InitializeOptions = NullishProps<{
    /**
     * Should source data be reset to default values before applying changes?
     * @defaultValue `false`
     */
    reset: boolean;
  }>;

  /** @privateRemarks Foundry describes an `options.behaviors` key, but it is neither checked for nor used at runtime */
  interface InitializeOptions extends _InitializeOptions {}

  /** @privateRemarks The `| number` is from Foundry's typing, but core only uses boolean flags in v12.331 */
  interface Flags extends Record<string, boolean | number> {
    renderSoftEdges?: boolean;
    initializedMeshes?: boolean;
    hasColor?: boolean;
  }
}

declare abstract class AnyBaseEffectSource extends BaseEffectSource<BaseEffectSource.SourceData, PIXI.Polygon> {
  constructor(arg0: never, ...args: never[]);
}

export default BaseEffectSource;

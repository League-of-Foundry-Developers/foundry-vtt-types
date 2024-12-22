import type { InexactPartial } from "../../../../utils/index.d.mts";

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
declare class BaseEffectSource<
  SourceData extends BaseEffectSource.BaseEffectSourceData,
  SourceShape extends PIXI.Polygon,
> {
  /**
   * An effect source is constructed by providing configuration options.
   * @param options - Options which modify the base effect source instance
   */
  constructor(options?: BaseEffectSource.BaseEffectSourceOptions);

  /**
   * The type of source represented by this data structure.
   * Each subclass must implement this attribute.
   */
  static sourceType: string;

  /**
   * The target collection into the effects canvas group.
   */
  static effectsCollection: string;

  /**
   * Effect source default data.
   * @defaultValue
   * ```js
   * {
   * x: 0,
   * y: 0,
   * elevation: 0,
   * disabled: false
   * }
   * ```
   */
  static defaultData: BaseEffectSource.BaseEffectSourceData;

  /**
   * Some other object which is responsible for this source.
   */
  object: PlaceableObject | null;

  /**
   * The source id linked to this effect source.
   */
  readonly sourceId: string;

  /**
   * The data of this source.
   */
  data: SourceData;

  /**
   * The geometric shape of the effect source which is generated later.
   */
  shape: SourceShape;

  /**
   * A collection of boolean flags which control rendering and refresh behavior for the source.
   */
  protected _flags: Record<string, boolean | number>;

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
   */
  suppression: Record<string, boolean>;

  /**
   * Initialize and configure the source using provided data.
   * @param data    - Provided data for configuration
   * @param options - Additional options which modify source initialization
   * @returns The initialized source
   */
  initialize(
    data?: InexactPartial<SourceData>,
    options?: InexactPartial<{
      // The type def references a behaviors object that is not even passed into the function
      /**
       * Should source data be reset to default values before applying changes?
       * @defaultValue `false`
       */
      reset?: boolean;
    }>,
  ): this;

  /**
   * Subclass specific data initialization steps.
   * @param data - Provided data for configuration
   */
  _initialize(data: Partial<SourceData>): void;

  /**
   * Create the polygon shape (or shapes) for this source using configured data.
   */
  protected _createShapes(): void;

  /**
   * Subclass specific configuration steps. Occurs after data initialization and shape computation.
   * Only called if the source is attached and not disabled.
   * @param changes - Changes to the source data which were applied
   */
  protected _configure(changes: Partial<SourceData>): void;

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
  _createShape(): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"BaseEffectSource#disabled is deprecated in favor of BaseEffectSource#data#disabled or BaseEffectSource#active depending on your use case."`
   */
  get disabled(): boolean;
}

declare namespace BaseEffectSource {
  type AnyConstructor = typeof AnyBaseEffectSource;

  interface BaseEffectSourceOptions {
    /**
     * An optional PlaceableObject which is responsible for this source
     */
    object?: PlaceableObject | undefined;
    /**
     * A unique ID for this source. This will be set automatically if an
     * object is provided, otherwise is required.
     */
    sourceId?: string | undefined;
  }

  interface BaseEffectSourceData {
    /**
     * The x-coordinate of the source location
     */
    x: number;
    /**
     * The y-coordinate of the source location
     */
    y: number;
    /**
     * The elevation of the point source
     */
    elevation: number;
    /**
     * Whether or not the source is disabled
     */
    disabled: boolean;
  }
}

declare abstract class AnyBaseEffectSource extends BaseEffectSource<any, any> {
  constructor(arg0: never, ...args: never[]);
}

export default BaseEffectSource;

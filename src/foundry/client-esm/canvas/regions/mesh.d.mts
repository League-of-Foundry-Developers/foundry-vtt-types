/** A mesh of a {@link Region} */
declare class RegionMesh extends PIXI.Container {
  #regionMesh: true;

  /**
   * Create a RegionMesh
   * @param region        - The Region to create the RegionMesh from.
   * @param shaderClass   - The shader class to use. @defaultValue `RegionShader`
   */
  constructor(region: Region.ConfiguredInstance, shaderClass?: AbstractBaseShader);

  /** The Region of this RegionMesh */
  get region(): Region.ConfiguredInstance;

  /** The shader bound to this RegionMesh */
  get shader(): AbstractBaseShader;

  /** The blend mode assigned tot his RegionMesh */
  get blendMode(): PIXI.BLEND_MODES;
  set blendMode(value: PIXI.BLEND_MODES);

  /**
   * The tint applied to the mesh. This is a hex value.
   *
   * A value of 0xFFFFFF will remove any tint effect.
   * @defaultValue 0xFFFFFF
   */
  get tint(): number;
  set tint(value: number);

  /** The tint applied to the mesh. This is a hex value. A value of 0xFFFFFF will remove any tint effect. */
  protected _tintColor: PIXI.Color;

  /**
   * Cached tint value for the shader uniforms
   * @internal
   */
  protected _cachedTint: [red: number, green: number, blue: number, alpha: number];

  /** Used to track a tint or alpha change to execute a recomputation of _cachedTint. */
  protected _tintAlphaDirty: boolean;

  /**
   * Initialize shader based on the shader class type.
   * @param shaderClass   - The shader class, which must inherit from {@link AbstractBaseShader}.
   */
  setShaderClass(shaderClass: typeof AbstractBaseShader): void;

  override updateTransform(): void;

  protected override _render(renderer: PIXI.Renderer): void;

  protected override _calculateBounds(): void;

  /** Tests if a point is indie this RegionMesh */
  containsPoint(point: PIXI.IPointData): boolean;

  override destroy(options?: PIXI.DisplayObject.DestroyOptions): void;
}

export default RegionMesh;

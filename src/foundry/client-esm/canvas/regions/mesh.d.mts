/** A mesh of a {@linkcode Region} */
declare class RegionMesh extends PIXI.Container {
  /**
   * Create a RegionMesh
   * @param region        - The Region to create the RegionMesh from.
   * @param shaderClass   - The shader class to use. (default: `RegionShader`)
   */
  // shaderClass: not null (parameter default only)
  constructor(region: Region.Implementation, shaderClass?: AbstractBaseShader.AnyConstructor);

  /** The Region of this RegionMesh */
  get region(): Region.Implementation;

  /** The shader bound to this RegionMesh */
  get shader(): AbstractBaseShader;

  /** The blend mode assigned tot his RegionMesh */
  get blendMode(): PIXI.BLEND_MODES;
  set blendMode(value);

  /**
   * The tint applied to the mesh. This is a hex value.
   *
   * A value of 0xFFFFFF will remove any tint effect.
   * @defaultValue `0xFFFFFF`
   */
  get tint(): number;
  set tint(value);

  /** The tint applied to the mesh. This is a hex value. A value of 0xFFFFFF will remove any tint effect. */
  protected _tintColor: PIXI.Color;

  /**
   * Cached tint value for the shader uniforms
   * @remarks Foundry marked `@internal`
   */
  protected _cachedTint: Color.RGBAColorVector;

  /** Used to track a tint or alpha change to execute a recomputation of _cachedTint. */
  protected _tintAlphaDirty: boolean;

  /**
   * Initialize shader based on the shader class type.
   * @param shaderClass - The shader class, which must inherit from {@linkcode AbstractBaseShader}.
   */
  setShaderClass(shaderClass: AbstractBaseShader.AnyConstructor): void;

  override updateTransform(): void;

  protected override _render(renderer: PIXI.Renderer): void;

  protected override _calculateBounds(): void;

  /**
   * Tests if a point is inside this RegionMesh.
   * @privateRemarks The rare instance of Foundry using the PIXI interface in *their* types
   */
  containsPoint(point: PIXI.IPointData): boolean;

  override destroy(options?: PIXI.IDestroyOptions | boolean): void;
}

declare namespace RegionMesh {
  interface Any extends AnyRegionMesh {}
  type AnyConstructor = typeof AnyRegionMesh;
}

declare abstract class AnyRegionMesh extends RegionMesh {
  constructor(...args: never);
}

export default RegionMesh;

import type { Identity } from "#utils";
import type { AdaptiveLightingShader } from "#client/canvas/rendering/shaders/_module.d.mts";

/**
 * Extension of a PIXI.Mesh for PointEffectSources.
 * @remarks Foundry only uses this with `AdaptiveLightingShader` subclasses, thus the type param default
 */
declare class PointSourceMesh<Shader extends PIXI.Shader = AdaptiveLightingShader> extends PIXI.Mesh<Shader> {
  /**
   * @remarks This override is not in the actual Foundry code, it's just to sync up the Shader type param with super
   */
  constructor(geometry: PIXI.Geometry, shader: Shader, state?: PIXI.State, drawMode?: PIXI.DRAW_MODES);

  /**
   * @deprecated Removed without replacement in v13 (this warning will be removed in v14)
   */
  protected static _priorBlendMode: never;

  protected static _currentTexture: never;

  /**
   * @deprecated Made hard private in v13 (this warning will be removed in v14)
   */
  _worldID: never;

  /**
   * @deprecated Made hard private in v13 (this warning will be removed in v14)
   */
  _updateID: never;

  override get geometry(): PIXI.Geometry;

  override set geometry(value: PIXI.Geometry);

  /** @throws You can't add children to a {@linkcode PointSourceMesh}. */
  override addChild(): never;

  /** @throws You can't add children to a {@linkcode PointSourceMesh}. */
  override addChildAt(): never;

  /**
   * @deprecated Removed without replacement in v13 (this warning will be removed in v14)
   */
  protected override _render(renderer: never): never;

  override calculateBounds(): void;

  protected override _calculateBounds(): void;

  /** The local bounds need to be drawn from the underlying geometry. */
  override getLocalBounds(
    /** @defaultValue `new PIXI.Rectangle()` */
    rect?: PIXI.Rectangle,
  ): PIXI.Rectangle;

  #PointSourceMesh: true;
}

declare namespace PointSourceMesh {
  interface Any extends AnyPointSourceMesh {}
  interface AnyConstructor extends Identity<typeof AnyPointSourceMesh> {}
}

export default PointSourceMesh;

declare abstract class AnyPointSourceMesh extends PointSourceMesh<PIXI.Shader.Any> {
  constructor(...args: never);
}

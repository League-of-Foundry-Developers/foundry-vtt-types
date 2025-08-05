import type { AnyObject, Identity } from "#utils";
import type { VisualEffectsMaskingFilter } from "#client/canvas/rendering/filters/_module.mjs";
import type { CachedContainer, SpriteMesh } from "#client/canvas/containers/_module.d.mts";
import type { CanvasLayer } from "../_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      CanvasIlluminationEffects: CanvasIlluminationEffects.Any;
    }
  }
}

/**
 * A CanvasLayer for displaying illumination visual effects
 */
declare class CanvasIlluminationEffects extends CanvasLayer {
  /**
   * The filter used to mask visual effects on this layer
   * @remarks Only `undefined` prior to first draw
   */
  filter: VisualEffectsMaskingFilter.Implementation | undefined;

  /**
   * The container holding the lights.
   */
  lights: PIXI.Container;

  /**
   * A minimalist texture that holds the background color.
   */
  backgroundColorTexture: PIXI.Texture;

  /**
   * The base line mesh.
   */
  baselineMesh: SpriteMesh;

  /**
   * The cached container holding the illumination meshes.
   */
  darknessLevelMeshes: DarknessLevelContainer;

  /**
   * To know if dynamic darkness level is active on this scene.
   */
  get hasDynamicDarknessLevel(): boolean;

  /**
   * The illumination render texture.
   */
  get renderTexture(): PIXI.RenderTexture;

  /**
   * Set or retrieve the illumination background color.
   * @remarks Foundry types this as `number` but it gets passed to {@link Color.from}
   */
  set backgroundColor(color: Color.Source);

  /** @remarks This getter doesn't actually exist, it's only here to correct the type inferred from the setter */
  get backgroundColor(): undefined;

  /**
   * Clear illumination effects container
   */
  clear(): void;

  /**
   * Invalidate the cached container state to trigger a render pass.
   * @param force - Force cached container invalidation?
   *                (default: `false`)
   */
  invalidateDarknessLevelContainer(force?: boolean | null): void;

  /**
   * Create the background color texture used by illumination point source meshes.
   * 1x1 single pixel texture.
   * @returns The background color texture.
   * @defaultValue
   * ```js
   * PIXI.Texture.fromBuffer(new Float32Array(3), 1, 1, {
   *      type: PIXI.TYPES.FLOAT,
   *      format: PIXI.FORMATS.RGB,
   *      wrapMode: PIXI.WRAP_MODES.CLAMP,
   *      scaleMode: PIXI.SCALE_MODES.NEAREST,
   *      mipmap: PIXI.MIPMAP_MODES.OFF
   * })
   * ```
   */
  protected _createBackgroundColorTexture(): PIXI.Texture;

  override render(renderer: PIXI.Renderer): void;

  protected override _draw(options: AnyObject): Promise<void>;

  protected override _tearDown(options: AnyObject): Promise<void>;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks "CanvasIlluminationEffects#updateGlobalLight has been deprecated."
   */
  updateGlobalLight(): false;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "CanvasIlluminationEffects#background is now obsolete."
   */
  background(): null;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "CanvasIlluminationEffects#globalLight has been deprecated without replacement. Check the canvas.environment.globalLightSource.active instead."
   */
  get globalLight(): boolean;
}

declare namespace CanvasIlluminationEffects {
  interface Any extends AnyCanvasIlluminationEffects {}
  interface AnyConstructor extends Identity<typeof AnyCanvasIlluminationEffects> {}
}

/**
 * Cached container used for dynamic darkness level. Display objects (of any type) added to this cached container will
 * contribute to computing the darkness level of the masked area. Only the red channel is utilized, which corresponds
 * to the desired darkness level. Other channels are ignored.
 */
declare class DarknessLevelContainer extends CachedContainer {
  /**
   * @defaultValue
   * ```js
   * {
   *  scaleMode: PIXI.SCALE_MODES.NEAREST,
   *  format: PIXI.FORMATS.RED,
   *  multisample: PIXI.MSAA_QUALITY.NONE,
   *  mipmap: PIXI.MIPMAP_MODES.OFF
   * }
   * ```
   */
  static override textureConfiguration: CachedContainer.TextureConfiguration;

  /** @privateRemarks Including to protect duck typing due to overall similarities b/w DarknessLevelContainer and CachedContainer */
  #onChildChange(): void;
}

declare namespace DarknessLevelContainer {
  interface Any extends AnyDarknessLevelContainer {}
  interface AnyConstructor extends Identity<typeof AnyDarknessLevelContainer> {}
}

export { CanvasIlluminationEffects as default, DarknessLevelContainer };

declare abstract class AnyCanvasIlluminationEffects extends CanvasIlluminationEffects {
  constructor(...args: never);
}

declare abstract class AnyDarknessLevelContainer extends DarknessLevelContainer {
  constructor(...args: never);
}

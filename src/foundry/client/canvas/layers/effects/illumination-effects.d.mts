import type { HandleEmptyObject, Identity } from "#utils";
import type { VisualEffectsMaskingFilter } from "#client/canvas/rendering/filters/_module.mjs";
import type { CachedContainer, SpriteMesh } from "#client/canvas/containers/_module.d.mts";
import type { CanvasLayer } from "../_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      /** @remarks Not configurable, doesn't have an `Implementation` */
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
   * Clear illumination effects container
   */
  clear(): void;

  /**
   * Invalidate the cached container state to trigger a render pass.
   * @param force - Force cached container invalidation?
   *                (default: `false`)
   */
  invalidateDarknessLevelContainer(force?: boolean | null): void;

  // fake type override
  override draw(options?: HandleEmptyObject<CanvasIlluminationEffects.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<CanvasIlluminationEffects.DrawOptions>): Promise<void>;

  // fake type override
  override tearDown(options?: CanvasIlluminationEffects.TearDownOptions): Promise<this>;

  protected override _tearDown(options: CanvasIlluminationEffects.TearDownOptions): Promise<void>;

  #CanvasIlluminationEffects: true;
}

declare namespace CanvasIlluminationEffects {
  interface Any extends AnyCanvasIlluminationEffects {}
  interface AnyConstructor extends Identity<typeof AnyCanvasIlluminationEffects> {}

  interface DrawOptions extends CanvasLayer.DrawOptions {}

  interface TearDownOptions extends CanvasLayer.TearDownOptions {}
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

  #DarknessLevelContainer: true;
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

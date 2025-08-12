import type { AnyObject, Identity } from "#utils";
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

  /** @deprecated Removed without replacement in v13. This warning will be removed in v14 */
  backgroundColorTexture: never;

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

  /** @deprecated Removed without replacement in v13. This warning will be removed in v14 */
  set backgroundColor(color: never);

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

  /** @deprecated Removed without replacement in v13. This warning will be removed in v14 */
  protected _createBackgroundColorTexture(): never;

  /** @deprecated Removed without replacement in v13. This warning will be removed in v14 */
  override render(renderer: never): never;

  protected override _draw(options: AnyObject): Promise<void>;

  protected override _tearDown(options: AnyObject): Promise<void>;

  /**
   * @deprecated "`CanvasIlluminationEffects#background` is now obsolete." (since v12, until v14)
   */
  background(): null;

  /**
   * @deprecated "`CanvasIlluminationEffects#globalLight` has been deprecated without replacement. Check the {@linkcode foundry.canvas.sources.GlobalLightSource.active | canvas.environment.globalLightSource.active} instead." (since v12, until v14)
   */
  get globalLight(): boolean;

  #CanvasIlluminationEffects: true;
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

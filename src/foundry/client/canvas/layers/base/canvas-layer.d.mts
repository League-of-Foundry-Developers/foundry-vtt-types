import type { HandleEmptyObject, Identity } from "#utils";
import type { EffectsCanvasGroup } from "#client/canvas/groups/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type { AllHooks as AH } from "#client/hooks.mjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type { WeatherEffects } from "#client/canvas/layers/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- only used for links
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * An abstract pattern for primary layers of the game canvas to implement
 */
declare abstract class CanvasLayer extends PIXI.Container {
  /**
   * Options for this layer instance.
   * @defaultValue `this.constructor.layerOptions`
   * @remarks No core layers override the assignment of this default, so any that provide `static get layerOptions()` require
   * a fake type override for this property to sync static and instance.
   */
  options: CanvasLayer.LayerOptions;

  /** @defaultValue `false` */
  override interactiveChildren: boolean;

  /**
   * Customize behaviors of this CanvasLayer by modifying some behaviors at a class level.
   */
  static get layerOptions(): CanvasLayer.LayerOptions;

  /**
   * Return a reference to the active instance of this canvas layer
   * @remarks Since this returns `canvas[this.layerOptions.name]`, it will be `undefined` prior to {@linkcode AH.canvasInit | canvasInit}
   * for most layers. The layers from {@linkcode EffectsCanvasGroup.Layers} do not override {@linkcode layerOptions}, so their `instance`s
   * will always be `undefined` as the default {@linkcode CanvasLayer.LayerOptions.name | name} is `""`.
   *
   * {@linkcode WeatherEffects.layerOptions | WeatherEffects.layerOptions} returns `name: "effects"`, causing
   * {@linkcode WeatherEffects.instance | WeatherEffects.instance} to return the {@linkcode Canvas.effects | EffectsCanvasGroup}.
   */
  static get instance(): CanvasLayer.Any | EffectsCanvasGroup.Implementation | undefined;

  /**
   * The canonical name of the CanvasLayer is the name of the constructor that is the
   * immediate child of the defined baseClass for the layer type.
   */
  override get name(): string;

  /**
   * The name used by hooks to construct their hook string.
   * Note: You should override this getter if hookName should not return the class constructor name.
   * @remarks Core's implementation just returns {@linkcode CanvasLayer.name | this.name}.
   */
  get hookName(): string;

  /**
   * Draw the canvas layer, rendering its internal components and returning a Promise
   * The Promise resolves to the drawn layer once its contents are successfully rendered.
   * @param options - Options which configure how the layer is drawn
   */
  draw(options?: HandleEmptyObject<CanvasLayer.DrawOptions>): Promise<this>;

  /**
   * The inner _draw method which must be defined by each CanvasLayer subclass.
   * @param options - Options which configure how the layer is drawn
   */
  protected _draw(options: HandleEmptyObject<CanvasLayer.DrawOptions>): Promise<void>;

  /**
   * Deconstruct data used in the current layer in preparation to re-draw the canvas
   * @param options - Options which configure how the layer is deconstructed
   */
  tearDown(options?: CanvasLayer.TearDownOptions): Promise<this>;

  /**
   * The inner _tearDown method which may be customized by each CanvasLayer subclass.
   * @param options - Options which configure how the layer is deconstructed
   */
  protected _tearDown(options: CanvasLayer.TearDownOptions): Promise<void>;

  /**
   * Get the zIndex that should be used for ordering this layer vertically relative to others in the same Container.
   */
  getZIndex(): number;

  #CanvasLayer: true;
}

declare namespace CanvasLayer {
  interface Any extends AnyCanvasLayer {}
  interface AnyConstructor extends Identity<typeof AnyCanvasLayer> {}

  type Layer = keyof typeof CONFIG.Canvas.layers;

  interface LayerOptions {
    /**
     * @remarks The layer name by which the {@linkcode CanvasLayer.instance | instance}
     * is referenced (via {@linkcode Canvas | canvas[this.LayerOptions.name]}).
     *
     * Defaults to `""` in {@linkcode CanvasLayer}
     *
     * See {@linkcode CanvasLayer.instance} remarks.
     */
    name: CanvasLayer.Layer | "effects" | "";

    /**
     * @remarks As of 14.361, this is used solely to get a `name` to compare against, so no specific constructor is required.
     */
    baseClass: CanvasLayer.AnyConstructor;

    /**
     * @defaultValue `0`
     */
    zIndex: number;
  }

  /** As of 14.366, core neither defines not uses without defining any properties */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DrawOptions {}

  interface TearDownOptions {
    /** The Scene about to be drawn, or null if the canvas is going blank. */
    nextScene?: Scene.Implementation | null | undefined;

    /** The Level about to be drawn, or null if the canvas is going blank. */
    nextLevel?: Level.Implementation | null | undefined;
  }
}

export default CanvasLayer;

declare abstract class AnyCanvasLayer extends CanvasLayer {
  constructor(...args: never);
}

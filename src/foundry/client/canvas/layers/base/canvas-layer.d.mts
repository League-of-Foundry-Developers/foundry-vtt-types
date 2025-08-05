import type { AnyObject, Identity } from "#utils";
import type { EffectsCanvasGroup } from "#client/canvas/groups/_module.d.mts";
// Hooks only used for links
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AllHooks } from "#client/hooks.mjs";

/**
 * An abstract pattern for primary layers of the game canvas to implement
 */
declare abstract class CanvasLayer extends PIXI.Container {
  /**
   * Options for this layer instance.
   * @defaultValue `this.constructor.layerOptions`
   */
  options: CanvasLayer.LayerOptions;

  /**
   * @defaultValue `false`
   */
  override interactiveChildren: boolean;

  /**
   * Customize behaviors of this CanvasLayer by modifying some behaviors at a class level.
   */
  static get layerOptions(): CanvasLayer.LayerOptions;

  /**
   * Return a reference to the active instance of this canvas layer
   * @remarks Since this returns `canvas[this.layerOptions.name]`, it will be `undefined` prior to {@linkcode AllHooks.canvasInit | canvasInit}
   * for most layers. The layers from {@linkcode foundry.canvas.groups.EffectsCanvasGroup.Layers} do not override {@linkcode layerOptions}, and
   * so their `instance`s will always be `undefined` as the default {@linkcode CanvasLayer.LayerOptions.name | name} is `""`
   *
   * {@linkcode foundry.canvas.layers.WeatherEffects.layerOptions | WeatherEffects.layerOptions} returns `name: "effects"`,
   * causing {@linkcode foundry.canvas.layers.WeatherEffects.instance | WeatherEffects.instance} to return the
   * {@linkcode foundry.canvas.Canvas.effects | EffectsCanvasGroup}
   */
  static get instance(): CanvasLayer.Any | EffectsCanvasGroup.Implementation | undefined;

  /**
   * The canonical name of the CanvasLayer is the name of the constructor that is the immediate child of the defined baseClass for the layer type.
   */
  override get name(): string;

  /**
   * The name used by hooks to construct their hook string.
   * Note: You should override this getter if hookName should not return the class constructor name.
   * @remarks Core's implementation just returns {@linkcode CanvasLayer.name | this.name}
   */
  get hookName(): string;

  /**
   * Draw the canvas layer, rendering its internal components and returning a Promise
   * The Promise resolves to the drawn layer once its contents are successfully rendered.
   * @param options - Options which configure how the layer is drawn
   */
  draw(options?: AnyObject): Promise<this>;

  /**
   * The inner _draw method which must be defined by each CanvasLayer subclass.
   * @param options - Options which configure how the layer is drawn
   */
  protected abstract _draw(options: AnyObject): Promise<void>;

  /**
   * Deconstruct data used in the current layer in preparation to re-draw the canvas
   * @param options - Options which configure how the layer is deconstructed
   */
  tearDown(options?: AnyObject): Promise<this>;

  /**
   * The inner _tearDown method which may be customized by each CanvasLayer subclass.
   * @param options - Options which configure how the layer is deconstructed
   */
  protected _tearDown(options: AnyObject): Promise<void>;
}

declare namespace CanvasLayer {
  interface Any extends AnyCanvasLayer {}
  interface AnyConstructor extends Identity<typeof AnyCanvasLayer> {}

  type Layers = keyof CONFIG.Canvas.Layers;

  interface LayerOptions {
    /**
     * @remarks The layer name by which the {@linkcode CanvasLayer.instance | instance} is referenced (via {@linkcode Canvas | canvas[this.LayerOptions.name]}).
     *
     * Defaults to `""` in {@linkcode CanvasLayer}
     *
     * See {@linkcode CanvasLayer.instance} remarks.
     */
    name: string; //CanvasLayer.Layers | "effects" | "";

    baseClass: typeof CanvasLayer;
  }
}

export default CanvasLayer;

declare abstract class AnyCanvasLayer extends CanvasLayer {
  constructor(...args: never);
}

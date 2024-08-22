import type { InexactPartial, Mixin } from "../../../../../types/utils.d.mts";

declare class BaseCanvasMixinClass {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /** @defaultValue `true` */
  sortableChildren: boolean;

  /**
   * The name of this canvas group
   * @remarks Foundry marked as abstract
   */
  static groupName: string;

  /**
   * If this canvas group should teardown non-layers children.
   */
  static tearDownChildren: boolean;

  /**
   * A mapping of CanvasLayer classes which belong to this group.
   * @remarks Default value defined by this.#createLayers, which pulls from CONFIG.Canvas.layers
   */
  layers: Record<string, CanvasLayer>;

  /** Draw the canvas group and all its component layers. */
  draw(): Promise<void>;

  /** Remove and destroy all layers from the base canvas. */
  tearDown(options: InexactPartial<Record<string, unknown>>): Promise<void>;
}

declare global {
  /**
   * A mixin which decorates any container with base canvas common properties.
   * @param ContainerClass - The parent Container class being mixed.
   * @returns A ContainerClass subclass mixed with BaseCanvasMixin features.
   */
  function BaseCanvasMixin<BaseClass extends BaseCanvasMixin.BaseClass>(
    ContainerClass: BaseClass,
  ): Mixin<typeof BaseCanvasMixinClass, BaseClass>;

  namespace BaseCanvasMixin {
    type BaseClass = typeof AnyPIXIContainer;
  }
}

declare abstract class AnyPIXIContainer extends PIXI.Container {
  constructor(arg0: never, ...args: never[]);
}

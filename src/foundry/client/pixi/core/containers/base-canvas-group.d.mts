import type { AnyObject, Mixin } from "../../../../../types/utils.d.mts";

declare class CanvasGroup {
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
   * The canonical name of the canvas group is the name of the constructor that is the immediate child of the defined base class.
   */
  get name(): string;

  /**
   * The name used by hooks to construct their hook string.
   * Note: You should override this getter if hookName should not return the class constructor name.
   */
  get hookName(): string;

  /**
   * A mapping of CanvasLayer classes which belong to this group.
   * @remarks Default value defined by this._createLayers, which pulls from CONFIG.Canvas.layers
   */
  layers: Record<string, CanvasLayer>;

  /**
   * Create CanvasLayer instances which belong to the canvas group.
   */
  _createLayers(): Record<string, CanvasLayer>;

  /** Draw the canvas group and all its component layers. */
  draw(options: CanvasGroupMixin.DrawOptions): Promise<void>;

  /**
   * Draw the canvas group and all its component layers.
   */
  protected _draw(options: CanvasGroupMixin.DrawOptions): Promise<void>;

  /**
   * Remove and destroy all layers from the base canvas.
   */
  tearDown(options: CanvasGroupMixin.TearDownOptions): Promise<void>;

  /**
   * Remove and destroy all layers from the base canvas.
   */
  protected _tearDown(options: CanvasGroupMixin.TearDownOptions): Promise<void>;
}

declare global {
  /**
   * A mixin which decorates any container with base canvas common properties.
   * @param ContainerClass - The parent Container class being mixed.
   * @returns A ContainerClass subclass mixed with BaseCanvasMixin features.
   */
  function CanvasGroupMixin<BaseClass extends CanvasGroupMixin.BaseClass>(
    ContainerClass: BaseClass,
  ): Mixin<typeof CanvasGroup, BaseClass>;

  namespace CanvasGroupMixin {
    type BaseClass = typeof AnyPIXIContainer;

    type DrawOptions = AnyObject;

    type TearDownOptions = AnyObject;
  }
}

declare abstract class AnyPIXIContainer extends PIXI.Container<any> {
  constructor(arg0: never, ...args: never[]);
}

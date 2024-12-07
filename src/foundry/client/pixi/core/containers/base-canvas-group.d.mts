import type { HandleEmptyObject, Mixin } from "../../../../../types/utils.d.mts";

declare class CanvasGroup<
  DrawOptions extends CanvasGroupMixin.DrawOptions = CanvasGroupMixin.DrawOptions,
  TearDownOptions extends CanvasGroupMixin.TearDownOptions = CanvasGroupMixin.TearDownOptions,
> {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /** @defaultValue `true` */
  sortableChildren: boolean;

  /**
   * The name of this canvas group
   * @remarks Foundry marked as abstract
   */
  static groupName: keyof CONFIG.Canvas.Groups;

  /**
   * If this canvas group should teardown non-layers children.
   * @defaultValue `true`
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
   * @remarks Default value defined by this._createLayers, which is called in the constructor, and   pulls from CONFIG.Canvas.layers
   */
  layers: Record<string, CanvasLayer>;

  /**
   * Create CanvasLayer instances which belong to the canvas group.
   */
  protected _createLayers(): Record<string, CanvasLayer>;

  /** Draw the canvas group and all its component layers. */
  draw(options?: HandleEmptyObject<DrawOptions>): Promise<void>;

  /**
   * Draw the canvas group and all its component layers.
   */
  protected _draw(options?: DrawOptions): Promise<void>;

  /**
   * Remove and destroy all layers from the base canvas.
   */
  tearDown(options: TearDownOptions): Promise<void>;

  /**
   * Remove and destroy all layers from the base canvas.
   */
  protected _tearDown(options: TearDownOptions): Promise<void>;
}

declare global {
  /**
   * A mixin which decorates any container with base canvas common properties.
   * @param ContainerClass - The parent Container class being mixed.
   * @returns A ContainerClass subclass mixed with BaseCanvasMixin features.
   */
  function CanvasGroupMixin<
    BaseClass extends CanvasGroupMixin.BaseClass,
    DrawOptions extends CanvasGroupMixin.DrawOptions = CanvasGroupMixin.DrawOptions,
    TearDownOptions extends CanvasGroupMixin.TearDownOptions = CanvasGroupMixin.TearDownOptions,
  >(ContainerClass: BaseClass): Mixin<typeof CanvasGroup<DrawOptions, TearDownOptions>, BaseClass>;

  namespace CanvasGroupMixin {
    type AnyConstructor = typeof AnyCanvasGroup;

    type BaseClass = PIXI.Container.AnyConstructor;

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface DrawOptions {}

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface TearDownOptions {}
  }
}

declare abstract class AnyCanvasGroup extends CanvasGroup {
  constructor(arg0: never, ...args: never[]);
}

import type { AnyObject, Mixin, PrettifyType, RemoveIndexSignatures } from "fvtt-types/utils";

declare const DynamicClass: new <_Computed extends object>(arg0: never, ...args: never[]) => _Computed;

// @ts-expect-error - This is a workaround to allow for dynamic top level properties in a class.
declare class LayersClass<
  Group extends CanvasGroupMixin.LayerGroup | NoLayerGroup,
  Instance extends object = RemoveIndexSignatures<GroupFor<Group>>,
> extends DynamicClass<Instance> {}

type GroupFor<Group extends CanvasGroupMixin.LayerGroup | NoLayerGroup> = Group extends CanvasGroupMixin.LayerGroup
  ? CanvasGroupMixin.LayersFor<Group>
  : // The empty object is useful to merge nothing in when necessary.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {};

declare class CanvasGroup<Group extends CanvasGroupMixin.LayerGroup | NoLayerGroup> extends LayersClass<Group> {
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
  layers: GroupFor<Group>;

  /**
   * Create CanvasLayer instances which belong to the canvas group.
   */
  _createLayers(): GroupFor<Group>;

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

declare const _NoLayerGroup: unique symbol;
type NoLayerGroup = typeof _NoLayerGroup;

declare global {
  /**
   * A mixin which decorates any container with base canvas common properties.
   * @param ContainerClass - The parent Container class being mixed.
   * @returns A ContainerClass subclass mixed with BaseCanvasMixin features.
   */
  function CanvasGroupMixin<
    BaseClass extends CanvasGroupMixin.BaseClass,
    // In `_createLayers` the co`de assigns top level properties to the class.
    // This is why Group exists.`
    Group extends CanvasGroupMixin.LayerGroup | NoLayerGroup = NoLayerGroup,
  >(
    ContainerClass: BaseClass,
  ): Mixin<typeof CanvasGroup<Group>, BaseClass> & { groupName: Group extends NoLayerGroup ? string : Group };

  namespace CanvasGroupMixin {
    type BaseClass = typeof AnyPIXIContainer;
    type AnyConstructor = typeof AnyCanvasGroup;
    type Any = AnyCanvasGroup;

    type DrawOptions = AnyObject;

    type TearDownOptions = AnyObject;

    interface Layers {
      readonly [key: string]: CanvasLayer;
    }

    type LayerGroup = keyof CONFIG["Canvas"]["groups"];

    type LayersFor<T extends LayerGroup> = PrettifyType<
      _FilterOutNever<{
        readonly [K in keyof typeof Canvas.layers]: (typeof Canvas.layers)[K] extends {
          readonly layerClass?: abstract new (...args: infer _1) => infer LayerInstance extends CanvasLayer;
          readonly group?: T;
        }
          ? LayerInstance
          : never;
      }>
    >;

    /** @internal */
    type _FilterOutNever<T> = {
      [K in keyof T as [T[K]] extends [never] ? never : K]: T[K];
    };
  }
}

declare abstract class AnyCanvasGroup extends CanvasGroup<NoLayerGroup> {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIContainer extends PIXI.Container<any> {
  constructor(arg0: never, ...args: never[]);
}

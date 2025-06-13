/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FixedInstanceType, HandleEmptyObject, Identity, PrettifyType, RemoveIndexSignatures } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { CanvasLayer } from "#client/canvas/layers/_module.d.mts";

declare const DynamicClass: new <_Computed extends object>(...args: never) => _Computed;

// @ts-expect-error - This is a workaround to allow for dynamic top level properties in a class.
declare class LayersClass<
  Group extends CanvasGroupMixin.LayerGroup | NoLayerGroup,
  Instance extends object = RemoveIndexSignatures<CanvasGroupMixin.LayersFor<Group>>,
> extends DynamicClass<Instance> {}

// Note(LukeAbby): This interface has been separated out to simplify the constructor edge cases.
// By avoiding having the instance side it makes the class more malleable and allows generics.
interface CanvasGroupStatic<Group extends CanvasGroupMixin.LayerGroup | NoLayerGroup> {
  /**
   * The name of this canvas group
   * @remarks Foundry marked as abstract
   */
  groupName: Group extends NoLayerGroup ? undefined : Group;

  /**
   * If this canvas group should teardown non-layers children.
   * @defaultValue `true`
   */
  tearDownChildren: boolean;
}

declare class CanvasGroup<
  Group extends CanvasGroupMixin.LayerGroup | NoLayerGroup,
  DrawOptions extends CanvasGroupMixin.DrawOptions = CanvasGroupMixin.DrawOptions,
  TearDownOptions extends CanvasGroupMixin.TearDownOptions = CanvasGroupMixin.TearDownOptions,
> extends LayersClass<Group> {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /** @defaultValue `true` */
  sortableChildren: boolean;

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
  layers: CanvasGroupMixin.LayersFor<Group>;

  /**
   * Create CanvasLayer instances which belong to the canvas group.
   */
  protected _createLayers(): CanvasGroupMixin.LayersFor<Group>;

  /** Draw the canvas group and all its component layers. */
  draw(options?: HandleEmptyObject<DrawOptions>): Promise<this>;

  /**
   * Draw the canvas group and all its component layers.
   */
  protected _draw(options?: HandleEmptyObject<DrawOptions>): Promise<void>;

  /**
   * Remove and destroy all layers from the base canvas.
   */
  tearDown(options: HandleEmptyObject<TearDownOptions>): Promise<this>;

  /**
   * Remove and destroy all layers from the base canvas.
   */
  protected _tearDown(options: HandleEmptyObject<TearDownOptions>): Promise<void>;
}

declare const _NoLayerGroup: unique symbol;
type NoLayerGroup = typeof _NoLayerGroup;

type ApplyGroup<
  BaseClass extends CanvasGroupMixin.BaseClass,
  Group extends CanvasGroupMixin.LayerGroup | NoLayerGroup,
> = CanvasGroupStatic<Group> &
  (new <DrawOptions extends CanvasGroupMixin.DrawOptions, TearDownOptions extends CanvasGroupMixin.TearDownOptions>(
    ...args: ConstructorParameters<BaseClass>
  ) => CanvasGroup<Group, DrawOptions, TearDownOptions> & FixedInstanceType<BaseClass>);

/**
 * A mixin which decorates any container with base canvas common properties.
 * @param ContainerClass - The parent Container class being mixed.
 */
declare function CanvasGroupMixin<
  BaseClass extends CanvasGroupMixin.BaseClass,
  // In `_createLayers` the code assigns top level properties to the class.
  // This is why Group exists.`
  Group extends CanvasGroupMixin.LayerGroup | NoLayerGroup = NoLayerGroup,
>(ContainerClass: BaseClass): CanvasGroupMixin.Mix<BaseClass, Group>;

declare global {
  /**
   * @deprecated since v12, until 14
   * @remarks "`BaseCanvasMixin` is deprecated in favor of {@linkcode foundry.canvas.groups.CanvasGroupMixin}"
   */
  const BaseCanvasMixin: typeof CanvasGroupMixin;
}

declare namespace CanvasGroupMixin {
  // Note(LukeAbby): This doesn't just use `Mix` because piecing together an `AnyMixed` type is
  // more subtle than typical here. Specifically
  interface AnyMixedConstructor extends Identity<typeof AnyCanvasGroup> {}
  interface AnyMixed extends AnyCanvasGroup {}

  type BaseClass = PIXI.Container.AnyConstructor;

  type Mix<
    BaseClass extends CanvasGroupMixin.BaseClass,
    Group extends CanvasGroupMixin.LayerGroup | NoLayerGroup,
  > = BaseClass & ApplyGroup<BaseClass, Group>;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DrawOptions {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TearDownOptions {}

  interface Layers {
    readonly [key: string]: CanvasLayer;
  }

  type LayerGroup = keyof CONFIG["Canvas"]["groups"];

  type LayersFor<T extends LayerGroup | NoLayerGroup> = PrettifyType<
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

  /**
   * @deprecated Replaced by {@linkcode CanvasGroupMixin.Mix}.
   */
  export import Mixed = CanvasGroupMixin.Mix;
}

export default CanvasGroupMixin;

declare abstract class InnerAnyCanvasGroup extends CanvasGroup<
  NoLayerGroup,
  CanvasGroupMixin.DrawOptions,
  CanvasGroupMixin.TearDownOptions
> {
  constructor(...args: never);
}

declare class MixableContainer extends PIXI.Container {
  constructor(...args: any[]);
}

declare const MergedCanvasGroup: typeof MixableContainer & typeof InnerAnyCanvasGroup & CanvasGroupStatic<any>;

// Note(LukeAbby) It's more involved than typical to get a proper `AnyCanvasGroup` type because
// static side and instance side have been split apart and mixing `PIXI.Container` has to be done
// carefully.
declare abstract class AnyCanvasGroup extends MergedCanvasGroup {}

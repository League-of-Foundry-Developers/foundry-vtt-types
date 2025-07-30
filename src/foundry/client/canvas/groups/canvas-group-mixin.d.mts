import type { FixedInstanceType, HandleEmptyObject, Identity, PrettifyType, RemoveIndexSignatures } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { CanvasLayer } from "#client/canvas/layers/_module.d.mts";
// Hooks only used for links
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AllHooks } from "#client/hooks.mjs";

declare const DynamicClass: new <_Computed extends object>(...args: never) => _Computed;

// @ts-expect-error This is a workaround to allow for dynamic top level properties in a class.
declare class LayersClass<
  Group extends CanvasGroupMixin.ConfiguredGroupNames | NoLayerGroup,
  Instance extends object = RemoveIndexSignatures<CanvasGroupMixin.LayersFor<Group>>,
  // TODO: include child groups https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3444
> extends DynamicClass<Instance> {}

// Note(LukeAbby): This interface has been separated out to simplify the constructor edge cases.
// By avoiding having the instance side it makes the class more malleable and allows generics.
interface CanvasGroupStatic<Group extends CanvasGroupMixin.ConfiguredGroupNames | NoLayerGroup> {
  /**
   * The name of this canvas group
   * @privateRemarks Foundry marked as abstract
   */
  groupName: Group extends NoLayerGroup ? undefined : Group;

  /**
   * If this canvas group should teardown non-layers children.
   * @defaultValue `true`
   */
  tearDownChildren: boolean;
}

declare class CanvasGroup<
  Group extends CanvasGroupMixin.ConfiguredGroupNames | NoLayerGroup,
  DrawOptions extends CanvasGroupMixin.DrawOptions = CanvasGroupMixin.DrawOptions,
  TearDownOptions extends CanvasGroupMixin.TearDownOptions = CanvasGroupMixin.TearDownOptions,
> extends LayersClass<Group> {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * @defaultValue `true`
   * @remarks Actually an override of {@linkcode PIXI.Container.sortableChildren | PIXI.Container#sortableChildren}
   */
  sortableChildren: boolean;

  /**
   * The canonical name of the canvas group is the name of the constructor that is the immediate child of the defined base class.
   * @remarks For example, both `CanvasVisibility` and any user-provided subclasses would return `"CanvasVisibility"`, as that
   * is the class in the chain that extends {@linkcode CanvasGroup | CanvasGroupMixin}
   */
  get name(): string;

  /**
   * The name used by hooks to construct their hook string.
   * Note: You should override this getter if hookName should not return the class constructor name.
   * @remarks Just returns {@link name | this.name} in core's implementation
   */
  get hookName(): string;

  /**
   * A mapping of CanvasLayer classes which belong to this group.
   * @remarks Default value defined by this._createLayers, which is called in the constructor, and pulls from {@linkcode CONFIG.Canvas.layers}
   */
  layers: CanvasGroupMixin.LayersFor<Group>;

  /**
   * Create CanvasLayer instances which belong to the canvas group.
   */
  protected _createLayers(): CanvasGroupMixin.LayersFor<Group>;

  /**
   * Draw the canvas group and all its component layers.
   * @remarks Fires the {@linkcode Hooks.DrawGroup | drawGroupName} hook where `GroupName` is replaced with {@linkcode hookName | this.hookName}
   */
  draw(options?: HandleEmptyObject<DrawOptions>): Promise<this>;

  /**
   * Draw the canvas group and all its component layers.
   * @remarks Will always be passed an options object by {@linkcode draw}
   */
  protected _draw(options: HandleEmptyObject<DrawOptions>): Promise<void>;

  /**
   * Remove and destroy all layers from the base canvas.
   * @remarks Fires the {@linkcode Hooks.TearDownGroup | tearDownGroupName} hook where `GroupName` is replaced with {@linkcode hookName | this.hookName}
   */
  tearDown(options?: HandleEmptyObject<TearDownOptions>): Promise<this>;

  /**
   * Remove and destroy all layers from the base canvas.
   * @remarks Will always be passed an options object by {@linkcode draw}
   */
  protected _tearDown(options: HandleEmptyObject<TearDownOptions>): Promise<void>;

  #CanvasGroup: true;
}

declare const _NoLayerGroup: unique symbol;
type NoLayerGroup = typeof _NoLayerGroup;

type ApplyGroup<
  BaseClass extends CanvasGroupMixin.BaseClass,
  Group extends CanvasGroupMixin.ConfiguredGroupNames | NoLayerGroup,
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
  // This is why the Group type param exists.`
  Group extends CanvasGroupMixin.ConfiguredGroupNames | NoLayerGroup = NoLayerGroup,
>(ContainerClass: BaseClass): CanvasGroupMixin.Mix<BaseClass, Group>;

declare global {
  /**
   * @deprecated "`BaseCanvasMixin` is deprecated in favor of {@linkcode foundry.canvas.groups.CanvasGroupMixin}" (since v12, until v14)
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
    Group extends CanvasGroupMixin.ConfiguredGroupNames | NoLayerGroup,
  > = BaseClass & ApplyGroup<BaseClass, Group>;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DrawOptions {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TearDownOptions {}

  type ConfiguredGroupNames = keyof CONFIG["Canvas"]["groups"];

  type LayersFor<T extends ConfiguredGroupNames | NoLayerGroup> = PrettifyType<
    _FilterOutNever<{
      readonly [K in keyof typeof Canvas.layers]: (typeof Canvas.layers)[K] extends {
        readonly layerClass?: abstract new (...args: infer _1) => infer LayerInstance extends CanvasLayer;
        readonly group?: T;
      }
        ? LayerInstance
        : never;
    }>
  >;

  // type ChildGroupsFor<Parent extends ConfiguredGroupNames | NoLayerGroup> = PrettifyType<
  //   _FilterOutNever<{
  //     readonly [K in ConfiguredGroupNames]: CONFIG.Canvas.Groups[K] extends {
  //       readonly groupClass?: abstract new (...args: infer _1) => infer GroupInstance extends AnyMixed;
  //       readonly parent?: Parent;
  //     }
  //       ? GroupInstance
  //       : never;
  //   }>
  // >;

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

declare abstract class _InnerAnyCanvasGroup extends CanvasGroup<
  NoLayerGroup,
  CanvasGroupMixin.DrawOptions,
  CanvasGroupMixin.TearDownOptions
> {
  constructor(...args: never);
}

declare class _MixableContainer extends PIXI.Container {
  constructor(...args: any[]);
}

declare const MergedCanvasGroup: typeof _MixableContainer & typeof _InnerAnyCanvasGroup & CanvasGroupStatic<any>;

// Note(LukeAbby) It's more involved than typical to get a proper `AnyCanvasGroup` type because
// static side and instance side have been split apart and mixing `PIXI.Container` has to be done
// carefully.
declare abstract class AnyCanvasGroup extends MergedCanvasGroup {}

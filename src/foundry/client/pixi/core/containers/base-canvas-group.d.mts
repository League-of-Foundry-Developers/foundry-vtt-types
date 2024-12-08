import type { HandleEmptyObject } from "../../../../../types/utils.d.mts";

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

type StaticCanvasGroup = typeof CanvasGroup;

// @ts-expect-error - Note(LukeAbby): This pattern is inherently an error. Specifically it errors with:
//   Interface 'CanvasGroupMixinReturn<BaseClass>' cannot simultaneously extend types 'typeof CanvasGroup' and 'BaseClass'.
//     Named property 'prototype' of types 'typeof CanvasGroup' and 'BaseClass' are not identical.
//
// There are workarounds to get this error to go away but then the error turns into this:
//   Interface 'CanvasGroupMixinReturn<BaseClass>' incorrectly extends interface 'BaseClass'.
//  'CanvasGroupMixinReturn<BaseClass>' is assignable to the constraint of type 'BaseClass', but 'BaseClass' could be instantiated with a different subtype of constraint 'typeof AnyPIXIContainer'.
//
// Which fundamentally cannot be fixed. Fortunately this error appears to be benign.
//
// The reason why this is helper is necessary is because `CanvasGroup` itself is generic.
// The only time that tsc accepts a generic constructor in a mixin is when the non-generic class has _exactly_ the signature `constructor(...args: any[])`. Not `constructor(...args: never[])` nor `constructor()` or seemingly anything.
// However in actual usage plenty of classes with concrete constructors are passed in.
interface CanvasGroupMixinReturn<BaseClass extends CanvasGroupMixin.BaseClass> extends StaticCanvasGroup, BaseClass {
  new (...args: ConstructorParameters<BaseClass>): CanvasGroup & BaseClass;
}

declare global {
  /**
   * A mixin which decorates any container with base canvas common properties.
   * @param ContainerClass - The parent Container class being mixed.
   * @returns A ContainerClass subclass mixed with BaseCanvasMixin features.
   */
  function CanvasGroupMixin<BaseClass extends CanvasGroupMixin.BaseClass>(
    ContainerClass: BaseClass,
  ): CanvasGroupMixinReturn<BaseClass>;

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

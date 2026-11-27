import type { ConcreteKeys, Identity, InexactPartial, MaybePromise, ValueOf } from "#utils";
import type { PrimarySpriteMesh } from "#client/canvas/primary/_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { Wall } from "#client/canvas/placeables/_module.d.mts";

/**
 * A mesh for an animated door.
 * Animation state is kept separate from the rendered mesh.
 */
declare class DoorMesh extends PrimarySpriteMesh {
  /**
   * Construct a DoorMesh. Call initialize after construction to prepare its animation and rendered state.
   * @remarks `texture` and `object` are required because {@linkcode DoorMesh.initialize | #initialize} reads them.
   */
  constructor(options: DoorMesh.ConstructorOptions);

  /**
   * The possible rendering styles for a door mesh.
   * @remarks Frozen.
   */
  static DOOR_STYLES: Readonly<DoorMesh.DoorStyles>;

  /**
   * The door's position and appearance when closed.
   */
  protected _closedPosition: DoorMesh.StateSnapshot;

  /**
   * The current animation values, before rendering adjustments such as parallax.
   */
  protected _animatedPosition: DoorMesh.StateSnapshot;

  /**
   * An amount of pixel padding surrounding the door texture.
   * @defaultValue `0`
   */
  texturePadding: number;

  /**
   * The identifier for this door animation.
   */
  get animationId(): string;

  /**
   * The resolved animation options and callbacks. Available after initialization.
   * @remarks `undefined` until {@linkcode DoorMesh.initialize | #initialize} has been called.
   */
  get animationConfig(): DoorMesh.ResolvedAnimationConfiguration | undefined;

  /**
   * The rendering style of this door mesh.
   * @remarks `undefined` until {@linkcode DoorMesh.initialize | #initialize} has been called, unless a `style` was passed
   * to the constructor.
   */
  get doorStyle(): DoorMesh.DoorStyle | undefined;

  /**
   * Configure and initialize the DoorMesh.
   * Call this after construction so that subclass fields exist before any overridable methods run.
   * Reinitializing cancels the current animation and resets the closed position and animation state.
   * @remarks Emits the `"configure"` and `"refresh"` events with this mesh. Despite all properties of
   * {@linkcode DoorMesh.AnimationConfiguration} being optional, `animation` lacks a `={}` default, so you must pass at
   * least an empty object.
   */
  initialize(animation: DoorMesh.AnimationConfiguration): void;

  /**
   * Initialize animation parameters after applying the closed door pose.
   * @remarks Calls the configured {@linkcode CONFIG.Wall.DoorAnimationConfig.initialize | initialize} callback, if any.
   */
  protected _initializeAnimation(open: boolean): void;

  /**
   * Compute the door's position and appearance when closed.
   */
  protected _getClosedPosition(config?: DoorMesh.AnimationConfiguration): DoorMesh.StateSnapshot;

  /**
   * Apply the current animation state and rendering adjustments to the mesh.
   * This does not advance the animation or change its stored values.
   * The mesh must have been initialized before calling this method.
   * @remarks Emits the `"refresh"` event with this mesh. Returns early, without emitting, if the mesh is destroyed.
   */
  refresh(): this;

  /**
   * Copy the current animation state for rendering.
   * Override this method to adjust the copy returned by super, for example to apply parallax.
   * Do not change the stored animation state or advance effects here; repeated refreshes must give the same result.
   */
  protected _getRenderState(): DoorMesh.StateSnapshot;

  /**
   * Run the callback before opening or closing the door.
   */
  protected _prepareAnimation(open: boolean): MaybePromise<void>;

  /**
   * Prepare the attributes for the requested opening or closing animation.
   */
  protected _getAnimationAttributes(open: boolean): CanvasAnimation.Attribute[];

  /**
   * Run the animation completion callback, including after external cancellation.
   * This is not called during initialization or after the animation is replaced or the mesh is destroyed.
   * Callbacks which change animation state must refresh it themselves.
   */
  protected _finalizeAnimation(open: boolean): MaybePromise<void>;

  /**
   * Animate the door toward the requested open or closed state.
   * The mesh must have been initialized before calling this method.
   * @param open - Whether to open the door. Defaults to the wall's current state.
   * @returns Whether the animation and its completion callback finished without being replaced.
   */
  animate(open?: boolean): Promise<boolean>;

  /**
   * @remarks Terminates the current animation first.
   */
  override destroy(options?: PIXI.IDestroyOptions | boolean): void;

  /**
   * Configure the `"swing"` animation.
   * @remarks A valid {@linkcode CONFIG.Wall.DoorAnimationFunction}
   */
  static animateSwing(this: DoorMesh, open: boolean): CanvasAnimation.Attribute[];

  /**
   * Configure the `"ascend"` animation.
   * @remarks A valid {@linkcode CONFIG.Wall.DoorAnimationFunction}
   */
  static animateAscend(this: DoorMesh, open: boolean): CanvasAnimation.Attribute[];

  /**
   * Set the initial elevation and sort order of an open descending door.
   * @remarks A valid {@linkcode CONFIG.Wall.DoorAnimationHook}
   */
  static initializeDescend(this: DoorMesh, open: boolean): void;

  /**
   * Keep a descending door at its closed elevation while it moves.
   * Restoring the elevation refreshes all animation values on the mesh.
   * @remarks A valid {@linkcode CONFIG.Wall.DoorAnimationHook}
   */
  static preAnimateDescend(this: DoorMesh, open: boolean): Promise<void>;

  /**
   * Configure the `"descend"` animation.
   * @remarks A valid {@linkcode CONFIG.Wall.DoorAnimationFunction}
   */
  static animateDescend(this: DoorMesh, open: boolean): CanvasAnimation.Attribute[];

  /**
   * Place an open descending door behind the scene and refresh the mesh.
   * @remarks A valid {@linkcode CONFIG.Wall.DoorAnimationHook}
   */
  static postAnimateDescend(this: DoorMesh, open: boolean): Promise<void>;

  /**
   * Configure the `"slide"` animation.
   * @remarks A valid {@linkcode CONFIG.Wall.DoorAnimationFunction}
   */
  static animateSlide(this: DoorMesh, open: boolean): CanvasAnimation.Attribute[];

  #DoorMesh: true;
}

declare namespace DoorMesh {
  interface Any extends AnyDoorMesh {}
  interface AnyConstructor extends Identity<typeof AnyDoorMesh> {}

  interface ConstructorOptions extends Omit<PrimarySpriteMesh.ConstructorOptions, "object" | "texture"> {
    /**
     * Texture passed to the SpriteMesh.
     * @remarks Required for {@linkcode DoorMesh}, as {@linkcode DoorMesh.initialize | #initialize} computes the closed
     * position from {@linkcode DoorMesh.texture | this.texture}
     */
    texture: PIXI.Texture;

    /**
     * @remarks This is technically inherited from {@linkcode PrimarySpriteMesh.ConstructorOptions.object}, which is much wider,
     * but by usage this class requires {@linkcode Wall}s. Required because {@linkcode DoorMesh.initialize | #initialize}
     * calls its {@linkcode Wall.isOpen | isOpen} method.
     *
     * See {@linkcode foundry.canvas.primary.PrimaryCanvasObjectMixin.AnyMixed.object | PrimaryCanvasObject#object}
     */
    object: Wall.Implementation;

    /**
     * @remarks Takes precedence over a `style` later passed to {@linkcode DoorMesh.initialize | #initialize}.
     */
    style?: DoorStyle | undefined;
  }

  type ConfiguredAnimationType = ConcreteKeys<typeof CONFIG.Wall.animationTypes>;

  /** @internal */
  interface _AnimationConfiguration {
    /**
     * @defaultValue `1`
     * @remarks
     * - For `swing` and `swivel` this is rotation direction: `1` for clockwise, `-1` counter-clockwise (pivoting from the
     * {@linkcode Wall.edge.a | a} endpoint of the edge for `swing`, and the midpoint for `swivel`)
     * - For `slide`, `1` slides towards `a` , `-1` away
     * - For `ascend` and `descend` it has no effect
     */
    direction: -1 | 1;

    /**
     * @defaultValue `false`
     * @remarks Is this mesh part of a double door pair?
     */
    double: boolean;

    /**
     * Animation duration in milliseconds.
     * @defaultValue `750`
     */
    duration: number;

    /**
     * @defaultValue `false`
     * @remarks Flip the texture along the axis of the door?
     */
    flip: boolean;

    /**
     * A multiplier between 0 and 2 that modifies how much the door moves when animating.
     * For example for a swinging door, more strength produces a wider open angle. For a
     * sliding door, more strength causes the door to slide farther.
     * @defaultValue `1.0`
     * @remarks
     * - For `swing` and `swivel` it's a linear scale from 0 (no movement) to 2 (180 degrees)
     * - For `slide` it's door-lengths shifted
     * - For `ascend` and `descend` it affects how much the texture grows/shrinks, and for `ascend`
     * it also affects the texture `alpha` (down to a minimum of `0.5` at strength `2.0`)
     */
    strength: number;

    /**
     * @defaultValue `"swing"`
     * @remarks Will also use `"swing"` as fallback if an invalid value is passed at runtime; {@linkcode WallDocument.AnimationData.type | Wall#animation#type}
     * is not constrained by `choices`, so it will persist currently-invalid `type`s until updated
     */
    type: ConfiguredAnimationType;

    /** @remarks Default depends on the value of `double`; `"doubleL"` if truthy, `"single"` otherwise */
    style: DoorStyle;
  }

  /**
   * @remarks The Foundry typedef also has `config`, but that always gets set to
   * {@linkcode CONFIG.Wall.animationTypes | CONFIG.Wall.animationTypes[type]} during initialization, regardless of input,
   * so it is not included here. See {@linkcode ResolvedAnimationConfiguration}.
   *
   * See {@linkcode WallDocument.AnimationData}
   */
  interface AnimationConfiguration extends InexactPartial<_AnimationConfiguration> {}

  /**
   * The type of {@linkcode DoorMesh.animationConfig | DoorMesh#animationConfig}: the animation configuration with
   * defaults applied.
   */
  interface ResolvedAnimationConfiguration extends Readonly<_AnimationConfiguration> {
    /**
     * Registered callbacks, assigned during initialization.
     */
    readonly config: CONFIG.Wall.DoorAnimationConfig;
  }

  interface DoorStyles {
    SINGLE: "single";
    DOUBLE_LEFT: "doubleL";
    DOUBLE_RIGHT: "doubleR";
  }

  type DoorStyle = ValueOf<DoorStyles>;

  interface StateSnapshot {
    x: number;
    y: number;
    elevation: number;
    sort: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    tint: number;
    alpha: number;
  }
}

export default DoorMesh;

declare abstract class AnyDoorMesh extends DoorMesh {
  constructor(...args: never);
}

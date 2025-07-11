import type { ConcreteKeys, Identity, InexactPartial, ValueOf } from "#utils";
import type { PrimarySpriteMesh } from "#client/canvas/primary/_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { Wall } from "#client/canvas/placeables/_module.d.mts";

/**
 * A special subclass of {@linkcode PrimarySpriteMesh} used to render an interactive door.
 */
declare class DoorMesh extends PrimarySpriteMesh {
  /**
   * Construct a DoorMesh by providing {@linkcode PrimarySpriteMesh} constructor options and specific door configuration.
   * @remarks `options` is required, `texture` and `object` must be passed or construction will throw.
   *
   * If no door configuration options are passed, the `"swing"` animation config will be loaded
   */
  constructor(options: DoorMesh.ConstructorOptions);

  /**
   * The possible rendering styles for a door mesh.
   * @remarks Frozen.
   */
  static DOOR_STYLES: Readonly<DoorMesh.DoorStyles>;

  /**
   * The original position of the door in its resting CLOSED state.
   * @internal
   */
  protected _closedPosition: DoorMesh.StateSnapshot;

  /**
   * The currently rendered position of the door.
   * @internal
   */
  protected _animatedPosition: DoorMesh.StateSnapshot;

  /**
   * An amount of pixel padding surrounding the door texture.
   */
  texturePadding: number;

  /**
   * The identifier for this door animation.
   */
  get animationId(): string;

  /**
   * Configure and initialize the DoorMesh.
   * This is called automatically upon construction, but may be called manually later to update the DoorMesh.
   * @remarks Despite all properties of {@linkcode DoorMesh.AnimationConfiguration} being optional, `options`
   * lacks a `={}` default, so you must pass at least an empty object
   */
  initialize(animation: DoorMesh.AnimationConfiguration): void;

  /**
   * Animate the door to its current rendered state.
   * @param open - Is the door now open or closed? (default: {@linkcode Wall.isOpen | this.object.isOpen})
   */
  animate(open?: boolean): Promise<void>;

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
   * Special initialization needed for descending door types.
   * @remarks A valid {@linkcode CONFIG.Wall.DoorAnimationHook}
   */
  static initializeDescend(this: DoorMesh, open: boolean): void;

  /**
   * When closing a descending door, shift its elevation to the foreground before animation.
   * @remarks A valid {@linkcode CONFIG.Wall.DoorAnimationHook}
   */
  static preAnimateDescend(this: DoorMesh, open: boolean): Promise<void>;

  /**
   * Configure the `"descend"` animation.
   * @remarks A valid {@linkcode CONFIG.Wall.DoorAnimationFunction}
   */
  static animateDescend(this: DoorMesh, open: boolean): CanvasAnimation.Attribute[];

  /**
   * When opening a descending door, shift its elevation to the background after animation.
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

  /**
   * @remarks Foundry types {@linkcode AnimationConfiguration.style | style} as required at construction, but it gets passed
   * to `##configure` via {@linkcode DoorMesh.initialize | #initialize}, where it has a default applied
   */
  interface ConstructorOptions
    extends Omit<PrimarySpriteMesh.ConstructorOptions, "object" | "texture">,
      AnimationConfiguration {
    /**
     * Texture passed to the SpriteMesh.
     * @remarks Required for {@linkcode DoorMesh}, as the constructor calls `##configure` which calls `##getClosedPosition`
     * which assumes a valid {@linkcode DoorMesh.texture | this.texture}
     */
    texture: PIXI.Texture;

    /**
     * @remarks This is technically inherited from {@linkcode PrimarySpriteMesh.ConstructorOptions.object}, which is much wider,
     * but by usage this class requires {@linkcode Wall}s. Required because `##configure` assumes it can call its
     * {@linkcode Wall.isOpen | isOpen} method.
     *
     * See {@linkcode foundry.canvas.primary.PrimaryCanvasObjectMixin.AnyMixed.object | PrimaryCanvasObject#object}
     */
    object: Wall.Implementation;
  }

  type ConfiguredAnimationType = ConcreteKeys<typeof CONFIG.Wall.animationTypes>;

  /** @internal */
  type _AnimationConfiguration = InexactPartial<{
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
     * @defaultValue `500`
     * @remarks Animation time in milliseconds
     *
     * The claimed default is the value in the configs for `swivel`, `slide`, and `swing` in {@linkcode CONFIG.Wall.animationTypes},
     * but the default of the {@linkcode WallDocument.AnimationData.duration | WallDocument#animation#duration} field is `750`
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
     * - For `ascend` and `descend` it affects how much the texture grows/shrinks. For `ascend` there's also code in place that implies it should
     * affect the  texture `alpha` (down to a minimum of `0.6` at strength `2.0`), but it's non-functional as of 13.346: {@link https://github.com/foundryvtt/foundryvtt/issues/13157}
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
  }>;

  /**
   * @remarks The Foundry typedef has `config` and `style` as required properties, but that is for the type of `DoorMesh##animation`,
   * after the object's passed through `##configure` and had defaults applied. Since there's no public access to that property, this
   * interface is typed for input, with everything optional.
   *
   * `config` always gets set to {@linkcode CONFIG.Wall.animationTypes | CONFIG.Wall.animationTypes[type]}, regardless of input, so it
   * is not included here.
   *
   * See {@linkcode WallDocument.AnimationData}
   */
  interface AnimationConfiguration extends _AnimationConfiguration {}

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
  }
}

export default DoorMesh;

declare abstract class AnyDoorMesh {
  constructor(...args: never);
}

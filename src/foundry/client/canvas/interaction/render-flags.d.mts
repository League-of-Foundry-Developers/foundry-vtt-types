import type {
  AnyConstructor,
  Coalesce,
  ConcreteKeys,
  FixedInstanceType,
  InexactPartial,
  MakeConform,
  Mixin,
  PhantomConstructor,
} from "#utils";
import type { LogCompatibilityWarningOptions } from "#common/utils/logging.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

declare class RenderFlagObject {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * Configure the render flags used for this class.
   * @defaultValue `{}`
   */
  static RENDER_FLAGS: RenderFlagsMixin.RENDER_FLAGS;

  /**
   * The ticker priority when RenderFlags of this class are handled.
   * Valid values are OBJECTS or PERCEPTION.
   * @defaultValue `"OBJECTS"`
   * @remarks Must match a key of {@linkcode Canvas.pendingRenderFlags}
   */
  static RENDER_FLAG_PRIORITY: RenderFlags.Priority;

  /**
   * Status flags which are applied at render-time to update the PlaceableObject.
   * If an object defines RenderFlags, it should at least include flags for "redraw" and "refresh".
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  renderFlags: RenderFlags<{}>;

  /**
   * Apply any current render flags, clearing the renderFlags set.
   * Subclasses should override this method to define behavior.
   */
  applyRenderFlags(): void;
}

/**
 * @privateRemarks Values are marked as optional here based on use, foundry docs incomplete
 * @internal
 */
type _RenderFlag<Keys extends string> = InexactPartial<{
  /**
   * Activating this flag also sets these flags to true
   */
  propagate: Keys[];

  /**
   * Activating this flag resets these flags to false
   */
  reset: Keys[];

  /**
   * Is this flag deprecated? The deprecation options are passed to {@linkcode foundry.utils.logCompatibilityWarning}.
   * The deprecation message is auto-generated unless message is passed with the options.
   * By default the message is logged only once.
   */
  deprecated: {
    message: string;
  } & LogCompatibilityWarningOptions;

  alias: boolean;
}>;

// Note(LukeAbby): The usage of `ConcreteKeys` is a hazard; if tsc were to become smarter it might
// notice that `ConcreteKeys<Flags>` is actually contravariant and reject this type. However
// `RenderFlags` is built upon the assumption this is only used in safe ways.
declare interface RenderFlag<out Flags extends object, Key extends keyof Flags>
  extends _RenderFlag<Exclude<Extract<ConcreteKeys<Flags>, string>, Key>> {}

declare namespace RenderFlag {
  interface Any extends _RenderFlag<string> {}
}

/**
 * A data structure for tracking a set of boolean status flags.
 * This is a restricted set which can only accept flag values which are pre-defined.
 */
declare class RenderFlags<Flags extends RenderFlags.ValidateFlags<Flags>> extends Set<string> {
  /**
   * @param flags  - An object which defines the flags which are supported for tracking
   * @param config - Optional configuration
   */
  constructor(flags: Flags, config?: RenderFlags.Config);

  /** @remarks `defineProperty`'d at construction with `enumerable: false, writable: false` and the value frozen. */
  readonly flags: Readonly<Flags>;

  /** @remarks `defineProperty`'d at construction with `enumerable: false, writable: false` */
  readonly object: RenderFlagObject;

  /**
   * The update priority when these render flags are applied.
   * Valid options are `"OBJECTS"` or `"PERCEPTION"`.
   *
   * @remarks `defineProperty`'d at construction with `enumerable: false, writable: false`
   */
  readonly priority: RenderFlags.Priority;

  /**
   * @returns The flags which were previously set that have been cleared.
   */
  clear(): Record<string, boolean>;

  /**
   * Allow for handling one single flag at a time.
   * This function returns whether the flag needs to be handled and removes it from the pending set.
   */
  handle(flag: string): boolean;

  /**
   * Activate certain flags, also toggling propagation and reset behaviors
   * @remarks Flags are only set if `true`, nullish values are discarded
   */
  set(changes: Record<string, boolean | undefined | null>): void;
}

declare namespace RenderFlags {
  type ValidateFlags<Flags extends object> = {
    [K in keyof Flags]: MakeConform<Flags[K], _RenderFlag<Extract<Exclude<keyof Flags, K>, string>>>;
  };

  interface Config {
    /** The object which owns this RenderFlags instance */
    object?: RenderFlagObject;

    /**
     * The ticker priority at which these render flags are handled
     * @defaultValue {@linkcode PIXI.UPDATE_PRIORITY.OBJECTS}
     * @remarks The default value does *not* match the type as of 13.346, this is a core bug: {@link https://github.com/foundryvtt/foundryvtt/issues/13171}.
     * Due to this the property has been marked required here, it can go back to optional if the default is fixed.
     *
     * See {@linkcode RenderFlags.priority | RenderFlags#priority}
     */
    priority: Priority;
  }

  /**
   * @remarks {@linkcode RenderFlags.set | RenderFlags#set} and {@linkcode RenderFlags.clear | RenderFlags#clear}
   * both access {@linkcode Canvas.pendingRenderFlags | canvas.pendingRenderFlags[priority]}
   */
  type Priority = keyof Canvas.PendingRenderFlags;
}

/**
 * Add RenderFlags functionality to some other object.
 * This mixin standardizes the interface for such functionality.
 * @param Base - The base class being mixed: defaults to an anonymous empty class.
 * @returns The mixed class definition
 *
 * @remarks `Base` is normally a PIXI.DisplayObject
 */
// Note(LukeAbby): In theory a similar thing to what happens in `CanvasGroupMixin` could be done.
// That is passing up a generic to instantiate the generic side. However `RenderFlagsMixin` is
// only inherited directly by `PerceptionManager` and `PlaceableObject`.
// Therefore it's mostly the subclasses of `PlaceableObject` that face this problem and that can't
// be solved here unfortunately.
declare function RenderFlagsMixin<BaseClass extends RenderFlagsMixin.BaseClass | undefined = undefined>(
  Base?: BaseClass,
): RenderFlagsMixin.Mix<BaseClass>;

declare namespace RenderFlagsMixin {
  interface AnyMixedConstructor extends ReturnType<typeof RenderFlagsMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type Mix<BaseClass extends RenderFlagsMixin.BaseClass | undefined> = Mixin<
    typeof RenderFlagObject,
    Coalesce<BaseClass, PhantomConstructor>
  >;

  type BaseClass = AnyConstructor;

  type RENDER_FLAGS = Record<string, RenderFlag.Any>;

  /**
   * This type exists only to make sure `ToBooleanFlags` isn't a homomorphic mapped type
   * to avoid keeping documentation.
   *
   * @internal
   */
  type _KeyOf<T> = keyof T;

  type ToBooleanFlags<RenderFlags extends object> = {
    [K in _KeyOf<RenderFlags>]?: boolean | undefined;
  };
}

export { RenderFlags as default, RenderFlagsMixin, RenderFlag };

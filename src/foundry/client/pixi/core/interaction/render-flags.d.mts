import type { AnyConstructor, ConcreteKeys, FixedInstanceType, InexactPartial, Mixin } from "fvtt-types/utils";
import type { LogCompatibilityWarningOptions } from "../../../../common/utils/logging.d.mts";

declare class RenderFlagObject {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
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
   */
  static RENDER_FLAG_PRIORITY: "OBJECTS" | "PERCEPTION";

  /**
   * Status flags which are applied at render-time to update the PlaceableObject.
   * If an object defines RenderFlags, it should at least include flags for "redraw" and "refresh".
   */
  renderFlags: RenderFlags;

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
type _RenderFlags<Flags extends object> = InexactPartial<{
  /**
   * Activating this flag also sets these flags to true
   */
  propagate: ConcreteKeys<Flags>[];

  /**
   * Activating this flag resets these flags to false
   */
  reset: ConcreteKeys<Flags>[];

  /**
   * Is this flag deprecated? The deprecation options are passed to
   * logCompatibilityWarning. The deprectation message is auto-generated
   * unless message is passed with the options.
   * By default the message is logged only once.
   */
  deprecated: {
    message: string;
  } & LogCompatibilityWarningOptions;

  /**
   * @remarks Possibly meant to be a sub-property of deprecated,
   * the runtime check in `RenderFlags##set` looks for this as a top level property
   */
  alias: boolean;
}>;

declare global {
  // Note(LukeAbby): The usage of `ConcreteKeys` is a hazard; if tsc were to become smarter it might
  // notice that `ConcreteKeys<Flags>` is actually contravariant and reject this type. However
  // `RenderFlags` is built upon the assumption this is only used in safe ways.
  interface RenderFlag<out Flags extends object> extends _RenderFlags<Flags> {}

  namespace RenderFlag {
    interface Any extends RenderFlag<any> {}
  }

  /**
   * A data structure for tracking a set of boolean status flags.
   * This is a restricted set which can only accept flag values which are pre-defined.
   */
  class RenderFlags extends Set<string> {
    /**
     * @param flags  - An object which defines the flags which are supported for tracking
     * @param config - Optional configuration
     */
    constructor(
      flags: Record<string, RenderFlag<Record<string, boolean>>>,
      config?: {
        /** The object which owns this RenderFlags instance */
        object?: RenderFlagObject;

        /**
         * The update priority when these render flags are applied.
         * Valid options are OBJECTS or PERCEPTION.
         * @defaultValue `PIXI.UPDATE_PRIORITY.OBJECTS`
         */
        priority?: typeof PIXI.UPDATE_PRIORITY.OBJECTS | typeof PIXI.UPDATE_PRIORITY.PERCEPTION;
      },
    );

    readonly flags: Record<string, RenderFlag<Record<string, boolean>>>;

    readonly object: RenderFlagObject;

    readonly priority: "OBJECT" | "PERCEPTION";

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

  /**
   * Add RenderFlags functionality to some other object.
   * This mixin standardizes the interface for such functionality.
   * @param Base - The base class being mixed. Normally a PIXI.DisplayObject
   * @returns The mixed class definition
   */
  function RenderFlagsMixin<BaseClass extends RenderFlagsMixin.BaseClass>(
    Base: BaseClass,
  ): Mixin<typeof RenderFlagObject, BaseClass>;

  namespace RenderFlagsMixin {
    interface AnyMixedConstructor extends ReturnType<typeof RenderFlagsMixin<BaseClass>> {}
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = AnyConstructor;

    type RENDER_FLAGS = Record<string, RenderFlag<object>>;

    /**
     * @internal This type exists only to make sure `ToBooleanFlags` isn't a homomorphic mapped type
     * to avoid keeping documentation.
     */
    type _KeyOf<T> = keyof T;

    type ToBooleanFlags<RenderFlags extends object> = {
      [K in _KeyOf<RenderFlags>]: boolean;
    };
  }
}

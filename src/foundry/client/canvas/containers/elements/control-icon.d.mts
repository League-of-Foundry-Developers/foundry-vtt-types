import type { Identity, InexactPartial } from "#utils";
import { RenderFlagsMixin, type RenderFlag, type RenderFlags } from "#client/canvas/interaction/_module.mjs";
import { PreciseText } from "#client/canvas/containers/_module.mjs";

/**
 * A generic helper for drawing a standard Control Icon.
 */
declare class ControlIcon extends RenderFlagsMixin<typeof PIXI.Container>(PIXI.Container) {
  constructor(options?: ControlIcon.Options);

  /**
   * @deprecated "Passing null for tint to the ControlIcon constructor is deprecated. Pass 0xFFFFFF or undefined
   * instead." (since v14, until v16)
   */
  constructor(options: ControlIcon.DeprecatedConstructorOptions);

  /** @defaultValue `"INTERFACE"` */
  static override RENDER_FLAG_PRIORITY: RenderFlags.Priority;

  static override RENDER_FLAGS: ControlIcon.RENDER_FLAGS;

  // fake type override
  override renderFlags: RenderFlags<ControlIcon.RENDER_FLAGS>;

  /** The (URL of the) icon texture used by this control icon. */
  get texture(): PIXI.Texture | string;

  set texture(value: PIXI.Texture | string);

  /** The size of the control icon. */
  get size(): number;

  set size(value: number);

  /**
   * The elevation of the control icon, which is displayed in its tooltip text.
   * @throws If assigned anything other than a finite number.
   */
  get elevation(): number;

  set elevation(value: number);

  /** The background of this control icon. */
  bg: PIXI.Graphics;

  /** The border of this control icon. */
  border: PIXI.Graphics;

  /** The icon of this control icon. */
  icon: PIXI.Sprite;

  /** The tooltip of this control icon. */
  tooltip: PreciseText;

  override applyRenderFlags(): void;

  /** Draw the visualization of this control icon. */
  draw(): Promise<this>;

  /** Draw this control icon. */
  protected _draw(): Promise<void>;

  /** Clear this control icon. */
  protected _clear(): void;

  /** Refresh the visualization of this control icon. */
  protected _refresh(): void;

  /** Refresh the visualization of this control icon. */
  refresh(): void;

  /**
   * @deprecated "ControlIcon#refresh(options) has been deprecated. Set ControlIcon#visible,
   * ControlIcon#icon#tint, and ControlIcon#border#tint instead." (since v14, until v16)
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  refresh(options: ControlIcon.RefreshOptions): this;

  override destroy(options?: PIXI.IDestroyOptions | boolean): void;

  /** @deprecated "ControlIcon#rect has been deprecated in favor of ControlIcon#size." (since v14, until v16) */
  get rect(): [number, number, number, number];

  /**
   * @deprecated "ControlIcon#tintColor has been deprecated in favor of ControlIcon#icon.tint." (since v14, until v16)
   */
  get tintColor(): PIXI.ColorSource;

  /**
   * @deprecated "ControlIcon#borderColor has been deprecated in favor of ControlIcon#border.tint." (since v14, until v16)
   */
  get borderColor(): PIXI.ColorSource;

  /** @deprecated "ControlIcon#iconSrc has been deprecated in favor of ControlIcon#texture." (since v14, until v16) */
  get iconSrc(): PIXI.Texture | string;

  set iconSrc(value: PIXI.Texture | string);

  #ControlIcon: true;
}

declare namespace ControlIcon {
  interface Any extends AnyControlIcon {}
  interface AnyConstructor extends Identity<typeof AnyControlIcon> {}

  interface RENDER_FLAGS extends RenderFlagsMixin.RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{}` */
    refresh: RenderFlag<this, "refresh">;
  }

  interface Options {
    /**
     * The (URL of the) icon texture
     * @defaultValue {@linkcode PIXI.Texture.EMPTY}
     */
    texture?: PIXI.Texture | string | undefined;

    /**
     * The size of the icon
     * @defaultValue `40`
     */
    size?: number | undefined;

    /**
     * The icon tint
     * @defaultValue `0xFFFFFF`
     */
    tint?: PIXI.ColorSource | undefined;

    /**
     * The border color
     * @defaultValue {@linkcode CONFIG.Canvas.dispositionColors | CONFIG.Canvas.dispositionColors.CONTROLLED}
     */
    borderColor?: PIXI.ColorSource | undefined;

    /**
     * The elevation
     * @defaultValue `0`
     */
    elevation?: number | undefined;
  }

  /**
   * Options for the deprecated {@linkcode ControlIcon} constructor overload, where `tint` may be `null`.
   *
   * @remarks A `null` tint logs a compatibility warning and is replaced with `0xFFFFFF`, the default.
   */
  interface DeprecatedConstructorOptions extends Omit<Options, "tint"> {
    /** The icon tint */
    tint: null;
  }

  /** @deprecated since v14 */
  interface RefreshOptions extends InexactPartial<_RefreshOptions> {}

  /** @internal */
  interface _RefreshOptions {
    visible: boolean;
    iconColor: PIXI.ColorSource | null;
    borderColor: PIXI.ColorSource;
    borderVisible: boolean;
  }
}

export default ControlIcon;

declare abstract class AnyControlIcon extends ControlIcon {
  constructor(...args: never);
}

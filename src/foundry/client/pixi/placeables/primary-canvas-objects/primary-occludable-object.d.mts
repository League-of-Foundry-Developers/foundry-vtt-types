import type { InexactPartial, Mixin } from "../../../../../utils/index.d.mts";

declare class PrimaryOccludableObject {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * Is this occludable object hidden for Gamemaster visibility only?
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * A flag which tracks whether the primary canvas object is currently in an occluded state.
   * @defaultValue `false`
   */
  occluded: boolean;

  /**
   * The occlusion mode of this occludable object.
   * @defaultValue `CONST.OCCLUSION_MODES.NONE`
   */
  occlusionMode: typeof CONST.OCCLUSION_MODES;

  /**
   * The unoccluded alpha of this object.
   * @defaultValue `1`
   */
  unoccludedAlpha: number;

  /**
   * The occlusion alpha of this object.
   * @defaultValue `0`
   */
  occludedAlpha: number;

  /**
   * Fade this object on hover?
   * @defaultValue `true`
   */
  get hoverFade(): boolean;

  set hoverFade(value);

  /**
   * The amount of rendered FADE, RADIAL, and VISION occlusion.
   */
  protected _occlusionState: PrimaryOccludableObjectMixin.OcclusionState;

  /**
   * The state of hover-fading.
   */
  protected _hoverFadeState: PrimaryOccludableObjectMixin.HoverFadeState;

  /**
   * Get the blocking option bitmask value.
   */
  protected get _restrictionState(): number;

  /**
   * Is this object blocking light?
   */
  get restrictsLight(): boolean;

  set restrictsLight(enabled);

  /**
   * Is this object blocking weather?
   */
  get restrictsWeather(): boolean;

  set restrictsWeather(enabled);

  /**
   * Is this occludable object... occludable?
   */
  get isOccludable(): boolean;

  /**
   * Debounce assignment of the PCO occluded state to avoid cases like animated token movement which can rapidly
   * change PCO appearance.
   * Uses a 50ms debounce threshold.
   * Objects which are in the hovered state remain occluded until their hovered state ends.
   */
  debounceSetOcclusion: (occluded: boolean) => void;

  updateCanvasTransform(): void;

  _shouldRenderDepth: boolean;

  /**
   * Test whether a specific Token occludes this PCO.
   * Occlusion is tested against 9 points, the center, the four corners-, and the four cardinal directions
   * @param token   - The Token to test
   * @param options - Additional options that affect testing
   * @returns Is the Token occluded by the PCO?
   */
  testOcclusion(
    token: Token,
    options?: InexactPartial<{
      /** Test corners of the hit-box in addition to the token center? */
      corners: boolean;
    }>,
  ): boolean;

  /**
   * @deprecated since v12, will be removed in v14
   */
  get roof(): boolean;

  /**
   * @deprecated since v12, will be removed in v14
   */
  containsPixel(x: number, y: number, alphaThreshold: number): boolean;

  /**
   * @deprecated since v11, will be removed in v13
   */
  renderOcclusion(renderer: PIXI.Renderer): void;
}

declare global {
  function PrimaryOccludableObjectMixin<BaseClass extends PIXI.DisplayObject.AnyConstructor>(
    DisplayObject: BaseClass,
  ): Mixin<typeof PrimaryOccludableObject, ReturnType<typeof PrimaryCanvasObjectMixin<BaseClass>>>;

  namespace PrimaryOccludableObjectMixin {
    type MixinClass = typeof PrimaryOccludableObject;

    interface OcclusionState {
      /** The amount of FADE occlusion */
      fade: number;

      /** The amount of RADIAL occlusion */
      radial: number;

      /** The amount of VISION occlusion */
      vision: number;
    }

    interface HoverFadeState {
      /** The hovered state */
      hovered: boolean;

      /** The last time when a mouse event was hovering this object */
      hoveredTime: number;

      /** The faded state */
      faded: boolean;

      /** The fading state */
      fading: boolean;

      /** The time the fade animation started */
      fadingTime: number;

      /** The amount of occlusion */
      occlusion: number;
    }
  }
}

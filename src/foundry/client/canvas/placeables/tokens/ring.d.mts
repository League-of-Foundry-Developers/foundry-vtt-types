import type { Brand, FixedInstanceType, Identity, InexactPartial, InitializedOn } from "#utils";
import type { DynamicRingData } from "./_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { PrimarySpriteMesh } from "#client/canvas/primary/_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

/**
 * Dynamic Token Ring Manager.
 */
declare class TokenRing {
  /** A `TokenRing` is constructed by providing a reference to a `Token` object. */
  constructor(token: Token.Implementation);

  /** The effects which could be applied to a token ring (using bitwise operations) */
  static effects: Readonly<TokenRing.Effects>;

  /**
   * Is the token rings framework enabled? Will be `null` if the system hasn't initialized yet.
   * @remarks {@linkcode TokenRing.Implementation.initialize | CONFIG.Token.ring.ringClass.initialize} is called inside
   * {@linkcode Canvas.initialize}, which is called between the `setup` and `ready` hooks.
   */
  static get initialized(): InitializedOn<true, "ready", true | null>;

  /**
   * Token Rings sprite sheet base texture.
   * @remarks Only `undefined` prior to first canvas draw; set in {@linkcode TokenRing.createAssetsUVs}
   */
  static baseTexture: PIXI.BaseTexture | undefined;

  /**
   * Rings and background textures UVs and center offset.
   * @remarks Only `undefined` prior to first canvas draw; set in {@linkcode TokenRing.createAssetsUVs}
   */
  static texturesData: Record<string, TokenRing.TextureData> | undefined;

  /**
   * The token ring shader class definition.
   * @remarks Set in {@linkcode TokenRing.initialize}
   */
  static tokenRingSamplerShader: InitializedOn<DynamicRingData["framework"]["shaderClass"], "ready">;

  /** Initialize the Token Rings system, registering the batch plugin and patching `PrimaryCanvasGroup#addToken`. */
  static initialize(): void;

  /** Create texture UVs for each asset into the token rings sprite sheet. */
  static createAssetsUVs(): void;

  /**
   * Get the UVs array for a given texture name and scale correction.
   * @param name              - Name of the texture we want to get UVs.
   * @param scaleCorrection   - The scale correction applied to UVs. (default: `1`)
   */
  static getTextureUVs(name: string, scaleCorrection?: number): Float32Array | void;

  /**
   * Get ring and background names for a given size.
   * @param size  - The size to match (grid size dimension)
   * @remarks `size` is in units of grid _spaces_, the core rings provide spritesheet frames for `0.5`, `1`, `2`, `3`, and `4`,
   * and the value core passes in its only call is `Math.min(this.token.document.width ?? 1, this.token.document.height ?? 1)`.
   * Values between provided sizes will use the closest available size provided.
   */
  static getRingDataBySize(size: number): TokenRing.RingData;

  /**
   * @remarks Not initialized to a value, this gets set in {@linkcode TokenRing.configureSize | TokenRing#configureSize}.
   * After initialization (`ready`), this will only be `undefined` if the current spritesheet provides no frames
   */
  ringName: TokenRing.RingData["ringName"];

  /**
   * @remarks Not initialized to a value, this gets set in {@linkcode TokenRing.configureSize | TokenRing#configureSize}.
   * After initialization (`ready`), this will only be `undefined` if the current spritesheet provides no frames
   */
  bkgName: TokenRing.RingData["bkgName"];

  /**
   * @remarks Not initialized to a value, this gets set in {@linkcode TokenRing.configureSize | TokenRing#configureSize}.
   * After initialization (`ready`), this will only be `undefined` if the current spritesheet provides no frames
   */
  maskName: TokenRing.RingData["maskName"];

  ringUVs: InitializedOn<Float32Array, "ready">;

  bkgUVs: InitializedOn<Float32Array, "ready">;

  maskUVs: InitializedOn<Float32Array, "ready">;

  /**
   * Little endian format =\> BBGGRR
   * @defaultValue `0xFFFFFF`
   */
  ringColorLittleEndian: number;

  /**
   * Little endian format =\> BBGGRR
   * @defaultValue `0xFFFFFF`
   */
  bkgColorLittleEndian: number;

  /**
   * @defaultValue `null`
   */
  defaultRingColorLittleEndian: TokenRing.RingData["defaultRingColorLittleEndian"];

  /**
   * @defaultValue `null`
   */
  defaultBackgroundColorLittleEndian: TokenRing.RingData["defaultBackgroundColorLittleEndian"];

  /**
   * @defaultValue `0`
   * @remarks A bitmask of {@linkcode TokenRing.Effects | `effects`}.
   */
  effects: number;

  /**
   * @defaultValue `1`
   */
  scaleCorrection: number;

  /**
   * @defaultValue `1`
   */
  scaleAdjustmentX: number;

  /**
   * @defaultValue `1`
   */
  scaleAdjustmentY: number;

  /**
   * @defaultValue `1`
   */
  subjectScaleAdjustment: TokenRing.RingData["subjectScaleAdjustment"];

  /**
   * @defaultValue `1`
   */
  textureScaleAdjustment: number;

  /**
   * @remarks Not initialized to a value, this gets set in {@linkcode TokenRing.configureSize | TokenRing#configureSize}.
   * After initialization (`ready`), this will only be `undefined` if the current spritesheet provides no frames
   */
  colorBand: TokenRing.RingData["colorBand"];

  /**
   * Reference to the token that should be animated
   * @remarks This getter is the return of calling {@linkcode WeakRef.deref | deref} on the stored {@linkcode WeakRef}
   * of the Token passed at construction; If the Token has been garbage collected, will return undefined.
   */
  get token(): Token.Implementation | undefined;

  /**
   * Configure the sprite mesh.
   * @param mesh  - The mesh to which TokenRing functionality is configured. (default to {@linkcode Token.mesh | token.mesh})
   */
  configure(mesh: PrimarySpriteMesh): void;

  /** Clear configuration pertaining to token ring from the mesh. */
  clear(): void;

  /** Configure token ring size. */
  configureSize(options?: TokenRing.ConfigureSizeOptions): void;

  /** Configure the token ring visuals properties. */
  configureVisuals(): void;

  /**
   * Flash the ring briefly with a certain color.
   * @param color            - Color to flash.
   * @param animationOptions - Options to customize the animation. (default: `{}`)
   * @remarks Only returns `Promise<void>` if `color` is `NaN`ish
   */
  flashColor(Color: Color, animationOptions?: TokenRing.FlashColorOptions): Promise<boolean | void>;

  /**
   * Create an easing function that spikes in the center. Ideal duration is around 1600ms.
   * @param spikePct  - Position on [0,1] where the spike occurs. (default: `0.5`)
   */
  // spikePct: not null (used as divisor)
  static createSpikeEasing(spikePct?: number): CanvasAnimation.EasingFunction;

  /**
   * Easing function that produces two peaks before returning to the original value. Ideal duration is around 500ms.
   * @param pt  - The proportional animation timing on [0,1].
   * @returns   - The eased animation progress on [0,1].
   */
  static easeTwoPeaks(pt: number): number;

  /**
   * Soft ping pong curve for photosensitive people.
   * @param pt - The proportional animation timing on [0,1].
   * @returns The eased animation progress on [0,1].
   */
  static easePingPong(pt: number): number;

  /**
   * To avoid breaking dnd5e.
   * @deprecated No deprecation warning or end of deprecation period provided, but this doesn't exist in v14. (since v12, until v14)
   */
  configureMesh(): void;

  /**
   * To avoid breaking dnd5e.
   * @deprecated No deprecation warning or end of deprecation period provided, but this doesn't exist in v14. (since v12, until v14)
   */
  configureNames(): void;
}

declare namespace TokenRing {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Implementation} instead. This type will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode ImplementationClass} instead. This type will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyTokenRing {}
    interface AnyConstructor extends Identity<typeof AnyTokenRing> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Token"]["ring"]["ringClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  /** @privateRemarks Inferred from `TokenRing##adjustScaleByFitMode` */
  type FitMode = "fill" | "cover" | "contain" | "width" | "height";

  interface _ConfigureSizeOptions {
    /**
     * The desired fit mode
     * @defaultValue `"contain"`
     */
    fit: FitMode;

    /**
     * A custom scale multiplier applied on scale correction
     * @defaultValue `1`
     */
    scaleMultiplier: number;
  }

  interface ConfigureSizeOptions extends InexactPartial<_ConfigureSizeOptions> {}

  /** @remarks No new properties, just overrides for default values */
  interface FlashColorOptions extends CanvasAnimation.AnimateOptions {
    /**
     * A duration in milliseconds over which the animation should occur
     * @defaultValue `1600`
     * @remarks **and maximum** changes to `1000`
     */
    duration?: number;

    /**
     * A priority in {@linkcode PIXI.UPDATE_PRIORITY} which defines when the animation should be evaluated related to others
     * @defaultValue {@linkcode PIXI.UPDATE_PRIORITY.HIGH}
     * @remarks Numerical values between `UPDATE_PRIORITY` levels are valid but must be cast `as PIXI.UPDATE_PRIORITY` due
     * to the `Brand`ed enum.
     */
    priority?: PIXI.UPDATE_PRIORITY | undefined;

    /**
     * An easing function used to translate animation time or the string name of a static member of the {@linkcode CanvasAnimation} class
     * @defaultValue {@linkcode TokenRing.createSpikeEasing | TokenRing.createSpikeEasing(0.15)}
     * @remarks If photosensitive mode is active, the default changes to {@linkcode TokenRing.easePingPong}.
     */
    easing?: CanvasAnimation.EasingFunction | undefined;
  }

  interface TextureData {
    UVs: Float32Array;
    center: { x: number; y: number };
  }

  /**
   * @remarks {@linkcode TokenRing.configureSize | TokenRing#configureSize} effectively calls `Object.assign(this, RingData)`
   */
  interface RingData {
    /** The filename of the ring asset, if available */
    ringName: string | undefined;

    /** The filename of the background asset, if available */
    bkgName: string | undefined;

    /** The filename of the mask asset, if available */
    maskName: string | undefined;

    /** Defines color stops for the ring gradient, if applicable */
    colorBand: ColorBand | undefined;

    /**
     * @remarks This property comes from the spritesheet JSON and is included with the frame entries in the `##ringData`
     * private array, but is stripped out of the return of {@linkcode TokenRing.getRingDataBySize}, and thus never gets
     * assigned as a property to the `TokenRing` instance in {@linkcode TokenRing.configureSize | TokenRing#configureSize}
     */
    gridTarget?: number;

    /** Default color for the ring in little-endian BBGGRR format, or null if not set */
    defaultRingColorLittleEndian: number | null;

    /** Default color for the background in little-endian BBGGRR format, or null if not set */
    defaultBackgroundColorLittleEndian: number | null;

    /** Scaling factor to adjust how the subject texture fits within the ring, or null if unavailable */
    subjectScaleAdjustment: number | null;
  }

  /** The start and end radii of the token ring color band. */
  interface ColorBand {
    /**
     * The starting normalized radius of the token ring color band.
     * @defaultValue `0.59`
     * @remarks Default only applies if spritesheet frame omits `colorBand` entirely
     */
    startRadius: number;

    /**
     * The ending normalized radius of the token ring color band.
     * @defaultValue `0.7225`
     * @remarks Default only applies if spritesheet frame omits `colorBand` entirely
     */
    endRadius: number;
  }

  type EFFECTS = Brand<number, "TokenRing.effects">;

  interface Effects {
    DISABLED: 0x00 & EFFECTS;

    ENABLED: 0x01 & EFFECTS;

    RING_PULSE: 0x02 & EFFECTS;

    RING_GRADIENT: 0x04 & EFFECTS;

    BKG_WAVE: 0x08 & EFFECTS;

    /** @remarks Foundry comments "Or spectral pulse effect" */
    INVISIBILITY: 0x10 & EFFECTS;

    COLOR_OVER_SUBJECT: 0x20 & EFFECTS;
  }

  /** @deprecated Replaced by {@linkcode TokenRing.ImplementationClass}. This type will be removed in v14. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode TokenRing.Implementation}. This type will be removed in v14. */
  type ConfiguredInstance = Implementation;
}

declare abstract class AnyTokenRing extends TokenRing {
  constructor(...args: never);
}

export default TokenRing;

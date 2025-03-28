import type { Brand, FixedInstanceType, InitializedOn } from "fvtt-types/utils";
import type DynamicRingData from "./ring-data.d.mts";

/**
 * Dynamic Token Ring Manager.
 */
declare class TokenRing {
  /** A `TokenRing` is constructed by providing a reference to a `Token` object. */
  constructor(token: Token.Object);

  /** The effects which could be applied to a token ring (using bitwise operations) */
  static effects: TokenRing.Effects;

  /**
   * Is the token rings framework enabled? Will be `null` if the system hasn't initialized yet.
   * @remarks {@link TokenRing.initialize | `CONFIG.Token.ring.ringClass.initialize`} is called inside {@link Canvas.initialize | `Canvas.initialize`}, which is called between the `setup` and `ready` hooks.
   */
  static get initialized(): InitializedOn<true, "ready", null>;

  /**
   * Token Rings sprite sheet base texture.
   * @remarks Only `undefined` prior to first canvas draw; set in {@link createAssetsUVs | `createAssetsUVs`}
   */
  static baseTexture: PIXI.BaseTexture | undefined;

  /**
   * Rings and background textures UVs and center offset.
   * @remarks Only `undefined` prior to first canvas draw; set in {@link createAssetsUVs | `createAssetsUVs`}
   */
  static texturesData: Record<string, TokenRing.TextureData> | undefined;

  /**
   * The token ring shader class definition.
   * @remarks Set in {@link TokenRing.initialize | `initialize`}
   */
  static tokenRingSamplerShader: InitializedOn<DynamicRingData["framework"]["shaderClass"], "ready", undefined>;

  /** Initialize the Token Rings system, registering the batch plugin and patching `PrimaryCanvasGroup#addToken`. */
  static initialize(): void;

  /** Create texture UVs for each asset into the token rings sprite sheet. */
  static createAssetsUVs(): void;

  /**
   * Get the UVs array for a given texture name and scale correction.
   * @param name              - Name of the texture we want to get UVs.
   * @param scaleCorrection   - The scale correction applied to UVs. (default: `1`)
   */
  // scaleCorrection: not null (parameter default only, casting to 0 produces nonsense)
  static getTextureUVs(name: string, scaleCorrection?: number): Float32Array;

  /**
   * Get ring and background names for a given size.
   * @param size  - The size to match (grid size dimension)
   * @remarks `size` is in units of grid _spaces_, the core rings provide spritesheet frames for `0.5`, `1`, `2`, `3`, and `4`,
   * and the value core passes in its only call is `Math.min(this.token.document.width ?? 1, this.token.document.height ?? 1)`.
   * Values between provided sizes will use the closest available size provided.
   */
  static getRingDataBySize(size: number): TokenRing.RingData;

  /**
   * @remarks Not initialized to a value, this gets set in {@link TokenRing.configureSize | TokenRing.configureSize`}.
   * After initialization (`ready`), this will only be `undefined` if the current spritesheet provides no frames
   */
  ringName: TokenRing.RingData["ringName"];

  /**
   * @remarks Not initialized to a value, this gets set in {@link TokenRing.configureSize | `TokenRing.configureSize`}.
   * After initialization (`ready`), this will only be `undefined` if the current spritesheet provides no frames
   */
  bkgName: TokenRing.RingData["bkgName"];

  ringUVs: InitializedOn<Float32Array, "ready", undefined>;

  bkgUVs: InitializedOn<Float32Array, "ready", undefined>;

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
   * @remarks Cannot be `undefined` as core explicitly checks for `null`.
   */
  defaultRingColorLittleEndian: TokenRing.RingData["defaultRingColorLittleEndian"];

  /**
   * @defaultValue `null`
   * @remarks Cannot be `undefined` as core explicitly checks for `null`.
   */
  defaultBackgroundColorLittleEndian: TokenRing.RingData["defaultBackgroundColorLittleEndian"];

  /**
   * @defaultValue `0`
   * @remarks A bitmask of {@link TokenRing.Effects | `effects`}
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
   * @remarks Not initialized to a value, this gets set in {@link TokenRing.configureSize | `configureSize`}.
   * After initialization (`ready`), this will only be `undefined` if the current spritesheet provides no frames
   */
  colorBand: TokenRing.RingData["colorBand"];

  /**
   * Reference to the token that should be animated
   * @remarks This getter is the return of calling {@link WeakRef.deref | `deref`} on the stored {@link WeakRef | `WeakRef`}
   * of the Token passed at construction; If the Token has been garbage collected, will return undefined.
   */
  get token(): Token.Object | undefined;

  /**
   * Configure the sprite mesh.
   * @param mesh  - The mesh to which TokenRing functionality is configured.
   */
  configure(mesh: PrimarySpriteMesh): void;

  /** Clear configuration pertaining to token ring from the mesh. */
  clear(): void;

  /** Configure token ring size. */
  configureSize(): void;

  /** Configure the token ring visuals properties. */
  configureVisuals(): void;

  /**
   * Flash the ring briefly with a certain color.
   * @param color            - Color to flash.
   * @param animationOptions - Options to customize the animation. (default: `{}`)
   * @remarks Only returns `Promise<void>` if `color` is `NaN`ish
   */
  flashColor(Color: Color, animationOptions: TokenRing.FlashColorOptions | null): Promise<boolean | void>;

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
   * To avoid breaking dnd5e.
   * @deprecated since v12
   * @remarks No deprecation warning or end of deprecation period provided, method body completely empty
   */
  configureMesh(): void;

  /**
   * To avoid breaking dnd5e.
   * @deprecated since v12
   * @remarks No deprecation warning or end of deprecation period provided, method body completely empty
   */
  configureNames(): void;
}

declare namespace TokenRing {
  interface Any extends AnyTokenRing {}
  type AnyConstructor = typeof AnyTokenRing;

  type ConfiguredClass = CONFIG["Token"]["ring"]["ringClass"];
  type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;

  /** @remarks Overrides for default values */
  interface FlashColorOptions extends CanvasAnimation.AnimateOptions {
    /**
     * @defaultValue `1600`
     * @remarks Can't be `null` because it only has a parameter default, and is used as a divisor in `CanvasAnimation.#animateFrame`
     */
    duration?: number;

    /** @defaultValue `PIXI.UPDATE_PRIORITY.HIGH` */
    priority?: PIXI.UPDATE_PRIORITY | null | undefined;

    /** @defaultValue `TokenRing.createSpikeEasing(0.15)` */
    easing?: CanvasAnimation.EasingFunction | null | undefined;
  }

  interface TextureData {
    UVs: Float32Array;
    center: { x: number; y: number };
  }

  /**
   * @remarks {@link TokenRing.configureSize | `configureSize`} effectively calls `Object.assign(this, RingData)`
   */
  interface RingData {
    ringName: string | undefined;

    bkgName: string | undefined;

    colorBand: ColorBand | undefined;

    /**
     * @remarks This property comes from the spritesheet JSON and is included with the frame entries in the `##ringData`
     * private array, but is stripped out of the return of {@link TokenRing.getRingDataBySize | `getRingDataBySize`},
     * and thus never gets assigned as a property to the `TokenRing` instance in {@link TokenRing.configureSize | `configureSize`}
     */
    gridTarget?: number;

    defaultRingColorLittleEndian: number | null;

    defaultBackgroundColorLittleEndian: number | null;

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
    readonly DISABLED: 0x00 & EFFECTS;

    readonly ENABLED: 0x01 & EFFECTS;

    readonly RING_PULSE: 0x02 & EFFECTS;

    readonly RING_GRADIENT: 0x04 & EFFECTS;

    readonly BKG_WAVE: 0x08 & EFFECTS;

    /** @remarks Foundry comments "or spectral pulse effect" */
    readonly INVISIBILITY: 0x10 & EFFECTS;
  }
}

declare abstract class AnyTokenRing extends TokenRing {
  constructor(...args: never);
}

export default TokenRing;

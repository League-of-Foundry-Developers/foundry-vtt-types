import type { MaybeInitialized } from "../../../client/game.d.mts";

/**
 * Dynamic Token Ring Manager.
 */
declare class TokenRing {
  #TokenRing: true;

  /** A `TokenRing` is constructed by providing a reference to a `Token` object. */
  constructor(token: Token.Object);

  /** The effects which could be applied to a token ring (using bitwise operations) */
  static effects: TokenRing.Effects;

  /** Is the token rings framework enabled? Will be `null` if the system hasn't initialized yet. */
  static get initialized(): MaybeInitialized<boolean, "init">;

  /** Token Rings sprite sheet base texture. */
  static baseTexture: PIXI.BaseTexture;

  /** Rings and background textures UVs and center offset. */
  static texturesData: Record<string, { UVs: Float32Array; center: { x: number; y: number } }>;

  /** The token ring shader class definition. */
  static tokenRingSamplerShader: TokenRing.SampleShaderClass;

  /** Initialize the Token Rings system, registering the batch plugin and patching `PrimaryCanvasGroup#addToken`. */
  static initialize(): void;

  /** Create texture UVs for each asset into the token rings sprite sheet. */
  static createAssetsUVs(): void;

  /**
   * Get the UVs array for a given texture name and scale correction.
   * @param name              - Name of the texture we want to get UVs.
   * @param scaleCorrection   - The scale correction applied to UVs. @defaultValue `1`
   * @remarks scaleCorrection accepts undefined due to default value,
   * but scaleCorrection is not checked against null in function body.
   */
  static getTextureUVs(name: string, scaleCorrection?: number): Float32Array;

  /**
   * Get ring and background names for a given size.
   * @param size  - The size to match (grid size dimension)
   */
  static getRingDataBySize(size: number): TokenRing.RingDataBySizeReturnType;

  ringName: string;

  bkgName: string;

  ringUVs: Float32Array;

  bkgUVs: Float32Array;

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
   * Cannot be undefined as core explicitly checks for null.
   * @defaultValue `null`
   */
  defaultRingColorLittleEndian: number | null;

  /**
   * Cannot be undefined as core explicitly checks for null.
   * @defaultValue `null`
   */
  defaultBackgroundColorLittleEndian: number | null;

  /**
   * @defaultValue `0`
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
  subjectScaleAdjustment: number;

  /**
   * @defaultValue `1`
   */
  textureScaleAdjustment: number;

  colorBand: TokenRing.RingColorBand;

  /** Reference to the token that should be animated */
  get token(): MaybeInitialized<Token.Object, "init">;

  /**
   * Configure the sprite mesh.
   * @param mesh  - The mesh to which TokenRing functionality is configured.
   */
  configure(mesh?: PrimarySpriteMesh): void;

  /** Clear configuration pertaining to token ring from the mesh. */
  clear(): void;

  /** Configure token ring size. */
  configureSize(): void;

  /** Configure the token ring visuals properties. */
  configureVisuals(): void;

  /**
   * Flash the ring briefly with a certain color.
   * @param color            - Color to flash.
   * @param animationOptions - Options to customize the animation. @defaultValue `{}`
   */
  flashColor(Color: Color, animationOptions: CanvasAnimation.AnimateOptions): Promise<boolean | void>;

  /**
   * Create an easing function that spikes in the center. Ideal duration is around 1600ms.
   * @param spikePct  - Position on [0,1] where the spike occurs. @defaultValue `0.5`
   */
  static createSpikeEasing(spikePct?: number): (t: number) => number;

  /**
   * Easing function that produces two peaks before returning to the original value. Ideal duration is around 500ms.
   * @param pt  - The proportional animation timing on [0,1].
   * @returns   - The eased animation progress on [0,1].
   */
  static easeTwoPeaks(pt: number): number;

  /**
   * To avoid breaking dnd5e.
   * @deprecated since v12
   */
  configureMesh(): void;

  /**
   * To avoid breaking dnd5e.
   * @deprecated since v12
   */
  configureNames(): void;
}

declare namespace TokenRing {
  type SampleShaderClass = CONFIG["Token"]["ring"]["shaderClass"];

  interface RingDataBySizeReturnType {
    bkgName: string;
    ringName: string;
    colorBand: TokenRing.RingColorBand;
  }

  /** The start and end radii of the token ring color band. */
  interface RingColorBand {
    /** The starting normalized radius of the token ring color band. */
    startRadius: number;

    /** The ending normalized radius of the token ring color band. */
    endRadius: number;
  }

  interface Effects
    extends Readonly<{
      DISABLED: 0x00;
      ENABLED: 0x01;
      RING_PULSE: 0x02;
      RING_GRADIENT: 0x04;
      BKG_WAVE: 0x08;
      INVISIBILITY: 0x10; // or spectral pulse effect
    }> {}
}

export default TokenRing;

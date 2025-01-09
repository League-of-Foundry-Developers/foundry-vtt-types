import type DynamicRingData from "./ring-data.d.mts";
import type TokenRing from "./ring.d.mts";

/**
 * Token Ring configuration Singleton Class.
 *
 * @example Add a new custom ring configuration. Allow only ring pulse, ring gradient and background wave effects.
 * ```js
 * const customConfig = new foundry.canvas.tokens.DynamicRingData({
 *   id: "myCustomRingId",
 *   label: "Custom Ring",
 *   effects: {
 *     RING_PULSE: "TOKEN.RING.EFFECTS.RING_PULSE",
 *     RING_GRADIENT: "TOKEN.RING.EFFECTS.RING_GRADIENT",
 *     BACKGROUND_WAVE: "TOKEN.RING.EFFECTS.BACKGROUND_WAVE"
 *   },
 *   spritesheet: "canvas/tokens/myCustomRings.json",
 *   framework: {
 *     shaderClass: MyCustomTokenRingSamplerShader,
 *     ringClass: TokenRing
 *   }
 * });
 * CONFIG.Token.ring.addConfig(customConfig.id, customConfig);
 * ```
 *
 * @example Get a specific ring configuration
 * ```js
 * const config = CONFIG.Token.ring.getConfig("myCustomRingId");
 * console.log(config.spritesheet); // Output: canvas/tokens/myCustomRings.json
 * ```
 *
 * @example Use a specific ring configuration
 * ```js
 * const success = CONFIG.Token.ring.useConfig("myCustomRingId");
 * console.log(success); // Output: true
 * ```
 *
 * @example Get the labels of all configurations
 * ```js
 * const configLabels = CONFIG.Token.ring.configLabels;
 * console.log(configLabels);
 * // Output:
 * // {
 * //   "coreSteel": "Foundry VTT Steel Ring",
 * //   "coreBronze": "Foundry VTT Bronze Ring",
 * //   "myCustomRingId" : "My Super Power Ring"
 * // }
 * ```
 *
 * @example Get the IDs of all configurations
 * ```js
 * const configIDs = CONFIG.Token.ring.configIDs;
 * console.log(configIDs); // Output: ["coreSteel", "coreBronze", "myCustomRingId"]
 * ```
 *
 * @example Create a hook to add a custom token ring configuration. This ring configuration will appear in the settings.
 * ```js
 * Hooks.on("initializeDynamicTokenRingConfig", ringConfig => {
 *   const mySuperPowerRings = new foundry.canvas.tokens.DynamicRingData({
 *     id: "myCustomRingId",
 *     label: "My Super Power Rings",
 *     effects: {
 *       RING_PULSE: "TOKEN.RING.EFFECTS.RING_PULSE",
 *       RING_GRADIENT: "TOKEN.RING.EFFECTS.RING_GRADIENT",
 *       BACKGROUND_WAVE: "TOKEN.RING.EFFECTS.BACKGROUND_WAVE"
 *     },
 *     spritesheet: "canvas/tokens/mySuperPowerRings.json"
 *   });
 *   ringConfig.addConfig("mySuperPowerRings", mySuperPowerRings);
 * });
 * ```
 *
 * @example Activate color bands debugging visuals to ease configuration
 * ```js
 * CONFIG.Token.ring.debugColorBands = true;
 * ```
 */
declare class TokenRingConfig {
  #TokenRingConfig: true;

  constructor();

  /**
   * Core token rings used in Foundry VTT.
   * Each key is a string identifier for a ring, and the value is an object containing the ring's data.
   * This object is frozen to prevent any modifications.
   */
  static CORE_TOKEN_RINGS: TokenRingConfig.CoreTokenRings;

  /**
   * Core token rings fit modes used in Foundry VTT.
   */
  static CORE_TOKEN_RINGS_FIT_MODES: TokenRingConfig.CoreTokenRingsFitModes;

  /** Register the token ring config and initialize it */
  static initialize(): void;

  /** Register game settings used by the Token Ring */
  static registerSettings(): void;

  /** A mapping of token subject paths where modules or systems have configured subject images. */
  subjectPaths: Record<string, string>;

  /**
   * All color bands visual debug flag.
   * @defaultValue `false`
   */
  debugColorBands: boolean;

  /**
   * Get the current ring class.
   */
  get ringClass(): typeof TokenRing;
  set ringClass(value: typeof TokenRing);

  /** Get the current effects. */
  get effects(): Record<string, string>;

  /** Get the current spritesheet. */
  get spritesheet(): string;

  /** Get the current shader class. */
  get shaderClass(): typeof PrimaryBaseSamplerShader;
  set shaderClass(value: typeof PrimaryBaseSamplerShader);

  /** Get the current localized label */
  get label(): string;

  /** Get the current id. */
  get id(): string;

  /** Is a custom fit mode active? */
  get isGridFitMode(): boolean;

  /**
   * Add a new ring configuration.
   * @param id      - The id of the ring configuration.
   * @param config  - The configuration object for the ring.
   */
  addConfig(id: string, config: TokenRingConfig): void;

  /**
   * Get a ring configuration.
   * @param id  - The id of the ring configuration.
   * @returns   - The ring configuration object.
   */
  getConfig(id: string): TokenRingConfig;

  /**
   * Use a ring configuration.
   * @param id  - The id of the ring configuration to use.
   * @returns   - True if the configuration was successfully set, false otherwise.
   */
  useConfig(id: string): boolean;

  /** Get the IDs of all configurations. */
  get configIDs(): string[];

  /** Get the labels of all configurations. */
  get configLabels(): Record<string, string>;

  /** @deprecated since v11 */
  get configNames(): string[];
}

declare namespace TokenRingConfig {
  /** The start and end radii of the token ring color band. */
  interface RingColorBand {
    /** The starting normalized radius of the token ring color band. */
    startRadius: number;

    /** The ending normalized radius of the token ring color band. */
    endRadius: number;
  }

  /** Token ring fit modes for dynamic token ring visualization */
  interface RingFitMode {
    /** The fit mode identifier. */
    id: string;

    /** The fit mode label. */
    label: string;
  }

  /**
   * Core token rings used in Foundry VTT.
   * Each key is a string identifier for a ring, and the value is an object containing the ring's data.
   * This object is frozen to prevent any modifications.
   */
  interface CoreTokenRings extends Readonly<Record<string, DynamicRingData.RingData>> {}

  /** Core token rings fit modes used in Foundry VTT. */
  interface CoreTokenRingsFitModes extends Readonly<Record<string, RingFitMode>> {}
}

export default TokenRingConfig;

import type { InitializedOn } from "../../../../utils/index.d.mts";
import type DynamicRingData from "./ring-data.d.mts";

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
  constructor();

  /**
   * Core token rings used in Foundry VTT.
   * Each key is a string identifier for a ring, and the value is an object containing the ring's data.
   * This object is frozen to prevent any modifications.
   * @remarks The outer object is frozen, but the individual rings' data isn't, and that object gets passed into a {@link DynamicRingData | `DynamicRingData`} constructor, leading to, for example,
   * ```js
   * CONFIG.Token.ring.getConfig("coreSteel")._source === TokenRingConfig.CORE_TOKEN_RINGS.coreSteel
   * ```
   * after {@link TokenRingConfig.initialize | `initialize`} has been called, which happens between the `setup` and `ready` hooks
   */
  static CORE_TOKEN_RINGS: TokenRingConfig.CoreTokenRings;

  /**
   * Core token rings fit modes used in Foundry VTT.
   */
  static CORE_TOKEN_RINGS_FIT_MODES: TokenRingConfig.CoreTokenRingsFitModes;

  /**
   * Register the token ring config and initialize it
   * @remarks Calls the {@link Hooks.StaticCallbacks.initializeDynamicTokenRingConfig | `initializeDynamicTokenRingConfig`} hook via {@link Hooks.callAll | `Hooks.callAll`}
   */
  static initialize(): void;

  /** Register game settings used by the Token Ring */
  static registerSettings(): void;

  /**
   * A mapping of token subject paths where modules or systems have configured subject images.
   * @defaultValue `{}`
   * @remarks Not directly used anywhere in this class, essentially just a global cache. The system's `flags.tokenRingSubjectMappings`, if any, get assigned here in {@link Game.initializeConfig | `Game#initializeConfig`},
   * and they're read in {@link TokenDocument._inferRingSubjectTexture | `TokenDocument#_inferRingSubjectTexture`}
   */
  subjectPaths: Record<string, string>;

  /**
   * All color bands visual debug flag.
   * @defaultValue `false`
   */
  debugColorBands: boolean;

  /**
   * Get the current ring class.
   * @remarks Since `##currentConfig` is a reference to a `##configs` entry, not a copy, setting this will persist in that config
   */
  get ringClass(): DynamicRingData["framework"]["ringClass"];
  set ringClass(value);

  /** Get the current effects. */
  get effects(): DynamicRingData["effects"];

  /** Get the current spritesheet. */
  get spritesheet(): DynamicRingData["spritesheet"];

  /**
   * Get the current shader class.
   * @remarks Since `##currentConfig` is a reference to a `##configs` entry, not a copy, setting this will persist in that config
   */
  get shaderClass(): DynamicRingData["framework"]["shaderClass"];
  set shaderClass(value);

  /** Get the current localized label */
  get label(): DynamicRingData["label"];

  /** Get the current id. */
  get id(): DynamicRingData["id"];

  /**
   * Is a custom fit mode active?
   * @remarks Anything other than `subject` is "custom", but the only other fit mode is `grid`
   */
  get isGridFitMode(): boolean;

  /**
   * Add a new ring configuration.
   * @param id      - The id of the ring configuration.
   * @param config  - The configuration object for the ring.
   * @throws If called outside a callback for the {@link Hooks.StaticCallbacks.initializeDynamicTokenRingConfig | `initializeDynamicTokenRingConfig`} hook
   * @remarks The actual error thrown incorrectly refers to a non-existent `registerDynamicTokenRing` hook
   */
  addConfig(id: string, config: DynamicRingData): void;

  /**
   * Get a ring configuration.
   * @param id  - The id of the ring configuration.
   * @returns   - The ring configuration object.
   */
  getConfig(id: string): DynamicRingData;

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

  /**
   * @deprecated since v12, until v14
   * @remarks "TokenRingConfig#configNames is deprecated and replaced by TokenRingConfig#configIDs"
   *
   * Foundry comment claims deprecated since v11 - possibly a dnd5e-implementation-related deprecation?
   */
  get configNames(): string[];
}

declare namespace TokenRingConfig {
  interface Any extends AnyTokenRingConfig {}
  type AnyConstructor = typeof AnyTokenRingConfig;

  /** Token ring fit modes for dynamic token ring visualization */
  interface RingFitMode {
    /** The fit mode identifier. */
    id: string;

    /** The fit mode label. */
    label: string;
  }

  /**
   * Core token rings fit modes used in Foundry VTT.
   * @remarks Only the two provided core fit modes are checked against, by hardcoded IDs
   */
  interface CoreTokenRingsFitModes {
    readonly subject: RingFitMode;
    readonly grid: RingFitMode;
  }

  type CoreRingIDs = "coreSteel" | "coreBronze";

  /**
   * @remarks The type of any given {@link TokenRingConfig.CORE_TOKEN_RINGS | `TokenRingConfig.CORE_TOKEN_RINGS`} entry prior to
   * {@link TokenRingConfig.initialize | `initialize`} being called between the `setup` and `ready` hooks
   */
  type StoredCoreRingData = Required<Pick<InitializedCoreRingData, "id" | "label" | "spritesheet">>;

  type StoredCoreRings = Record<CoreRingIDs, StoredCoreRingData>;

  /**
   * @remarks Due to the way the core configs are initialized, {@link TokenRingConfig.CORE_TOKEN_RINGS | `TokenRingConfig.CORE_TOKEN_RINGS`}
   * ends up becoming the `_source` of the constructed DataModels in {@link CONFIG.Token.ring | `CONFIG.Token.ring`}, that is:
   * ```js
   * CONFIG.Token.ring.getConfig("coreSteel")._source === TokenRingConfig.CORE_TOKEN_RINGS.coreSteel
   * ```
   * after {@link TokenRingConfig.initialize | `initialize`} has been called, which happens between the `setup` and `ready` hooks
   */
  type InitializedCoreRingData = foundry.data.fields.SchemaField.InnerPersistedType<DynamicRingData.Schema>;

  type InitializedCoreRings = Record<CoreRingIDs, InitializedCoreRingData>;

  /**
   * Core token rings used in Foundry VTT.
   * Each key is a string identifier for a ring, and the value is an object containing the ring's data.
   * This object is frozen to prevent any modifications.
   * @remarks The outer object is frozen, but the individual rings' data isn't, and that object gets passed into a {@link DynamicRingData | `DynamicRingData`} constructor, leading to, for example,
   * ```js
   * CONFIG.Token.ring.getConfig("coreSteel")._source === TokenRingConfig.CORE_TOKEN_RINGS.coreSteel
   * ```
   * after {@link TokenRingConfig.initialize | `initialize`} has been called, which happens between the `setup` and `ready` hooks
   */
  type CoreTokenRings = InitializedOn<InitializedCoreRings, "ready", StoredCoreRings>;
}

declare abstract class AnyTokenRingConfig extends TokenRingConfig {
  constructor(arg0: never, ...args: never[]);
}

export default TokenRingConfig;

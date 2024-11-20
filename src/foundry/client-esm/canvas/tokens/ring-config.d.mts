
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
declare class TokenRingConfig {}

declare namespace TokenRingConfig {}

export default TokenRingConfig;

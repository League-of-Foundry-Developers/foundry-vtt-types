import type {
  ConfiguredDocumentClassForName,
  ConfiguredDocumentInstanceForName,
} from "../../../../types/helperTypes.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";

declare global {
  namespace ActiveEffect {
    type ConfiguredClass = ConfiguredDocumentClassForName<"ActiveEffect">;
    type ConfiguredInstance = ConfiguredDocumentInstanceForName<"ActiveEffect">;
  }

  /**
   * The client-side ActiveEffect document which extends the common BaseActiveEffect model.
   * Each ActiveEffect belongs to the effects collection of its parent Document.
   * Each ActiveEffect contains a ActiveEffectData object which provides its source data.
   *
   * @see {@link ActiveEffectData}               The ActiveEffect data schema
   * @see {@link Actor}                     The Actor document which contains ActiveEffect embedded documents
   * @see {@link Item}                      The Item document which contains ActiveEffect embedded documents
   */
  class ActiveEffect extends ClientDocumentMixin(foundry.documents.BaseActiveEffect) {
    /**
     * Is there some system logic that makes this active effect ineligible for application?
     * @defaultValue `false`
     */
    get isSuppressed(): boolean;

    /**
     * Provide forward-compatibility with other Document types which use img as their primary image or icon.
     * We are likely to formally migrate this in the future, but for now this getter provides compatible read access.
     */
    get img(): this["icon"];

    /**
     * Retrieve the Document that this ActiveEffect targets for modification.
     */
    // TODO: Consider if `target` should be made more generic for other's purposes
    get target(): Actor | null;

    /**
     * Whether the Active Effect currently applying its changes to the target.
     */
    get active(): boolean;

    /**
     *  Does this Active Effect currently modify an Actor?
     */
    get modifiesActor(): boolean;

    prepareBaseData(): void;

    prepareDerivedData(): void;

    /**
     * Update derived Active Effect duration data.
     * Configure the remaining and label properties to be getters which lazily recompute only when necessary.
     */
    updateDuration(): ActiveEffectDuration;

    /**
     * Determine whether the ActiveEffect requires a duration update.
     * True if the worldTime has changed for an effect whose duration is tracked in seconds.
     * True if the combat turn has changed for an effect tracked in turns where the effect target is a combatant.
     */
    protected _requiresDurationUpdate(): boolean;

    protected _prepareDuration(): Omit<ActiveEffectDuration, keyof EffectDurationData>;

    /**
     * Format a round+turn combination as a decimal
     * @param round  - The round number
     * @param turn   - The turn number
     * @param nTurns - The maximum number of turns in the encounter
     * @returns The decimal representation
     */
    protected _getCombatTime(round: number, turn: number, nTurns?: number): number;

    /**
     * Format a number of rounds and turns into a human-readable duration label
     * @param rounds - The number of rounds
     * @param turns  - The number of turns
     * @returns The formatted label
     */
    protected _getDurationLabel(rounds: number, turns: number): string;

    /**
     * Describe whether the ActiveEffect has a temporary duration based on combat turns or rounds.
     */
    get isTemporary(): boolean;

    /**
     * The source name of the Active Effect. The source is retrieved synchronously.
     * Therefore "Unknown" (localized) is returned if the origin points to a document inside a compendium.
     * Returns "None" (localized) if it has no origin, and "Unknown" (localized) if the origin cannot be resolved.
     */
    get sourceName(): string;

    /**
     * Apply this ActiveEffect to a provided Actor.
     * TODO: This method is poorly conceived. Its functionality is static, applying a provided change to an Actor
     * TODO: When we revisit this in Active Effects V2 this should become an Actor method, or a static method
     * @param actor  - The Actor to whom this effect should be applied
     * @param change - The change data being applied
     * @returns The resulting applied value
     */
    apply(actor: Actor.ConfiguredInstance, change: EffectChangeData): unknown;

    /**
     * Cast a raw EffectChangeData change string to the desired data type.
     * @param raw - The raw string value
     * @param type - The target data type that the raw value should be cast to match
     * @returns The parsed delta cast to the target data type
     */
    protected _castDelta(raw: string, type: string): boolean | number | string | object;

    /**
     * Cast a raw EffectChangeData change string to an Array of an inner type.
     * @param raw  - The raw string value
     * @param type - The target data type of inner array elements
     * @returns The parsed delta cast as a typed array
     */
    protected _castArray(raw: string, type: string): Array<boolean | string | number | object>;

    /**
     * Parse serialized JSON, or retain the raw string.
     * @param raw - A raw serialized string
     * @returns The parsed value, or the original value if parsing failed
     */
    protected _parseOrString(raw: string): string | object;

    /**
     * Apply an ActiveEffect that uses an ADD application mode.
     * The way that effects are added depends on the data type of the current value.
     *
     * If the current value is null, the change value is assigned directly.
     * If the current type is a string, the change value is concatenated.
     * If the current type is a number, the change value is cast to numeric and added.
     * If the current type is an array, the change value is appended to the existing array if it matches in type.
     *
     * @param actor   - The Actor to whom this effect should be applied
     * @param change  - The change data being applied
     * @param current - The current value being modified
     * @param delta   - The parsed value of the change object
     * @param changes - An object which accumulates changes to be applied
     * @returns The resulting applied value
     */
    protected _applyAdd(
      actor: Actor.ConfiguredInstance,
      change: EffectChangeData,
      current: any,
      delta: any,
      changes: Record<string, any>,
    ): void;

    /**
     * Apply an ActiveEffect that uses a MULTIPLY application mode.
     * Changes which MULTIPLY must be numeric to allow for multiplication.
     * @param actor   - The Actor to whom this effect should be applied
     * @param change  - The change data being applied
     * @param current - The current value being modified
     * @param delta   - The parsed value of the change object
     * @param changes - An object which accumulates changes to be applied
     * @returns The resulting applied value
     */
    protected _applyMultiply(
      actor: Actor.ConfiguredInstance,
      change: EffectChangeData,
      current: any,
      delta: any,
      changes: Record<string, any>,
    ): void;

    /**
     * Apply an ActiveEffect that uses an OVERRIDE application mode.
     * Numeric data is overridden by numbers, while other data types are overridden by any value
     * @param actor   - The Actor to whom this effect should be applied
     * @param change  - The change data being applied
     * @param current - The current value being modified
     * @param delta   - The parsed value of the change object
     * @param changes - An object which accumulates changes to be applied
     * @returns The resulting applied value
     */
    protected _applyOverride(
      actor: Actor.ConfiguredInstance,
      change: EffectChangeData,
      current: any,
      delta: any,
      changes: Record<string, any>,
    ): void;

    /**
     * Apply an ActiveEffect that uses an UPGRADE, or DOWNGRADE application mode.
     * Changes which UPGRADE or DOWNGRADE must be numeric to allow for comparison.
     * @param actor   - The Actor to whom this effect should be applied
     * @param change  - The change data being applied
     * @param current - The current value being modified
     * @param delta   - The parsed value of the change object
     * @param changes - An object which accumulates changes to be applied
     * @returns The resulting applied value
     */
    protected _applyUpgrade(
      actor: Actor.ConfiguredInstance,
      change: EffectChangeData,
      current: any,
      delta: any,
      changes: Record<string, any>,
    ): void;

    /**
     * Apply an ActiveEffect that uses a CUSTOM application mode.
     * @param actor   - The Actor to whom this effect should be applied
     * @param change  - The change data being applied
     * @param current - The current value being modified
     * @param delta   - The parsed value of the change object
     * @param changes - An object which accumulates changes to be applied
     * @returns The resulting applied value
     */
    protected _applyCustom(
      actor: Actor.ConfiguredInstance,
      change: EffectChangeData,
      current: any,
      delta: any,
      changes: Record<string, any>,
    ): void;

    /**
     * Retrieve the initial duration configuration.
     */
    static getInitialDuration(): {
      duration: {
        startTime: number;
        startRound?: number;
        startTurn?: number;
      };
    };

    // TODO: This is a minor override and doing the extension is complicated
    // getFlag(scope: string, key: string): unknown;

    protected _preCreate(
      data: foundry.documents.BaseActiveEffect.ConstructorData,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser,
    ): Promise<void>;

    protected override _onCreate(data: this["_source"], options: DocumentModificationOptions, userId: string): void;

    protected override _onUpdate(
      data: foundry.documents.BaseActiveEffect.UpdateData,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Display changes to active effects as scrolling Token status text.
     * @param enabled - Is the active effect currently enabled?
     */
    protected _displayScrollingStatus(enabled: boolean): void;

    /**
     * Get the name of the source of the Active Effect
     * @deprecated since v11, will be removed in v13
     * @remarks `"You are accessing ActiveEffect._getSourceName which is deprecated."`
     */
    _getSourceName(): Promise<string>;
  }

  interface ActiveEffect {
    duration: ActiveEffectDuration;
  }

  interface ActiveEffectDuration extends EffectDurationData {
    /**
     * The duration type, either "seconds", "turns", or "none"
     */
    type: "seconds" | "turns" | "none";

    /**
     * The total effect duration, in seconds of world time or as a decimal
     * number with the format `{rounds}.{turns}`
     */
    duration: number | null;

    /**
     * The remaining effect duration, in seconds of world time or as a decimal
     * number with the format `{rounds}.{turns}`
     */
    remaining: number | null;

    label: string;

    /**
     * An internal flag used determine when to recompute seconds-based duration
     */
    _worldTime: number;

    /**
     * An internal flag used determine when to recompute turns-based duration
     */
    _combatTime: number;
  }
}

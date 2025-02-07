import type { AnyObject } from "fvtt-types/utils";
import type { DataModel } from "../../../common/abstract/data.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataField } from "../../../common/data/fields.d.mts";
import type { ActiveEffectData, EffectDurationData } from "../../../common/documents/_types.d.mts";
import type BaseActiveEffect from "../../../common/documents/active-effect.d.mts";

declare global {
  namespace ActiveEffect {
    type Metadata = Document.MetadataFor<ActiveEffect>;

    type ConfiguredClass = Document.ConfiguredClassForName<"ActiveEffect">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"ActiveEffect">;

    interface DatabaseOperations
      extends Document.Database.Operations<
        ActiveEffect,
        { animate: boolean },
        { animate: boolean },
        { animate: boolean }
      > {}

    // Helpful aliases
    type TypeNames = BaseActiveEffect.TypeNames;
    type ConstructorData = BaseActiveEffect.ConstructorData;
    type UpdateData = BaseActiveEffect.UpdateData;
    type Schema = BaseActiveEffect.Schema;
    type Source = BaseActiveEffect.Source;

    // TODO(LukeAbby): Audit. This is used both as an assignment, constructor, and initialized type.
    // It's likely this isn't really supposed to be used in fvtt-types.
    interface EffectChangeData {
      /**
       * The attribute path in the Actor or Item data which the change modifies
       * @defaultValue `""`
       */
      key: string;

      /**
       * The value of the change effect
       * @defaultValue `""`
       */
      value: string;

      /**
       * The modification mode with which the change is applied
       * @defaultValue `CONST.ACTIVE_EFFECT_MODES.ADD`
       */
      mode: number | null;

      /**
       * The priority level with which this change is applied
       * @defaultValue `null`
       */
      priority: number | null;
    }
  }

  /**
   * The client-side ActiveEffect document which extends the common BaseActiveEffect model.
   * Each ActiveEffect belongs to the effects collection of its parent Document.
   * Each ActiveEffect contains a ActiveEffectData object which provides its source data.
   *
   * @see {@link ActiveEffectData}          The ActiveEffect data schema
   * @see {@link Actor}                     The Actor document which contains ActiveEffect embedded documents
   * @see {@link Item}                      The Item document which contains ActiveEffect embedded documents
   */
  class ActiveEffect extends ClientDocumentMixin(foundry.documents.BaseActiveEffect) {
    static override metadata: ActiveEffect.Metadata;

    static get implementation(): ActiveEffect.ConfiguredClass;

    /**
     * Create an ActiveEffect instance from some status effect ID.
     * Delegates to {@link ActiveEffect._fromStatusEffect} to create the ActiveEffect instance
     * after creating the ActiveEffect data from the status effect data if `CONFIG.statusEffects`.
     * @param statusId - The status effect ID.
     * @param options  - Additional options to pass to the ActiveEffect constructor.
     * @returns The created ActiveEffect instance.
     *
     * @throws An error if there is no status effect in `CONFIG.statusEffects` with the given status ID and if
     * the status has implicit statuses but doesn't have a static _id.
     */
    static fromStatusEffect(
      statusId: string,
      options?: Document.ConstructionContext<Document.Any | null>,
    ): Promise<ActiveEffect.ConfiguredInstance>;

    /**
     * Create an ActiveEffect instance from status effect data.
     * Called by {@link ActiveEffect.fromStatusEffect}.
     * @param statusId   - The status effect ID.
     * @param effectData - The status effect data.
     * @param options    - Additional options to pass to the ActiveEffect constructor.
     * @returns The created ActiveEffect instance.
     */
    protected static _fromStatusEffect(
      statusId: string,
      effectData: ActiveEffectData,
      options?: Document.ConstructionContext<Document.Any | null>,
    ): Promise<ActiveEffect.ConfiguredInstance>;

    /**
     * Is there some system logic that makes this active effect ineligible for application?
     * @defaultValue `false`
     */
    get isSuppressed(): boolean;

    /**
     * Retrieve the Document that this ActiveEffect targets for modification.
     */
    get target(): Document.Any | null;

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
     * Apply ActiveEffect.EffectChangeData to a field within a DataModel.
     * @param model  - The model instance.
     * @param change - The change to apply.
     * @param field  - The field. If not supplied, it will be retrieved from the supplied model.
     * @returns The updated value.
     */
    static applyField(model: DataModel.Any, change: ActiveEffect.EffectChangeData, field?: DataField.Any): unknown;

    /**
     * Apply this ActiveEffect to a provided Actor.
     * TODO: This method is poorly conceived. Its functionality is static, applying a provided change to an Actor
     * TODO: When we revisit this in Active Effects V2 this should become an Actor method, or a static method
     * @param actor  - The Actor to whom this effect should be applied
     * @param change - The change data being applied
     * @returns The resulting applied value
     */
    apply(actor: Actor.ConfiguredInstance, change: ActiveEffect.EffectChangeData): unknown;

    /**
     * Apply this ActiveEffect to a provided Actor using a heuristic to infer the value types based on the current value
     * and/or the default value in the template.json.
     * @param actor   - The Actor to whom this effect should be applied.
     * @param change  - The change data being applied.
     * @param changes - The aggregate update paths and their updated values.
     */
    protected _applyLegacy(actor: Actor.ConfiguredInstance, change: EffectDurationData, changes: AnyObject): void;

    /**
     * Cast a raw ActiveEffect.EffectChangeData change string to the desired data type.
     * @param raw - The raw string value
     * @param type - The target data type that the raw value should be cast to match
     * @returns The parsed delta cast to the target data type
     */
    protected _castDelta(raw: string, type: string): boolean | number | string | object;

    /**
     * Cast a raw ActiveEffect.EffectChangeData change string to an Array of an inner type.
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
      change: ActiveEffect.EffectChangeData,
      current: any,
      delta: any,
      changes: AnyObject,
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
      change: ActiveEffect.EffectChangeData,
      current: any,
      delta: any,
      changes: AnyObject,
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
      change: ActiveEffect.EffectChangeData,
      current: any,
      delta: any,
      changes: AnyObject,
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
      change: ActiveEffect.EffectChangeData,
      current: any,
      delta: any,
      changes: AnyObject,
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
      change: ActiveEffect.EffectChangeData,
      current: any,
      delta: any,
      changes: AnyObject,
    ): void;

    /**
     * Retrieve the initial duration configuration.
     */
    static getInitialDuration(): {
      duration: {
        startTime: number;
        startRound?: number | undefined;
        startTurn?: number | undefined;
      };
    };

    // TODO: This is a minor override and doing the extension is complicated
    // getFlag(scope: string, key: string): unknown;

    /**
     * @privateRemarks _preCreate, _onCreate, _onUpdate, _preUpdate, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Display changes to active effects as scrolling Token status text.
     * @param enabled - Is the active effect currently enabled?
     */
    protected _displayScrollingStatus(enabled: boolean): void;

    /* -------------------------------------------- */
    /*  Deprecations and Compatibility              */
    /* -------------------------------------------- */

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

import { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type { ActiveEffectDataConstructorData } from "../../../common/data/data.mjs/activeEffectData";
import { EffectChangeData } from "../../../common/data/data.mjs/effectChangeData";

declare global {
  /**
   * The client-side ActiveEffect document which extends the common BaseActiveEffect model.
   * Each ActiveEffect belongs to the effects collection of its parent Document.
   * Each ActiveEffect contains a ActiveEffectData object which provides its source data.
   *
   * @see {@link documents.Actor} The Actor document which contains ActiveEffect embedded documents
   * @see {@link documents.Item} The Item document which contains ActiveEffect embedded documents
   */
  class ActiveEffect extends ClientDocumentMixin(foundry.documents.BaseActiveEffect) {
    /**
     * A cached reference to the source name to avoid recurring database lookups
     * @defaultValue `null`
     */
    protected _sourceName: string | null;

    /**
     * Does this ActiveEffect correspond to a significant status effect ID?
     * @defaultValue `null`
     */
    protected _statusId: string | null;

    /**
     * Is there some system logic that makes this active effect ineligible for application?
     */
    get isSuppressed(): boolean;

    /**
     * Does this Active Effect currently modify an Actor?
     */
    get modifiesActor(): boolean;

    prepareDerivedData(): void;

    /**
     * Prepare derived data related to active effect duration
     * @internal
     */
    protected _prepareDuration(): ActiveEffect.DurationSummary;

    /**
     * Format a round+turn combination as a decimal
     * @param round  - The round number
     * @param turn   - The turn number
     * @param nTurns - The maximum number of turns in the encounter
     * @returns The decimal representation
     */
    protected _getCombatTime(round: number, turn: number, nTurns?: number | undefined): number;

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
     * A cached property for obtaining the source name
     */
    get sourceName(): string;

    /**
     * Apply this ActiveEffect to a provided Actor.
     *
     * TODO: This method is poorly conceived. Its functionality is static, applying a provided change to an Actor
     *
     * TODO: When we revisit this in Active Effects V2 this should become an Actor method, or a static method
     * @param actor  - The Actor to whom this effect should be applied
     * @param change - The change data being applied
     * @returns The resulting applied value
     */
    apply(actor: ConfiguredActor, change: EffectChangeData): ConfiguredActor;

    /**
     * Cast a raw EffectChangeData change string to the desired data type.
     * @param raw  - The raw string value
     * @param type - The target data type that the raw value should be cast to match
     * @returns The parsed delta cast to the target data type
     */
    protected _castDelta(raw: string, type: "string"): string;
    protected _castDelta(raw: string, type: "boolean"): boolean;
    protected _castDelta(raw: string, type: "number"): number;
    protected _castDelta<T extends string>(
      raw: string,
      type: T
    ): T extends "string"
      ? string
      : T extends "boolean"
      ? boolean
      : T extends "number"
      ? number
      : ReturnType<typeof this._parseOrString>;

    /**
     * Cast a raw EffectChangeData change string to an Array of an inner type.
     * @param raw  - The raw string value
     * @param type - The target data type of inner array elements
     * @returns The parsed delta cast as a typed array
     */
    protected _castArray(raw: string, type: "string"): Array<string>;
    protected _castArray(raw: string, type: "boolean"): Array<boolean>;
    protected _castArray(raw: string, type: "number"): Array<number>;
    protected _castArray<T extends string>(raw: string, type: T): Array<ReturnType<typeof this._castDelta<T>>>;

    /**
     * Parse serialized JSON, or retain the raw string.
     * @param raw - A raw serialized string
     * @returns The parsed value, or the original value if parsing failed
     */
    protected _parseOrString(raw: string): unknown;

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
     */
    protected _applyAdd<
      ValueType,
      Key extends string,
      ChangeObject extends object & { [P in Key]?: ValueType | undefined }
    >(
      actor: ConfiguredActor,
      change: EffectChangeData & { key: Key },
      current: ValueType | null,
      delta: ValueType,
      changes: ChangeObject
    ): void;

    /**
     * Apply an ActiveEffect that uses a MULTIPLY application mode.
     * Changes which MULTIPLY must be numeric to allow for multiplication.
     * @param actor   - The Actor to whom this effect should be applied
     * @param change  - The change data being applied
     * @param current - The current value being modified
     * @param delta   - The parsed value of the change object
     * @param changes - An object which accumulates changes to be applied
     */
    protected _applyMultiply<
      ValueType,
      Key extends string,
      ChangeObject extends object & { [P in Key]?: ValueType | undefined }
    >(
      actor: ConfiguredActor,
      change: EffectChangeData & { key: Key },
      current: ValueType | null,
      delta: ValueType,
      changes: ChangeObject
    ): void;

    /**
     * Apply an ActiveEffect that uses an OVERRIDE application mode.
     * Numeric data is overridden by numbers, while other data types are overridden by any value
     * @param actor   - The Actor to whom this effect should be applied
     * @param change  - The change data being applied
     * @param current - The current value being modified
     * @param delta   - The parsed value of the change object
     * @param changes - An object which accumulates changes to be applied
     */
    protected _applyOverride<
      ValueType,
      Key extends string,
      ChangeObject extends object & { [P in Key]?: ValueType | undefined }
    >(
      actor: ConfiguredActor,
      change: EffectChangeData & { key: Key },
      current: ValueType | null,
      delta: ValueType,
      changes: ChangeObject
    ): void;

    /**
     * Apply an ActiveEffect that uses an UPGRADE, or DOWNGRADE application mode.
     * Changes which UPGRADE or DOWNGRADE must be numeric to allow for comparison.
     * @param actor   - The Actor to whom this effect should be applied
     * @param change  - The change data being applied
     * @param current - The current value being modified
     * @param delta   - The parsed value of the change object
     * @param changes - An object which accumulates changes to be applied
     */
    protected _applyUpgrade<
      ValueType,
      Key extends string,
      ChangeObject extends object & { [P in Key]?: ValueType | undefined }
    >(
      actor: ConfiguredActor,
      change: EffectChangeData & { key: Key },
      current: ValueType | null,
      delta: ValueType,
      changes: ChangeObject
    ): void;

    /**
     * Apply an ActiveEffect that uses a CUSTOM application mode.
     * @param actor   - The Actor to whom this effect should be applied
     * @param change  - The change data being applied
     * @param current - The current value being modified
     * @param delta   - The parsed value of the change object
     * @param changes - An object which accumulates changes to be applied
     */
    protected _applyCustom<
      ValueType,
      Key extends string,
      ChangeObject extends object & { [P in Key]?: ValueType | undefined }
    >(
      actor: ConfiguredActor,
      change: EffectChangeData & { key: Key },
      current: ValueType | null,
      delta: ValueType,
      changes: ChangeObject
    ): void;

    /**
     * Get the name of the source of the Active Effect
     */
    protected _getSourceName(): Promise<string>;

    protected _preCreate(
      data: ActiveEffectDataConstructorData,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    protected override _onCreate(
      data: foundry.data.ActiveEffectData["_source"],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onUpdate(
      data: DeepPartial<foundry.data.ActiveEffectData["_source"]>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Display changes to active effects as scrolling Token status text.
     * @param enabled - Is the active effect currently enabled?
     * @internal
     */
    protected _displayScrollingStatus(enabled: boolean): void;
  }

  namespace ActiveEffect {
    interface DurationSummary {
      type: "seconds" | "turns" | "none";
      duration: number | null;
      remaining: number | null;
      label: string;
    }
  }
}

type ConfiguredActor = InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>;

export {};

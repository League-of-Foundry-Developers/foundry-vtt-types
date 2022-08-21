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
   * @see {@link data.ActiveEffectData}               The ActiveEffect data schema
   * @see {@link documents.Actor}                     The Actor document which contains ActiveEffect embedded documents
   * @see {@link documents.Item}                      The Item document which contains ActiveEffect embedded documents
   */
  class ActiveEffect extends ClientDocumentMixin(foundry.documents.BaseActiveEffect) {
    /**
     * @param data   - Initial data provided to construct the ActiveEffect document
     * @param parent - The parent document to which this ActiveEffect belongs
     */
    constructor(...args: ConstructorParameters<typeof foundry.documents.BaseActiveEffect>);

    /**
     * A cached reference to the source name to avoid recurring database lookups
     * @defaultValue `null`
     */
    protected _sourceName: string | null;

    /**
     * A cached reference to the ActiveEffectConfig instance which configures this effect
     */
    protected _sheet: FormApplication | null; // TODO: Actually an ActiveEffectConfig according to foundry but this is a problem with ClientDocumentMixins _sheet, this should actually be inferred from the CONFIG

    /**
     * Is there some system logic that makes this active effect ineligible for application?
     */
    get isSuppressed(): boolean;

    /**
     * Summarize the active effect duration
     */
    get duration(): DurationSummary;

    /**
     * Format a round+turn combination as a decimal
     * @param round  - The round number
     * @param turn   - The turn number
     * @param nTurns - The maximum number of turns in the encounter
     * @returns The decimal representation
     */
    protected _getCombatTime(round: number, turn: number, nTurns: number): number;

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
     * @param actor  - The Actor to whom this effect should be applied
     * @param change - The change data being applied
     * @returns The resulting applied value
     */
    apply(actor: ConfiguredActor, change: EffectChangeData): unknown;

    /**
     * Apply an ActiveEffect that uses an ADD application mode.
     * The way that effects are added depends on the data type of the current value.
     *
     * If the current value is null, the change value is assigned directly.
     * If the current type is a string, the change value is concatenated.
     * If the current type is a number, the change value is cast to numeric and added.
     * If the current type is an array, the change value is appended to the existing array if it matches in type.
     *
     * @param actor  - The Actor to whom this effect should be applied
     * @param change - The change data being applied
     * @returns The resulting applied value
     */
    protected _applyAdd(actor: ConfiguredActor, change: EffectChangeData): unknown;

    /**
     * Apply an ActiveEffect that uses a MULTIPLY application mode.
     * Changes which MULTIPLY must be numeric to allow for multiplication.
     * @param actor  - The Actor to whom this effect should be applied
     * @param change - The change data being applied
     * @returns The resulting applied value
     */
    protected _applyMultiply(actor: ConfiguredActor, change: EffectChangeData): unknown;

    /**
     * Apply an ActiveEffect that uses an OVERRIDE application mode.
     * Numeric data is overridden by numbers, while other data types are overridden by any value
     * @param actor  - The Actor to whom this effect should be applied
     * @param change - The change data being applied
     * @returns The resulting applied value
     */
    protected _applyOverride(actor: ConfiguredActor, change: EffectChangeData): unknown;

    /**
     * Apply an ActiveEffect that uses an UPGRADE, or DOWNGRADE application mode.
     * Changes which UPGRADE or DOWNGRADE must be numeric to allow for comparison.
     * @param actor  - The Actor to whom this effect should be applied
     * @param change - The change data being applied
     * @returns The resulting applied value
     */
    protected _applyUpgrade(actor: ConfiguredActor, change: EffectChangeData): unknown;

    /**
     * Apply an ActiveEffect that uses a CUSTOM application mode.
     * Changes which UPGRADE or DOWNGRADE must be numeric to allow for comparison.
     * @param actor  - The Actor to whom this effect should be applied
     * @param change - The change data being applied
     * @returns The resulting applied value
     */
    protected _applyCustom(actor: ConfiguredActor, change: EffectChangeData): unknown;

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
     * @internal
     */
    protected _displayScrollingStatus(enabled: boolean): void;
  }
}

interface DurationSummary {
  type: "seconds" | "turns" | "none";
  duration: number | null;
  remaining: number | null;
  label: string;
}

type ConfiguredActor = InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>>;

export {};

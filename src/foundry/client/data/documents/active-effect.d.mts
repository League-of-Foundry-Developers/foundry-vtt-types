import type { ConfiguredActiveEffect } from "../../../../configuration/index.d.mts";
import type { AnyObject, InterfaceToObject } from "../../../../utils/index.d.mts";
import type { DataModel } from "../../../common/abstract/data.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataField, DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type { ActiveEffectData } from "../../../common/documents/_types.d.mts";
import type BaseActiveEffect from "../../../common/documents/active-effect.d.mts";

declare global {
  namespace ActiveEffect {
    /**
     * The implementation of the ActiveEffect document instance configured through `CONFIG.ActiveEffect.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredActiveEffect | `configuration/ConfiguredActiveEffect`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"ActiveEffect">;

    /**
     * The implementation of the ActiveEffect document configured through `CONFIG.ActiveEffect.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"ActiveEffect">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"ActiveEffect"> {}

    type SubType = Game.Model.TypeNames<"ActiveEffect">;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"ActiveEffect">;
    type Known = ActiveEffect.OfType<ActiveEffect.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredActiveEffect<Type>, ActiveEffect<Type>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Actor.Implementation | Item.Implementation | null;

    /**
     * An instance of `ActiveEffect` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link ActiveEffect._source | `ActiveEffect._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link ActiveEffect.create | `ActiveEffect.create`}
     * and {@link ActiveEffect | `new ActiveEffect(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link ActiveEffect.name | `ActiveEffect#name`}.
     *
     * This is data transformed from {@link ActiveEffect.Source | `ActiveEffect.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link ActiveEffect.update | `ActiveEffect#update`}.
     * It is a distinct type from {@link ActiveEffect.CreateData | `DeepPartial<ActiveEffect.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link ActiveEffect | `ActiveEffect`}. This is the source of truth for how an ActiveEffect document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link ActiveEffect | `ActiveEffect`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The name of the ActiveEffect
       * @defaultValue `""`
       */
      name: fields.StringField<{ required: true; label: "EFFECT.Label" }>;

      /**
       * An image path used to depict the ActiveEffect as an icon
       * @defaultValue `null`
       */
      img: fields.FilePathField<{ categories: "IMAGE"[]; label: "EFFECT.Image" }>;

      type: fields.DocumentTypeField<typeof BaseActiveEffect, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

      system: fields.TypeDataField<typeof BaseActiveEffect>;

      /**
       * The array of EffectChangeData objects which the ActiveEffect applies
       * @defaultValue `[]`
       */
      changes: fields.ArrayField<
        fields.SchemaField<{
          /**
           * The attribute path in the Actor or Item data which the change modifies
           * @defaultValue `""`
           */
          key: fields.StringField<{ required: true; label: "EFFECT.ChangeKey" }>;

          /**
           * The value of the change effect
           * @defaultValue `""`
           */
          value: fields.StringField<{ required: true; label: "EFFECT.ChangeValue" }>;

          /**
           * The modification mode with which the change is applied
           * @defaultValue `CONST.ACTIVE_EFFECT_MODES.ADD`
           */
          mode: fields.NumberField<{
            integer: true;
            initial: typeof CONST.ACTIVE_EFFECT_MODES.ADD;
            label: "EFFECT.ChangeMode";
          }>;

          /**
           * The priority level with which this change is applied
           * @defaultValue `null`
           */
          priority: fields.NumberField;
        }>
      >;

      /**
       * Is this ActiveEffect currently disabled?
       * @defaultValue `false`
       */
      disabled: fields.BooleanField;

      /**
       * An ActiveEffect.DurationData object which describes the duration of the ActiveEffect
       * @defaultValue see properties
       */
      duration: fields.SchemaField<{
        /**
         * The world time when the active effect first started
         * @defaultValue `null`
         */
        startTime: fields.NumberField<{ initial: null; label: "EFFECT.StartTime" }>;

        /**
         * The maximum duration of the effect, in seconds
         * @defaultValue `null`
         */
        seconds: fields.NumberField<{ integer: true; min: 0; label: "EFFECT.DurationSecs" }>;

        /**
         * The _id of the CombatEncounter in which the effect first started
         * @defaultValue `null`
         */
        combat: fields.ForeignDocumentField<typeof foundry.documents.BaseCombat, { label: "EFFECT.Combat" }>;

        /**
         * The maximum duration of the effect, in combat rounds
         * @defaultValue `null`
         */
        rounds: fields.NumberField<{ integer: true; min: 0 }>;

        /**
         * The maximum duration of the effect, in combat turns
         * @defaultValue `null`
         */
        turns: fields.NumberField<{ integer: true; min: 0; label: "EFFECT.DurationTurns" }>;

        /**
         * The round of the CombatEncounter in which the effect first started
         * @defaultValue `null`
         */
        startRound: fields.NumberField<{ integer: true; min: 0 }>;

        /**
         * The turn of the CombatEncounter in which the effect first started
         * @defaultValue `null`
         */
        startTurn: fields.NumberField<{ integer: true; min: 0; label: "EFFECT.StartTurns" }>;
      }>;

      /**
       * The HTML text description for this ActiveEffect document.
       * @defaultValue `""`
       */
      description: fields.HTMLField<{ label: "EFFECT.Description"; textSearch: true }>;

      /**
       * A UUID reference to the document from which this ActiveEffect originated
       * @defaultValue `null`
       */
      origin: fields.StringField<{ nullable: true; blank: false; initial: null; label: "EFFECT.Origin" }>;

      /**
       * A color string which applies a tint to the ActiveEffect icon
       * @defaultValue `"#ffffff"`
       */
      tint: fields.ColorField<{ nullable: false; initial: "#ffffff"; label: "EFFECT.IconTint" }>;

      /**
       * Does this ActiveEffect automatically transfer from an Item to an Actor?
       * @defaultValue `false`
       */
      transfer: fields.BooleanField<{ initial: true; label: "EFFECT.Transfer" }>;

      /**
       * Special status IDs that pertain to this effect
       * @defaultValue `[]`
       */
      statuses: fields.SetField<fields.StringField<{ required: true; blank: false }>>;

      sort: fields.IntegerSortField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"ActiveEffect", InterfaceToObject<CoreFlags>>;

      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for ActiveEffects */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<ActiveEffect.Parent> {}
      /** Options passed along in Create operations for ActiveEffects */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          ActiveEffect.CreateData,
          ActiveEffect.Parent,
          Temporary
        > {
        animate?: boolean;
      }
      /** Options passed along in Delete operations for ActiveEffects */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<ActiveEffect.Parent> {
        animate?: boolean;
      }
      /** Options passed along in Update operations for ActiveEffects */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<ActiveEffect.UpdateData, ActiveEffect.Parent> {
        animate?: boolean;
      }

      /** Options for {@link ActiveEffect.createDocuments | `ActiveEffect.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link ActiveEffect._preCreateOperation | `ActiveEffect._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link ActiveEffect#_preCreate | `ActiveEffect#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link ActiveEffect#_onCreate | `ActiveEffect#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link ActiveEffect.updateDocuments | `ActiveEffect.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link ActiveEffect._preUpdateOperation | `ActiveEffect._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link ActiveEffect#_preUpdate | `ActiveEffect#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link ActiveEffect#_onUpdate | `ActiveEffect#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link ActiveEffect.deleteDocuments | `ActiveEffect.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link ActiveEffect._preDeleteOperation | `ActiveEffect._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link ActiveEffect#_preDelete | `ActiveEffect#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link ActiveEffect#_onDelete | `ActiveEffect#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    interface CoreFlags {
      core?: { overlay?: boolean };
    }

    interface DurationData {
      /** The world time when the active effect first started */
      startTime?: number | null | undefined;

      /** The maximum duration of the effect, in seconds */
      seconds?: number | null | undefined;

      /** The _id of the CombatEncounter in which the effect first started */
      combat?: string | null | undefined;

      /** The maximum duration of the effect, in combat rounds */
      rounds?: number | null | undefined;

      /** The maximum duration of the effect, in combat turns */
      turns?: number | null | undefined;

      /** The round of the CombatEncounter in which the effect first started */
      startRound?: number | null | undefined;

      /** The turn of the CombatEncounter in which the effect first started */
      startTurn?: number | null | undefined;
    }

    // Must be kept in sync with
    interface Duration extends DurationData {
      /** The duration type, either "seconds", "turns", or "none" */
      type: "seconds" | "turns" | "none";

      /** The total effect duration, in seconds of world time or as a decimal number with the format \{rounds\}.\{turns\} */
      duration: number;

      /** The remaining effect duration, in seconds of world time or as a decimal number with the format \{rounds\}.\{turns\} */
      remaining: number;

      /** A formatted string label that represents the remaining duration */
      label: string;

      /** An internal flag used determine when to recompute seconds-based duration */
      _worldTime?: number;

      /** An internal flag used determine when to recompute turns-based duration */
      _combatTime?: number;
    }

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

    /**
     * @deprecated - {@link ActiveEffect.DatabaseOperation}
     */
    interface DatabaseOperations
      extends Document.Database.Operations<
        ActiveEffect,
        { animate: boolean },
        { animate: boolean },
        { animate: boolean }
      > {}

    /**
     * @deprecated {@link ActiveEffect.Types | `ActiveEffect.SubType`}
     */
    type TypeNames = ActiveEffect.SubType;

    /**
     * @deprecated {@link ActiveEffect.CreateData | `ActiveEffect.CreateData`}
     */
    interface ConstructorData extends ActiveEffect.CreateData {}

    /**
     * @deprecated {@link ActiveEffect.implementation | `ActiveEffect.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link ActiveEffect.Implementation | `ActiveEffect.Implementation`}
     */
    type ConfiguredInstance = Implementation;
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
  class ActiveEffect<out SubType extends ActiveEffect.SubType = ActiveEffect.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseActiveEffect,
  )<SubType> {
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
    ): Promise<ActiveEffect.Implementation>;

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
    ): Promise<ActiveEffect.Implementation>;

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
    updateDuration(): ActiveEffect.Duration;

    /**
     * Determine whether the ActiveEffect requires a duration update.
     * True if the worldTime has changed for an effect whose duration is tracked in seconds.
     * True if the combat turn has changed for an effect tracked in turns where the effect target is a combatant.
     */
    protected _requiresDurationUpdate(): boolean;

    protected _prepareDuration(): Omit<ActiveEffect.Duration, keyof ActiveEffect.DurationData>;

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
     * Apply EffectChangeData to a field within a DataModel.
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
    apply(actor: Actor.Implementation, change: ActiveEffect.EffectChangeData): unknown;

    /**
     * Apply this ActiveEffect to a provided Actor using a heuristic to infer the value types based on the current value
     * and/or the default value in the template.json.
     * @param actor   - The Actor to whom this effect should be applied.
     * @param change  - The change data being applied.
     * @param changes - The aggregate update paths and their updated values.
     */
    protected _applyLegacy(actor: Actor.Implementation, change: ActiveEffect.DurationData, changes: AnyObject): void;

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
      actor: Actor.Implementation,
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
      actor: Actor.Implementation,
      change: ActiveEffect.EffectChangeData,
      current: unknown,
      delta: unknown,
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
      actor: Actor.Implementation,
      change: ActiveEffect.EffectChangeData,
      current: unknown,
      delta: unknown,
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
      actor: Actor.Implementation,
      change: ActiveEffect.EffectChangeData,
      current: unknown,
      delta: unknown,
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
      actor: Actor.Implementation,
      change: ActiveEffect.EffectChangeData,
      current: unknown,
      delta: unknown,
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

    /**
     * Get the name of the source of the Active Effect
     * @deprecated since v11, will be removed in v13
     * @remarks `"You are accessing ActiveEffect._getSourceName which is deprecated."`
     */
    _getSourceName(): Promise<string>;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(
      context?: Document.DefaultNameContext<ActiveEffect.SubType, ActiveEffect.Parent>,
    ): string;

    static override createDialog(
      data?: ActiveEffect.CreateData,
      context?: Document.CreateDialogContext<ActiveEffect.SubType, ActiveEffect.Parent>,
    ): Promise<ActiveEffect.Implementation | null | undefined>;

    static override fromDropData(
      data: Document.DropData<ActiveEffect.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<ActiveEffect.Implementation | undefined>;

    static override fromImport(
      source: ActiveEffect.Source,
      context?: Document.FromImportContext<ActiveEffect.Parent>,
    ): Promise<ActiveEffect.Implementation>;
  }

  /**
   * @deprecated {@link ActiveEffect.Duration | `ActiveEffect.Duration`}
   */
  type ActiveEffectDuration = ActiveEffect.Duration;
}

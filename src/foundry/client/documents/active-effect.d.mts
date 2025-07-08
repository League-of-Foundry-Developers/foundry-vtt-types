import type { ConfiguredActiveEffect } from "fvtt-types/configuration";
import type {
  AnyMutableObject,
  Identity,
  InexactPartial,
  IntentionalPartial,
  InterfaceToObject,
  Merge,
  RequiredProps,
} from "#utils";
import type { DataModel } from "#common/abstract/data.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataField, DataSchema } from "#common/data/fields.d.mts";
import type BaseActiveEffect from "#common/documents/active-effect.d.mts";

import fields = foundry.data.fields;

declare namespace ActiveEffect {
  /**
   * The document's name.
   */
  type Name = "ActiveEffect";

  /**
   * The context used to create an `ActiveEffect`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `ActiveEffect`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `ActiveEffect` document instance configured through `CONFIG.ActiveEffect.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredActiveEffect | `fvtt-types/configuration/ConfiguredActiveEffect`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `ActiveEffect` document configured through `CONFIG.ActiveEffect.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata
    extends Merge<
      Document.Metadata.Default,
      Readonly<{
        name: "ActiveEffect";
        collection: "effects";
        hasTypeData: true;
        label: string;
        labelPlural: string;
        schemaVersion: string;
        permissions: Metadata.Permissions;
      }>
    > {}

  namespace Metadata {
    interface Permissions {
      create: "OWNER";
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `ActiveEffect`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.ActiveEffect.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"ActiveEffect">;

  /**
   * `ConfiguredSubTypes` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"ActiveEffect">;

  /**
   * `Known` represents the types of `ActiveEffect` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubTypes} for more information.
   */
  type Known = ActiveEffect.OfType<ActiveEffect.ConfiguredSubTypes>;

  /**
   * `OfType` returns an instance of `ActiveEffect` with the corresponding type. This works with both the
   * builtin `ActiveEffect` class or a custom subclass if that is set up in
   * {@link ConfiguredActiveEffect | `fvtt-types/configuration/ConfiguredActiveEffect`}.
   */
  type OfType<Type extends SubType> = _OfType[Type];

  /** @internal */
  interface _OfType
    extends Identity<{
      [Type in SubType]: Type extends unknown
        ? ConfiguredActiveEffect<Type> extends { document: infer Document }
          ? Document
          : // eslint-disable-next-line @typescript-eslint/no-restricted-types
            ActiveEffect<Type>
        : never;
    }> {}

  /**
   * `SystemOfType` returns the system property for a specific `ActiveEffect` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<_SystemMap, Type>;

  /**
   * @internal
   */
  interface _ModelMap extends Document.Internal.ModelMap<Name> {}

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<Name> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Actor.Implementation | Item.Implementation | null;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all instances, or never if the document doesn't have any descendants.
   */
  type Descendant = never;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = never;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Actor" | "Item">;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = never;

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type CollectionClass = never;

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type Collection = never;

  /**
   * An instance of `ActiveEffect` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `ActiveEffect` that comes from the database.
   */
  type Stored<SubType extends ActiveEffect.SubType = ActiveEffect.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@link ActiveEffect._source | `ActiveEffect#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode ActiveEffect.create}
   * and {@link ActiveEffect | `new ActiveEffect(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link ActiveEffect.name | `ActiveEffect#name`}.
   *
   * This is data transformed from {@linkcode ActiveEffect.Source} and turned into more
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
   * The schema for {@linkcode ActiveEffect}. This is the source of truth for how an ActiveEffect document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode ActiveEffect}. For example
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
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * An image path used to depict the ActiveEffect as an icon
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"] }>;

    type: fields.DocumentTypeField<typeof BaseActiveEffect, { initial: typeof CONST.BASE_DOCUMENT_TYPE }>;

    system: fields.TypeDataField<typeof BaseActiveEffect>;

    /**
     * The array of EffectChangeData objects which the ActiveEffect applies
     * @defaultValue `[]`
     */
    changes: fields.ArrayField<fields.SchemaField<ChangeSchema>>;

    /**
     * Is this ActiveEffect currently disabled?
     * @defaultValue `false`
     */
    disabled: fields.BooleanField;

    /**
     * An ActiveEffect.DurationData object which describes the duration of the ActiveEffect
     */
    duration: fields.SchemaField<DurationSchema>;

    /**
     * The HTML text description for this ActiveEffect document.
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ textSearch: true }>;

    /**
     * A UUID reference to the document from which this ActiveEffect originated
     * @defaultValue `null`
     */
    origin: fields.StringField<{ nullable: true; blank: false; initial: null }>;

    /**
     * A color string which applies a tint to the ActiveEffect icon
     * @defaultValue `"#ffffff"`
     */
    tint: fields.ColorField<{ nullable: false; initial: "#ffffff" }>;

    /**
     * Does this ActiveEffect automatically transfer from an Item to an Actor?
     * @defaultValue `false`
     */
    transfer: fields.BooleanField<{ initial: true }>;

    /**
     * Special status IDs that pertain to this effect
     * @defaultValue `[]`
     */
    statuses: fields.SetField<fields.StringField<{ required: true; blank: false }>>;

    /**
     * The sort value
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name, InterfaceToObject<CoreFlags>>;

    _stats: fields.DocumentStatsField;
  }

  interface ChangeSchema extends DataSchema {
    /**
     * The attribute path in the Actor or Item data which the change modifies
     * @defaultValue `""`
     */
    key: fields.StringField<{ required: true }>;

    /**
     * The value of the change effect
     * @defaultValue `""`
     */
    value: fields.StringField<{ required: true }>;

    /**
     * The modification mode with which the change is applied
     * @defaultValue `CONST.ACTIVE_EFFECT_MODES.ADD`
     */
    mode: fields.NumberField<
      {
        required: true;
        nullable: false;
        integer: true;
        initial: typeof CONST.ACTIVE_EFFECT_MODES.ADD;
      },
      // Note(LukeAbby): This will always need an override since there's no validation.
      CONST.ACTIVE_EFFECT_MODES | null | undefined,
      CONST.ACTIVE_EFFECT_MODES,
      CONST.ACTIVE_EFFECT_MODES
    >;

    /**
     * The priority level with which this change is applied
     * @defaultValue `undefined`
     */
    priority: fields.NumberField;
  }

  interface DurationSchema extends DataSchema {
    /**
     * The world time when the active effect first started
     * @defaultValue `null`
     */
    startTime: fields.NumberField<{ initial: null }>;

    /**
     * The maximum duration of the effect, in seconds
     * @defaultValue `undefined`
     */
    seconds: fields.NumberField<{ integer: true; min: 0 }>;

    /**
     * The _id of the CombatEncounter in which the effect first started
     * @defaultValue `null`
     */
    combat: fields.ForeignDocumentField<typeof foundry.documents.BaseCombat>;

    /**
     * The maximum duration of the effect, in combat rounds
     * @defaultValue `undefined`
     */
    rounds: fields.NumberField<{ integer: true; min: 0 }>;

    /**
     * The maximum duration of the effect, in combat turns
     * @defaultValue `undefined`
     */
    turns: fields.NumberField<{ integer: true; min: 0 }>;

    /**
     * The round of the CombatEncounter in which the effect first started
     * @defaultValue `undefined`
     */
    startRound: fields.NumberField<{ integer: true; min: 0 }>;

    /**
     * The turn of the CombatEncounter in which the effect first started
     * @defaultValue `undefined`
     */
    startTurn: fields.NumberField<{ integer: true; min: 0 }>;
  }

  namespace Database {
    /** Options passed along in Get operations for ActiveEffects */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<ActiveEffect.Parent> {}

    /** Options passed along in Create operations for ActiveEffects */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<ActiveEffect.CreateData, ActiveEffect.Parent, Temporary> {
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

    /** Operation for {@linkcode ActiveEffect.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<ActiveEffect.Database.Create<Temporary>> {}

    /** Operation for {@linkcode ActiveEffect.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<ActiveEffect.Database.Update> {}

    /** Operation for {@linkcode ActiveEffect.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<ActiveEffect.Database.Delete> {}

    /** Operation for {@linkcode ActiveEffect.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<ActiveEffect.Database.Create<Temporary>> {}

    /** Operation for {@link ActiveEffect.update | `ActiveEffect#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode ActiveEffect.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link ActiveEffect._preCreate | `ActiveEffect#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link ActiveEffect._onCreate | `ActiveEffect#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode ActiveEffect._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<ActiveEffect.Database.Create> {}

    /** Operation for {@link ActiveEffect._onCreateOperation | `ActiveEffect#_onCreateOperation`} */
    interface OnCreateOperation extends ActiveEffect.Database.Create {}

    /** Options for {@link ActiveEffect._preUpdate | `ActiveEffect#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link ActiveEffect._onUpdate | `ActiveEffect#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode ActiveEffect._preUpdateOperation} */
    interface PreUpdateOperation extends ActiveEffect.Database.Update {}

    /** Operation for {@link ActiveEffect._onUpdateOperation | `ActiveEffect._preUpdateOperation`} */
    interface OnUpdateOperation extends ActiveEffect.Database.Update {}

    /** Options for {@link ActiveEffect._preDelete | `ActiveEffect#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link ActiveEffect._onDelete | `ActiveEffect#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link ActiveEffect._preDeleteOperation | `ActiveEffect#_preDeleteOperation`} */
    interface PreDeleteOperation extends ActiveEffect.Database.Delete {}

    /** Options for {@link ActiveEffect._onDeleteOperation | `ActiveEffect#_onDeleteOperation`} */
    interface OnDeleteOperation extends ActiveEffect.Database.Delete {}

    /** Context for {@linkcode ActiveEffect._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<ActiveEffect.Parent> {}

    /** Context for {@linkcode ActiveEffect._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<ActiveEffect.Parent> {}

    /** Context for {@linkcode ActiveEffect._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<ActiveEffect.Parent> {}

    /**
     * Options for {@link ActiveEffect._preCreateDescendantDocuments | `ActiveEffect#_preCreateDescendantDocuments`}
     * and {@link ActiveEffect._onCreateDescendantDocuments | `ActiveEffect#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<ActiveEffect.Database.Create> {}

    /**
     * Options for {@link ActiveEffect._preUpdateDescendantDocuments | `ActiveEffect#_preUpdateDescendantDocuments`}
     * and {@link ActiveEffect._onUpdateDescendantDocuments | `ActiveEffect#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<ActiveEffect.Database.Update> {}

    /**
     * Options for {@link ActiveEffect._preDeleteDescendantDocuments | `ActiveEffect#_preDeleteDescendantDocuments`}
     * and {@link ActiveEffect._onDeleteDescendantDocuments | `ActiveEffect#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<ActiveEffect.Database.Delete> {}

    /**
     * Create options for {@linkcode ActiveEffect.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * If `Temporary` is true then `ActiveEffect.Implementation`, otherwise `ActiveEffect.Stored`.
   */
  type TemporaryIf<Temporary extends boolean | undefined> = true extends Temporary
    ? ActiveEffect.Implementation
    : ActiveEffect.Stored;

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name>, CoreFlags {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  /**
   * The flags provided by Foundry itself for this document.
   */
  interface CoreFlags {
    core?: { overlay?: boolean };
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

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

  type DurationType = "seconds" | "turns" | "none";

  // Must be kept in sync with
  interface Duration extends DurationData {
    /** The duration type, either "seconds", "turns", or "none" */
    type: DurationType;

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

  interface PrepareDurationReturn extends RequiredProps<IntentionalPartial<Duration>, "type"> {}

  interface InitialDurationData {
    /** @defaultValue `game.time.worldTime` */
    startTime: number;

    /** @remarks Only exists `if (game.combat)` */
    startRound?: number;

    /** @remarks Only exists `if (game.combat)` */
    startTurn?: number;
  }

  interface GetInitialDurationReturn {
    duration: InitialDurationData;
  }

  interface ChangeData {
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

    // TODO (@LukeAbby): `undefined` is not valid. We can't pull directly from the schema because this interface is used inside of field methods.

    /**
     * The modification mode with which the change is applied
     * @defaultValue `CONST.ACTIVE_EFFECT_MODES.ADD`
     */
    mode: CONST.ACTIVE_EFFECT_MODES;

    /**
     * The priority level with which this change is applied
     * @defaultValue `null`
     */
    priority: number | null | undefined;
  }

  type ApplyFieldReturn<Field extends DataField.Any | null | undefined> = Field extends DataField.Any
    ? DataField.InitializedTypeFor<Field>
    : unknown;

  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side ActiveEffect document which extends the common BaseActiveEffect model.
 * Each ActiveEffect belongs to the effects collection of its parent Document.
 * Each ActiveEffect contains a ActiveEffectData object which provides its source data.
 *
 * @see {@linkcode ActiveEffectData}          The ActiveEffect data schema
 * @see {@linkcode Actor}                     The Actor document which contains ActiveEffect embedded documents
 * @see {@linkcode Item}                      The Item document which contains ActiveEffect embedded documents
 */
declare class ActiveEffect<out SubType extends ActiveEffect.SubType = ActiveEffect.SubType> extends BaseActiveEffect
  .Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `ActiveEffect`
   * @param context - Construction context options
   */
  constructor(data: ActiveEffect.CreateData, context?: ActiveEffect.ConstructionContext);

  /**
   * Create an ActiveEffect instance from some status effect ID.
   * Delegates to {@linkcode ActiveEffect._fromStatusEffect} to create the ActiveEffect instance
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
    options?: ActiveEffect.ConstructionContext,
  ): Promise<ActiveEffect.Implementation>;

  /**
   * Create an ActiveEffect instance from status effect data.
   * Called by {@linkcode ActiveEffect.fromStatusEffect}.
   * @param statusId   - The status effect ID.
   * @param effectData - The status effect data.
   * @param options    - Additional options to pass to the ActiveEffect constructor.
   * @returns The created ActiveEffect instance.
   *
   * @remarks Core's implementation doesn't use `statusId`, simply returning `new this(effectData, options)`
   */
  protected static _fromStatusEffect(
    statusId: string,
    effectData: ActiveEffect.CreateData,
    options?: ActiveEffect.ConstructionContext,
  ): Promise<ActiveEffect.Implementation>;

  /**
   * Is there some system logic that makes this active effect ineligible for application?
   * @remarks Core's implementation defers to `system.isSuppressed` on a `TypeDataModel`, else `false`. As such all overrides should begin with `if (super.isSuppressed) return true;`
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

  override prepareDerivedData(): void;

  /**
   * Update derived Active Effect duration data.
   * Configure the remaining and label properties to be getters which lazily recompute only when necessary.
   */
  // TODO: This adds two getter properties (`remaining` and `label`) to `this.duration` (a SchemaField property on the document)
  updateDuration(): ActiveEffect.Duration;

  /**
   * Determine whether the ActiveEffect requires a duration update.
   * True if the worldTime has changed for an effect whose duration is tracked in seconds.
   * True if the combat turn has changed for an effect tracked in turns where the effect target is a combatant.
   */
  protected _requiresDurationUpdate(): boolean;

  /** @internal */
  protected _prepareDuration(): ActiveEffect.PrepareDurationReturn;

  /**
   * Format a round+turn combination as a decimal
   * @param round  - The round number
   * @param turn   - The turn number
   * @param nTurns - The maximum number of turns in the encounter
   * @returns The decimal representation
   * @private
   */
  protected _getCombatTime(round: number, turn: number, nTurns?: number): number;

  /**
   * Format a number of rounds and turns into a human-readable duration label
   * @param rounds - The number of rounds
   * @param turns  - The number of turns
   * @returns The formatted label
   * @private
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
   *
   * @remarks `field` default provided by `??= model.schema.getField(change.key)`
   */
  static applyField<Field extends DataField.Any | null | undefined = undefined>(
    model: DataModel.Any,
    change: ActiveEffect.ChangeData,
    field?: Field,
  ): ActiveEffect.ApplyFieldReturn<Field>;

  /**
   * Apply this ActiveEffect to a provided Actor.
   * @param actor  - The Actor to whom this effect should be applied
   * @param change - The change data being applied
   * @returns An object of property paths and their updated values.
   * @remarks In the future this likely will become either an `Actor` method or a static one
   */
  apply(actor: Actor.Implementation, change: ActiveEffect.ChangeData): AnyMutableObject;

  /**
   * Apply this ActiveEffect to a provided Actor using a heuristic to infer the value types based on the current value
   * and/or the default value in the template.json.
   * @param actor   - The Actor to whom this effect should be applied.
   * @param change  - The change data being applied.
   * @param changes - The aggregate update paths and their updated values.
   */
  protected _applyLegacy(actor: Actor.Implementation, change: ActiveEffect.ChangeData, changes: AnyMutableObject): void;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected _castDelta(raw: never, type: never): never;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected _castArray(raw: never, type: never): never;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected _parseOrString(raw: never): never;

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
   * @remarks Core's implementation does not use `actor`
   */
  protected _applyAdd(
    actor: Actor.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
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
   * @remarks Core's implementation does not use `actor`
   */
  protected _applyMultiply(
    actor: Actor.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
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
   * @remarks Core's implementation does not use `actor` or `current`
   */
  protected _applyOverride(
    actor: Actor.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
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
   * @remarks Core's implementation does not use `actor`
   */
  protected _applyUpgrade(
    actor: Actor.Implementation,
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
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
    change: ActiveEffect.ChangeData,
    current: unknown,
    delta: unknown,
    changes: AnyMutableObject,
  ): void;

  /**
   * Retrieve the initial duration configuration.
   */
  static getInitialDuration(): ActiveEffect.GetInitialDurationReturn;

  // _preCreate, _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes from BaseActiveEffect.

  /**
   * Display changes to active effects as scrolling Token status text.
   * @param enabled - Is the active effect currently enabled?
   */
  protected _displayScrollingStatus(enabled: boolean): void;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  // ClientDocument overrides

  // Descendant Document operations have been left out because ActiveEffect does not have any descendant documents.

  /** @remarks `context` must contain a `pack` or `parent`. */
  static override defaultName(context: ActiveEffect.DefaultNameContext): string;

  /** @remarks `createOptions` must contain a `pack` or `parent`. */
  static override createDialog(
    data: ActiveEffect.CreateDialogData | undefined,
    createOptions: ActiveEffect.Database.DialogCreateOptions,
    options?: ActiveEffect.CreateDialogOptions,
  ): Promise<ActiveEffect.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: ActiveEffect.Database.DeleteOperation,
  ): Promise<this | false | null | undefined>;

  static override fromDropData(
    data: ActiveEffect.DropData,
    options?: ActiveEffect.DropDataOptions,
  ): Promise<ActiveEffect.Implementation | undefined>;

  static override fromImport(
    source: ActiveEffect.Source,
    context?: Document.FromImportContext<ActiveEffect.Parent> | null,
  ): Promise<ActiveEffect.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  #ActiveEffect: true;
}

export default ActiveEffect;

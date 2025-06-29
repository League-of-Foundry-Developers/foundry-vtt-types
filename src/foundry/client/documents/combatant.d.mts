import type { ConfiguredCombatant } from "fvtt-types/configuration";
import type { InexactPartial, Merge, RequiredProps } from "#utils";
import type { documents } from "#client/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseCombatant from "#common/documents/combatant.d.mts";

import fields = foundry.data.fields;

declare namespace Combatant {
  /**
   * The document's name.
   */
  type Name = "Combatant";

  /**
   * The context used to create a `Combatant`.
   * @privateRemarks This is off-template, as `Combatant` requires a valid parent to validate.
   */
  interface ConstructionContext extends RequiredProps<Document.ConstructionContext<Parent>, "parent"> {}

  /**
   * The documents embedded within `Combatant`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Combatant` document instance configured through `CONFIG.Combatant.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredCombatant | `fvtt-types/configuration/ConfiguredCombatant`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Combatant` document configured through `CONFIG.Combatant.documentClass` in Foundry and
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
        name: "Combatant";
        collection: "combatants";
        label: string;
        labelPlural: string;
        isEmbedded: true;
        hasTypeData: true;
        schemaVersion: string;
        permissions: Metadata.Permissions;
      }>
    > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create: "OWNER";
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `Combatant`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.Combatant.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"Combatant">;

  /**
   * `ConfiguredSubTypes` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"Combatant">;

  /**
   * `Known` represents the types of `Combatant` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubTypes} for more information.
   */
  type Known = Combatant.OfType<Combatant.ConfiguredSubTypes>;

  /**
   * `OfType` returns an instance of `Combatant` with the corresponding type. This works with both the
   * builtin `Combatant` class or a custom subclass if that is set up in
   * {@link ConfiguredCombatant | `fvtt-types/configuration/ConfiguredCombatant`}.
   */
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredCombatant<Type>, () => Combatant<Type>>;

  /**
   * `SystemOfType` returns the system property for a specific `Combatant` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<_SystemMap, Type>;

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<"Combatant"> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Combat.Implementation | null;

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
  type Pack = never;

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
   * An instance of `Combatant` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid extends Document.Internal.Invalid<Implementation> {}

  /**
   * An instance of `Combatant` that comes from the database.
   */
  type Stored<SubType extends Combatant.SubType = Combatant.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@link Combatant._source | `Combatant#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Combatant.create}
   * and {@link Combatant | `new Combatant(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link Combatant.name | `Combatant#name`}.
   *
   * This is data transformed from {@linkcode Combatant.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link Combatant.update | `Combatant#update`}.
   * It is a distinct type from {@link Combatant.CreateData | `DeepPartial<Combatant.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode Combatant}. This is the source of truth for how an Combatant document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Combatant}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Combatant embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** @defaultValue `"base"` */
    type: fields.DocumentTypeField<typeof BaseCombatant, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

    system: fields.TypeDataField<typeof BaseCombatant>;

    /**
     * The _id of an Actor associated with this Combatant
     * @defaultValue `null`
     */
    actorId: fields.ForeignDocumentField<typeof documents.BaseActor, { label: "COMBAT.CombatantActor"; idOnly: true }>;

    /**
     * The _id of a Token associated with this Combatant
     * @defaultValue `null`
     */
    tokenId: fields.ForeignDocumentField<typeof documents.BaseToken, { label: "COMBAT.CombatantToken"; idOnly: true }>;

    /**
     * @defaultValue `null`
     */
    sceneId: fields.ForeignDocumentField<typeof documents.BaseScene, { label: "COMBAT.CombatantScene"; idOnly: true }>;

    /**
     * A customized name which replaces the name of the Token in the tracker
     * @defaultValue `undefined`
     */
    name: fields.StringField<{ label: "COMBAT.CombatantName"; textSearch: true }>;

    /**
     * A customized image which replaces the Token image in the tracker
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"]; label: "COMBAT.CombatantImage" }>;

    /**
     * The initiative score for the Combatant which determines its turn order
     */
    initiative: fields.NumberField<{ required: true; label: "COMBAT.CombatantInitiative" }>;

    /**
     * Is this Combatant currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField<{ label: "COMBAT.CombatantHidden" }>;

    /**
     * Has this Combatant been defeated?
     * @defaultValue `false`
     */
    defeated: fields.BooleanField<{ label: "COMBAT.CombatantDefeated" }>;

    /**
     * An optional group this Combatant belongs to.
     * @defaultValue `null`
     */
    group: fields.DocumentIdField<{ readonly: false }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;

    _stats: fields.DocumentStatsField;
  }

  namespace Database {
    /** Options passed along in Get operations for Combatants */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Combatant.Parent> {}

    /** Options passed along in Create operations for Combatants */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Combatant.CreateData, Combatant.Parent, Temporary> {
      combatTurn?: number;
      turnEvents?: boolean;
    }

    /** Options passed along in Delete operations for Combatants */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Combatant.Parent> {
      combatTurn?: number;
      turnEvents?: boolean;
    }

    /** Options passed along in Update operations for Combatants */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Combatant.UpdateData, Combatant.Parent> {
      combatTurn?: number;
      turnEvents?: boolean;
    }

    /** Operation for {@linkcode Combatant.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Combatant.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Combatant.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Combatant.Database.Update> {}

    /** Operation for {@linkcode Combatant.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Combatant.Database.Delete> {}

    /** Operation for {@linkcode Combatant.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Combatant.Database.Create<Temporary>> {}

    /** Operation for {@link Combatant.update | `Combatant#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Combatant.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Combatant._preCreate | `Combatant#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Combatant._onCreate | `Combatant#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Combatant._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Combatant.Database.Create> {}

    /** Operation for {@link Combatant._onCreateOperation | `Combatant#_onCreateOperation`} */
    interface OnCreateOperation extends Combatant.Database.Create {}

    /** Options for {@link Combatant._preUpdate | `Combatant#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Combatant._onUpdate | `Combatant#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Combatant._preUpdateOperation} */
    interface PreUpdateOperation extends Combatant.Database.Update {}

    /** Operation for {@link Combatant._onUpdateOperation | `Combatant._preUpdateOperation`} */
    interface OnUpdateOperation extends Combatant.Database.Update {}

    /** Options for {@link Combatant._preDelete | `Combatant#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Combatant._onDelete | `Combatant#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Combatant._preDeleteOperation | `Combatant#_preDeleteOperation`} */
    interface PreDeleteOperation extends Combatant.Database.Delete {}

    /** Options for {@link Combatant._onDeleteOperation | `Combatant#_onDeleteOperation`} */
    interface OnDeleteOperation extends Combatant.Database.Delete {}

    /** Context for {@linkcode Combatant._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Combatant.Parent> {}

    /** Context for {@linkcode Combatant._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Combatant.Parent> {}

    /** Context for {@linkcode Combatant._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Combatant.Parent> {}

    /**
     * Options for {@link Combatant._preCreateDescendantDocuments | `Combatant#_preCreateDescendantDocuments`}
     * and {@link Combatant._onCreateDescendantDocuments | `Combatant#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Combatant.Database.Create> {}

    /**
     * Options for {@link Combatant._preUpdateDescendantDocuments | `Combatant#_preUpdateDescendantDocuments`}
     * and {@link Combatant._onUpdateDescendantDocuments | `Combatant#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Combatant.Database.Update> {}

    /**
     * Options for {@link Combatant._preDeleteDescendantDocuments | `Combatant#_preDeleteDescendantDocuments`}
     * and {@link Combatant._onDeleteDescendantDocuments | `Combatant#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Combatant.Database.Delete> {}
  }

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.ConfiguredFlagsForName<Name> {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  /**
   * @remarks
   * This is typed based on what is reasonable to expect, rather than accurately, as accurately would mean `unknown` (Foundry's type is `object|null`).
   *
   * Technically this is the value of an arbitrary property path in the Combatant's Actor's `system` (using `getProperty`), and while that path can usually be
   * assumed to have been set to something in the return of {@linkcode TokenDocument.getTrackedAttributes}, since that's what the {@linkcode CombatTrackerConfig}
   * provides as options, the path is stored in the {@linkcode Combat.CONFIG_SETTING} which could be updated to be anything. Also, `TokenDocument.getTrackedAttributes`
   * doesn't actually check what the type of `value` and `max` are for bar type attributes, so even sticking to those choices isn't guaranteed safe.
   *
   * There's clear intent that the value *should* be numeric or null, but nothing seems to do math on it in core, and it's simply output in the {@linkcode CombatEncounters}
   * template as `{{resource}}`, so `string` has been allowed.
   *
   * @privateRemarks Adding `boolean` is something that was discussed and decided against for now, but its plausible a system may request such in the future, and wouldn't
   * make us any more wrong than currently.
   */
  type Resource = string | number | null;

  interface DefaultNameContext extends Document.DefaultNameContext<Name, NonNullable<Parent>> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated - Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side Combatant document which extends the common BaseCombatant model.
 *
 * @see {@linkcode Combat}                    The Combat document which contains Combatant embedded documents
 * @see {@linkcode CombatantConfig}        The Combatant configuration application
 */
declare class Combatant<out SubType extends Combatant.SubType = Combatant.SubType> extends BaseCombatant.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Combatant`
   * @param context - Construction context options
   */
  // Note(LukeAbby): `data` is not actually required but `context.parent` is.
  constructor(data: Combatant.CreateData | undefined, context: Combatant.ConstructionContext);

  /**
   * The token video source image (if any)
   * @defaultValue `null`
   */
  _videoSrc: string | null;

  /** The current value of the special tracked resource which pertains to this Combatant */
  resource: Combatant.Resource | null;

  /**
   * A convenience alias of Combatant#parent which is more semantically intuitive
   */
  get combat(): Combat.Implementation | null;

  /** This is treated as a non-player combatant if it has no associated actor and no player users who can control it */
  get isNPC(): boolean;

  /**
   * Eschew `ClientDocument`'s redirection to `Combat#permission` in favor of special ownership determination.
   * @remarks Uses {@link BaseCombatant.getUserLevel | `BaseCombatant#getUserLevel`}, so can't return `null`
   */
  override get permission(): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  override get visible(): boolean;

  /** A reference to the Actor document which this Combatant represents, if any */
  get actor(): Actor.Implementation | null;

  /** A reference to the Token document which this Combatant represents, if any */
  get token(): TokenDocument.Implementation | null;

  /** An array of non-Gamemaster Users who have ownership of this Combatant. */
  get players(): User.Implementation[];

  /**
   * Has this combatant been marked as defeated?
   */
  get isDefeated(): boolean;

  /**
   * Get a Roll object which represents the initiative roll for this Combatant.
   * @param formula -  An explicit Roll formula to use for the combatant.
   * @returns The Roll instance to use for the combatant.
   */
  getInitiativeRoll(formula?: string): Roll.ConfiguredInstance;

  /**
   * Roll initiative for this particular combatant.
   * @param formula - A dice formula which overrides the default for this Combatant.
   * @returns The updated Combatant.
   */
  rollInitiative(formula?: string): Promise<this | undefined>;

  /**
   * @remarks Initializes `_videoSrc`, applies `img` and `name` fallbacks, and calls {@link Combatant.updateResource | `Combatant#updateResource`}
   */
  override prepareDerivedData(): void;

  /**
   * Update the value of the tracked resource for this Combatant.
   */
  updateResource(): Combatant.Resource;

  /**
   * Acquire the default dice formula which should be used to roll initiative for this combatant.
   * Modules or systems could choose to override or extend this to accommodate special situations.
   * @returns  The initiative formula to use for this combatant.
   */
  protected _getInitiativeFormula(): string;

  /**
   * Prepare derived data based on group membership.
   */
  protected _prepareGroup(): void;

  /**
   * Clear the movement history of the Combatant's Token.
   */
  clearMovementHistory: Promise<void>;

  // DatabaseLifecycle Events are overridden but with no signature changes.
  // These are already covered in BaseCombatant

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

  // Descendant Document operations have been left out because Combatant does not have any descendant documents.

  // context: not null (destructured)
  static override defaultName(context?: Combatant.DefaultNameContext): string;

  /** @remarks `context.parent` is required as creation requires one */
  static override createDialog(
    data: Combatant.CreateDialogData | undefined,
    createOptions?: Combatant.Database.CreateOptions,
    options?: Combatant.CreateDialogOptions,
  ): Promise<Combatant.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"Combatant">,
  ): Promise<this | false | null | undefined>;

  // options: not null (parameter default only)
  static override fromDropData(
    data: Combatant.DropData,
    options?: Combatant.DropDataOptions,
  ): Promise<Combatant.Implementation | undefined>;

  static override fromImport(
    source: Combatant.Source,
    context?: Document.FromImportContext<Combatant.Parent> | null,
  ): Promise<Combatant.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default Combatant;

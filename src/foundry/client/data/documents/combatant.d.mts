import type { ConfiguredCombatant } from "../../../../configuration/index.d.mts";
import type { Merge, ValueOf } from "fvtt-types/utils";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type BaseCombatant from "../../../common/documents/combatant.d.mts";

import fields = foundry.data.fields;

declare global {
  namespace Combatant {
    /**
     * The document's name.
     */
    type Name = "Combatant";

    /**
     * The arguments to construct the document.
     */
    type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

    /**
     * The documents embedded within `Combatant`.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the `Combatant` document instance configured through `CONFIG.Combatant.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredCombatant | `fvtt-types/configuration/ConfiguredCombatant`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the `Combatant` document configured through `CONFIG.Combatant.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
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
        create(user: User.Internal.Implementation, doc: Implementation): boolean;
        update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      }
    }

    /**
     * Allowed subtypes of `Combatant`. This is configured through various methods. Modern Foundry
     * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
     * under {@link CONFIG.Combatant.dataModels | `CONFIG.Combatant.dataModels`}. This corresponds to
     * fvtt-type's {@link DataModelConfig | `DataModelConfig`}.
     *
     * Subtypes can also be registered through a `template.json` though this is discouraged.
     * The corresponding fvtt-type configs are {@link SourceConfig | `SourceConfig`} and
     * {@link DataConfig | `DataConfig`}.
     */
    type SubType = Game.Model.TypeNames<"Combatant">;

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
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredCombatant<Type>, Combatant<Type>>;

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
     * An instance of `Combatant` that comes from the database but failed validation meaining that
     * its `system` and `_source` could theoretically be anything.
     */
    interface Invalid<out SubType extends Combatant.SubType = Combatant.SubType>
      extends Document.Invalid<OfType<SubType>> {}

    /**
     * An instance of `Combatant` that comes from the database.
     */
    interface Stored<out SubType extends Combatant.SubType = Combatant.SubType>
      extends Document.Stored<OfType<SubType>> {}

    /**
     * The data put in {@link Combatant._source | `Combatant#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated {@link Combatant.Source | `Combatant.Source`}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a document. Used in places like {@link Combatant.create | `Combatant.create`}
     * and {@link Combatant | `new Combatant(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link Combatant.name | `Combatant#name`}.
     *
     * This is data transformed from {@link Combatant.Source | `Combatant.Source`} and turned into more
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
     * The schema for {@link Combatant | `Combatant`}. This is the source of truth for how an Combatant document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Combatant | `Combatant`}. For example
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

      type: fields.DocumentTypeField<typeof BaseCombatant, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

      system: fields.TypeDataField<typeof BaseCombatant>;

      /**
       * The _id of an Actor associated with this Combatant
       * @defaultValue `null`
       */
      actorId: fields.ForeignDocumentField<
        typeof documents.BaseActor,
        { label: "COMBAT.CombatantActor"; idOnly: true }
      >;

      /**
       * The _id of a Token associated with this Combatant
       * @defaultValue `null`
       */
      tokenId: fields.ForeignDocumentField<
        typeof documents.BaseToken,
        { label: "COMBAT.CombatantToken"; idOnly: true }
      >;

      /**
       * @defaultValue `null`
       */
      sceneId: fields.ForeignDocumentField<
        typeof documents.BaseScene,
        { label: "COMBAT.CombatantScene"; idOnly: true }
      >;

      /**
       * A customized name which replaces the name of the Token in the tracker
       * @defaultValue `""`
       */
      name: fields.StringField<{ label: "COMBAT.CombatantName"; textSearch: true }>;

      /**
       * A customized image which replaces the Token image in the tracker
       * @defaultValue `null`
       */
      img: fields.FilePathField<{ categories: "IMAGE"[]; label: "COMBAT.CombatantImage" }>;

      /**
       * The initiative score for the Combatant which determines its turn order
       * @defaultValue `null`
       */
      initiative: fields.NumberField<{ label: "COMBAT.CombatantInitiative" }>;

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
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<Name>;

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

      /** Operation for {@link Combatant.createDocuments | `Combatant.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<Combatant.Database.Create<Temporary>> {}

      /** Operation for {@link Combatant.updateDocuments | `Combatant.updateDocuments`} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<Combatant.Database.Update> {}

      /** Operation for {@link Combatant.deleteDocuments | `Combatant.deleteDocuments`} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<Combatant.Database.Delete> {}

      /** Operation for {@link Combatant.create | `Combatant.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<Combatant.Database.Create<Temporary>> {}

      /** Operation for {@link Combatant.update | `Combatant#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link Combatant.get | `Combatant.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link Combatant._preCreate | `Combatant#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link Combatant._onCreate | `Combatant#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link Combatant._preCreateOperation | `Combatant._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Combatant.Database.Create> {}

      /** Operation for {@link Combatant._onCreateOperation | `Combatant#_onCreateOperation`} */
      interface OnCreateOperation extends Combatant.Database.Create {}

      /** Options for {@link Combatant._preUpdate | `Combatant#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link Combatant._onUpdate | `Combatant#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link Combatant._preUpdateOperation | `Combatant._preUpdateOperation`} */
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

      /** Context for {@link Combatant._onDeleteOperation | `Combatant._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<Combatant.Parent> {}

      /** Context for {@link Combatant._onCreateDocuments | `Combatant._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<Combatant.Parent> {}

      /** Context for {@link Combatant._onUpdateDocuments | `Combatant._onUpdateDocuments`} */
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

    /**
     * @deprecated {@link Combatant.Database | `Combatant.DatabaseOperation`}
     */
    interface DatabaseOperations
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      extends Document.Database.Operations<
        Combatant.Implementation,
        { combatTurn: number },
        { combatTurn: number },
        { combatTurn: number }
      > {}

    /**
     * @deprecated {@link Combatant.SubType | `Combatant.SubType`}
     */
    type TypeNames = Combatant.SubType;

    /**
     * @deprecated {@link Combatant.CreateData | `Combatant.CreateData`}
     */
    interface ConstructorData extends Combatant.CreateData {}

    /**
     * @deprecated {@link Combatant.implementation | `Combatant.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Combatant.Implementation | `Combatant.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Combatant document which extends the common BaseCombatant model.
   *
   * @see {@link Combat | `Combat`}                    The Combat document which contains Combatant embedded documents
   * @see {@link CombatantConfig | `CombatantConfig`}        The Combatant configuration application
   */
  class Combatant<out SubType extends Combatant.SubType = Combatant.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseCombatant,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `Combatant`
     * @param context - Construction context options
     */
    constructor(...args: Combatant.ConstructorArgs);

    /**
     * The token video source image (if any)
     */
    _videoSrc: string | null;

    /** The current value of the special tracked resource which pertains to this Combatant */
    resource: `${number}` | number | boolean | null;

    /**
     * A convenience alias of Combatant#parent which is more semantically intuitive
     */
    get combat(): Combat.Implementation | null;

    /** This is treated as a non-player combatant if it has no associated actor and no player users who can control it */
    get isNPC(): boolean;

    /**
     * Eschew `ClientDocument`'s redirection to `Combat#permission` in favor of special ownership determination.
     */
    override get permission(): ValueOf<typeof CONST.DOCUMENT_OWNERSHIP_LEVELS>;

    override get visible(): boolean;

    /** A reference to the Actor document which this Combatant represents, if any */
    get actor(): Actor.Implementation | null;

    /** A reference to the Token document which this Combatant represents, if any */
    get token(): TokenDocument.Implementation | null;

    /** An array of User documents who have ownership of this Document */
    get players(): User.Implementation[];

    /**
     * Has this combatant been marked as defeated?
     */
    get isDefeated(): boolean;

    override testUserPermission(
      user: User.Implementation,
      permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
      { exact }?: { exact?: boolean },
    ): boolean;

    /**
     * Get a Roll object which represents the initiative roll for this Combatant.
     * @param formula -  An explicit Roll formula to use for the combatant.
     * @returns The Roll instance to use for the combatant.
     */
    getInitiativeRoll(formula?: string): Roll;

    /**
     * Roll initiative for this particular combatant.
     * @param formula - A dice formula which overrides the default for this Combatant.
     * @returns The updated Combatant.
     */
    rollInitiative(formula: string): Promise<this | undefined>;

    override prepareDerivedData(): void;

    /**
     * Update the value of the tracked resource for this Combatant.
     */
    updateResource(): this["resource"];

    /**
     * Acquire the default dice formula which should be used to roll initiative for this combatant.
     * Modules or systems could choose to override or extend this to accommodate special situations.
     * @returns  The initiative formula to use for this combatant.
     */
    protected _getInitiativeFormula(): string;

    /**
     * @privateRemarks DatabaseLifecycle Events are overridden but with no signature changes.
     * These are already covered in BaseCombatant
     */

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

    static override defaultName(
      context: Document.DefaultNameContext<Combatant.SubType, NonNullable<Combatant.Parent>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<Combatant.CreateData>,
      context: Document.CreateDialogContext<Combatant.SubType, NonNullable<Combatant.Parent>>,
    ): Promise<Combatant.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<Combatant.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Combatant.Implementation | undefined>;

    static override fromImport(
      source: Combatant.Source,
      context?: Document.FromImportContext<Combatant.Parent>,
    ): Promise<Combatant.Implementation>;
  }
}

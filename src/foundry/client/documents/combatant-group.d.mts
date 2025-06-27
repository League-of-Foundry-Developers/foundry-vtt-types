import type { ConfiguredCombatantGroup } from "fvtt-types/configuration";
import type { InexactPartial, Merge } from "#utils";
import type Document from "#common/abstract/document.mjs";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseCombatantGroup from "#common/documents/combatant-group.d.mts";

import fields = foundry.data.fields;

declare namespace CombatantGroup {
  /**
   * The document's name.
   */
  type Name = "CombatantGroup";

  /**
   * The arguments to construct the document.
   */
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * The documents embedded within `CombatantGroup`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `CombatantGroup` document instance configured through `CONFIG.CombatantGroup.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredCombatantGroup | `fvtt-types/configuration/ConfiguredCombatantGroup`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `CombatantGroup` document configured through `CONFIG.Combat.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  interface Metadata
    extends Merge<
      Document.Metadata.Default,
      Readonly<{
        name: "CombatantGroup";
        collection: "groups";
        label: string;
        labelPlural: string;
        isEmbedded: true;
        hasTypeData: true;
        schemaVersion: string;
      }>
    > {}

  /**
   * Allowed subtypes of `CombatantGroup`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.CombatantGroup.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"CombatantGroup">;

  /**
   * `ConfiguredSubTypes` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"CombatantGroup">;

  /**
   * `Known` represents the types of `CombatantGroup` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubTypes} for more information.
   */
  type Known = CombatantGroup.OfType<CombatantGroup.ConfiguredSubTypes>;

  /**
   * `OfType` returns an instance of `CombatantGroup` with the corresponding type. This works with both the
   * builtin `CombatantGroup` class or a custom subclass if that is set up in
   * {@link ConfiguredCombatantGroup | `fvtt-types/configuration/ConfiguredCombatantGroup`}.
   */
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  type OfType<Type extends SubType> = Document.Internal.OfType<
    ConfiguredCombatantGroup<Type>,
    () => CombatantGroup<Type>
  >;

  /**
   * `SystemOfType` returns the system property for a specific `CombatantGroup` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<_SystemMap, Type>;

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<"CombatantGroup"> {}

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
   * An instance of `CombatantGroup` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid<out SubType extends CombatantGroup.SubType = CombatantGroup.SubType>
    extends Document.Internal.Invalid<OfType<SubType>> {}

  /**
   * An instance of `CombatantGroup` that comes from the database.
   */
  interface Stored<out SubType extends CombatantGroup.SubType = CombatantGroup.SubType>
    extends Document.Internal.Stored<OfType<SubType>> {}

  /**
   * The data put in {@link CombatantGroup._source | `CombatantGroup#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode CombatantGroup.create}
   * and {@link CombatantGroup | `new CombatantGroup(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link CombatantGroup.name | `CombatantGroup#name`}.
   *
   * This is data transformed from {@linkcode CombatantGroup.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link CombatantGroup.update | `CombatantGroup#update`}.
   * It is a distinct type from {@link CombatantGroup.CreateData | `DeepPartial<CombatantGroup.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode CombatantGroup}. This is the source of truth for how an CombatantGroup document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode CombatantGroup}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this CombatantGroup embedded document.
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The type of this CombatantGroup.
     * @defaultValue `"base"`
     */
    type: fields.DocumentTypeField<typeof BaseCombatantGroup, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

    /**
     * Game system data which is defined by system data models.
     */
    system: fields.TypeDataField<typeof BaseCombatantGroup>;

    /**
     * A customized name which replaces the inferred group name.
     * @defaultValue `undefined`
     */
    name: fields.StringField<{ textSearch: true }>;

    /**
     * A customized image which replaces the inferred group image.
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"] }>;

    /**
     * The initiative value that will be used for all group members.
     */
    initiative: fields.NumberField<{ required: true }>;

    /**
     * An object which configures ownership of this group.
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags.
     */
    // TODO: retype this to `DocumentFlagsField`
    flags: fields.ObjectField.FlagsField<Name>;

    /**
     * An object of creation and access information.
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database {
    /** Options passed along in Get operations for CombatantGroups */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<CombatantGroup.Parent> {}

    /** Options passed along in Create operations for CombatantGroups */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<
        CombatantGroup.CreateData,
        CombatantGroup.Parent,
        Temporary
      > {}

    /** Options passed along in Delete operations for CombatantGroups */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<CombatantGroup.Parent> {}

    /** Options passed along in Update operation for CombatantGroups */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<CombatantGroup.UpdateData, CombatantGroup.Parent> {}

    /** Operation for {@linkcode CombatantGroup.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<CombatantGroup.Database.Create<Temporary>> {}

    /** Operation for {@linkcode CombatantGroup.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<CombatantGroup.Database.Update> {}

    /** Operation for {@linkcode CombatantGroup.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<CombatantGroup.Database.Delete> {}

    /** Operation for {@linkcode CombatantGroup.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<CombatantGroup.Database.Create<Temporary>> {}

    /** Operation for {@link CombatantGroup.update | `CombatantGroup#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode CombatantGroup.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link CombatantGroup._preCreate | `CombatantGroup#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link CombatantGroup._onCreate | `CombatantGroup#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode CombatantGroup._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<CombatantGroup.Database.Create> {}

    /** Operation for {@link CombatantGroup._onCreateOperation | `CombatantGroup#_onCreateOperation`} */
    interface OnCreateOperation extends CombatantGroup.Database.Create {}

    /** Options for {@link CombatantGroup._preUpdate | `CombatantGroup#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link CombatantGroup._onUpdate | `CombatantGroup#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode CombatantGroup._preUpdateOperation} */
    interface PreUpdateOperation extends CombatantGroup.Database.Update {}

    /** Operation for {@link CombatantGroup._onUpdateOperation | `CombatantGroup._preUpdateOperation`} */
    interface OnUpdateOperation extends CombatantGroup.Database.Update {}

    /** Options for {@link CombatantGroup._preDelete | `CombatantGroup#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link CombatantGroup._onDelete | `CombatantGroup#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link CombatantGroup._preDeleteOperation | `CombatantGroup#_preDeleteOperation`} */
    interface PreDeleteOperation extends CombatantGroup.Database.Delete {}

    /** Options for {@link CombatantGroup._onDeleteOperation | `CombatantGroup#_onDeleteOperation`} */
    interface OnDeleteOperation extends CombatantGroup.Database.Delete {}

    /** Context for {@linkcode CombatantGroup._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<CombatantGroup.Parent> {}

    /** Context for {@linkcode CombatantGroup._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<CombatantGroup.Parent> {}

    /** Context for {@linkcode CombatantGroup._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<CombatantGroup.Parent> {}

    /**
     * Options for {@link CombatantGroup._preCreateDescendantDocuments | `CombatantGroup#_preCreateDescendantDocuments`}
     * and {@link CombatantGroup._onCreateDescendantDocuments | `CombatantGroup#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<CombatantGroup.Database.Create> {}

    /**
     * Options for {@link CombatantGroup._preUpdateDescendantDocuments | `CombatantGroup#_preUpdateDescendantDocuments`}
     * and {@link CombatantGroup._onUpdateDescendantDocuments | `CombatantGroup#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<CombatantGroup.Database.Update> {}

    /**
     * Options for {@link CombatantGroup._preDeleteDescendantDocuments | `CombatantGroup#_preDeleteDescendantDocuments`}
     * and {@link CombatantGroup._onDeleteDescendantDocuments | `CombatantGroup#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<CombatantGroup.Database.Delete> {}
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

  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}
}

/**
 * The client-side CombatantGroup document which extends the common BaseCombatantGroup model.
 *
 * @see {@link foundry.documents.Combat}: The Combat document which contains Combatant embedded documents
 */
declare class CombatantGroup<
  out SubType extends CombatantGroup.SubType = CombatantGroup.SubType,
> extends BaseCombatantGroup.Internal.ClientDocument<SubType> {
  /**
   * A group is considered defeated if all its members are defeated, or it has no members.
   */
  defeated: boolean;

  /**
   * A group is considered hidden if all its members are hidden, or it has no members.
   */
  hidden: boolean;

  /**
   * The Combatant members of this group.
   */
  members: Set<Combatant.Implementation>;

  override prepareBaseData(): void;

  /**
   * Clear the movement history of all Tokens within this Combatant Group.
   */
  clearMovementHistories(): Promise<void>;

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
  
   // Descendant Document operations have been left out because CombatantGroup does not have any descendant documents.
  
   // context: not null (destructured)
   static override defaultName(context?: CombatantGroup.DefaultNameContext): string;
  
   // data: not null (parameter default only), context: not null (destructured)
   static override createDialog(
    data?: CombatantGroup.CreateDialogData,
    createOptions?: CombatantGroup.Database.CreateOptions,
    options?: CombatantGroup.CreateDialogOptions,
   ): Promise<CombatantGroup.Stored | null | undefined>;

   override deleteDialog(
       options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
       operation?: Document.Database.DeleteOperationForName<"CombatantGroup">
     ): Promise<this | false | null | undefined>;
  
   // options: not null (parameter default only)
   static override fromDropData(
     data: CombatantGroup.DropData,
     options?: CombatantGroup.DropDataOptions,
   ): Promise<CombatantGroup.Implementation | undefined>;
  
   static override fromImport(
     source: CombatantGroup.Source,
     context?: Document.FromImportContext<CombatantGroup.Parent> | null,
   ): Promise<CombatantGroup.Implementation>;
  
   override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default CombatantGroup;

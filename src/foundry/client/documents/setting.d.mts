import type { Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";

import fields = foundry.data.fields;

declare namespace Setting {
  /**
   * The document's name.
   */
  type Name = "Setting";

  /**
   * The arguments to construct the document.
   */
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * The documents embedded within `Setting`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Setting` document instance configured through `CONFIG.Setting.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredSetting | `fvtt-types/configuration/ConfiguredSetting`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Setting` document configured through `CONFIG.Setting.documentClass` in Foundry and
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
        name: "Setting";
        collection: "settings";
        label: string;
        labelPlural: string;
        permissions: Metadata.Permissions;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      delete(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
    }
  }

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = null;

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
   * The world collection that contains `Setting`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.WorldSettings.ConfiguredClass;

  /**
   * The world collection that contains `Setting`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.WorldSettings.Configured;

  /**
   * An instance of `Setting` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid extends Document.Internal.Invalid<Setting.Implementation> {}

  /**
   * An instance of `Setting` that comes from the database.
   */
  interface Stored extends Document.Internal.Stored<Setting.Implementation> {}

  /**
   * The data put in {@link Setting._source | `Setting#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Setting.create}
   * and {@link Setting | `new Setting(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link Setting.name | `Setting#name`}.
   *
   * This is data transformed from {@linkcode Setting.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link Setting.update | `Setting#update`}.
   * It is a distinct type from {@link Setting.CreateData | `DeepPartial<Setting.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode Setting}. This is the source of truth for how an Setting document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Setting}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Setting document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The setting key, a composite of \{scope\}.\{name\}
     * @defaultValue `""`
     */
    key: fields.StringField<{
      required: true;
      nullable: false;
      blank: false;
      validate: (k: string) => k is `${string}.${string}`;
      validationError: "must have the format {scope}.{field}";
    }>;

    /**
     * The setting value, which is serialized to JSON
     * @defaultValue `null`
     */
    value: fields.JSONField<{
      required: true;
      nullable: true;
      initial: null;
    }>;

    /**
     * The ID of the user this Setting belongs to, if user-scoped.
     * @defaultValue `null`
     */
    user: fields.ForeignDocumentField<typeof documents.BaseUser, { idOnly: true }>;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database {
    /** Options passed along in Get operations for Settings */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Setting.Parent> {}

    /** Options passed along in Create operations for Settings */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Setting.CreateData, Setting.Parent, Temporary> {}

    /** Options passed along in Delete operations for Settings */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Setting.Parent> {}

    /** Options passed along in Update operations for Settings */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Setting.UpdateData, Setting.Parent> {}

    /** Operation for {@linkcode Setting.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Setting.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Setting.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Setting.Database.Update> {}

    /** Operation for {@linkcode Setting.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Setting.Database.Delete> {}

    /** Operation for {@linkcode Setting.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Setting.Database.Create<Temporary>> {}

    /** Operation for {@link Setting.update | `Setting#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Setting.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Setting._preCreate | `Setting#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Setting._onCreate | `Setting#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Setting._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Setting.Database.Create> {}

    /** Operation for {@link Setting._onCreateOperation | `Setting#_onCreateOperation`} */
    interface OnCreateOperation extends Setting.Database.Create {}

    /** Options for {@link Setting._preUpdate | `Setting#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Setting._onUpdate | `Setting#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Setting._preUpdateOperation} */
    interface PreUpdateOperation extends Setting.Database.Update {}

    /** Operation for {@link Setting._onUpdateOperation | `Setting._preUpdateOperation`} */
    interface OnUpdateOperation extends Setting.Database.Update {}

    /** Options for {@link Setting._preDelete | `Setting#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Setting._onDelete | `Setting#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Setting._preDeleteOperation | `Setting#_preDeleteOperation`} */
    interface PreDeleteOperation extends Setting.Database.Delete {}

    /** Options for {@link Setting._onDeleteOperation | `Setting#_onDeleteOperation`} */
    interface OnDeleteOperation extends Setting.Database.Delete {}

    /** Context for {@linkcode Setting._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Setting.Parent> {}

    /** Context for {@linkcode Setting._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Setting.Parent> {}

    /** Context for {@linkcode Setting._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Setting.Parent> {}

    /**
     * Options for {@link Setting._preCreateDescendantDocuments | `Setting#_preCreateDescendantDocuments`}
     * and {@link Setting._onCreateDescendantDocuments | `Setting#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Setting.Database.Create> {}

    /**
     * Options for {@link Setting._preUpdateDescendantDocuments | `Setting#_preUpdateDescendantDocuments`}
     * and {@link Setting._onUpdateDescendantDocuments | `Setting#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Setting.Database.Update> {}

    /**
     * Options for {@link Setting._preDeleteDescendantDocuments | `Setting#_preDeleteDescendantDocuments`}
     * and {@link Setting._onDeleteDescendantDocuments | `Setting#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Setting.Database.Delete> {}
  }

  /**
   * @deprecated `Settings` does not have any flags.
   *
   * This permanently deprecated type helps to alleviate confusion as a user might expect it to exist.
   */
  type Flags = never;

  namespace Flags {
    /**
     * @deprecated `Settings` does not have any flags.
     *
     * This permanently deprecated type helps to alleviate confusion as a user might expect it to exist.
     */
    type Scope = never;

    /**
     * @deprecated `Settings` does not have any flags.
     *
     * This permanently deprecated type helps to alleviate confusion as a user might expect it to exist.
     */
    type Key<_Scope> = never;

    /**
     * @deprecated `Settings` does not have any flags.
     *
     * This permanently deprecated type helps to alleviate confusion as a user might expect it to exist.
     */
    type Get<_Scope, _Key> = never;
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}
}

/**
 * The client-side Setting document which extends the common BaseSetting model.
 *
 * @see {@linkcode WorldSettings}       The world-level collection of Setting documents
 */
declare class Setting extends foundry.documents.BaseSetting.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `Setting`
   * @param context - Construction context options
   */
  constructor(...args: Setting.ConstructorArgs);

  /**
   * The setting configuration for this setting document.
   */
  get config(): foundry.applications.settings.SettingsConfig | undefined;

  // options: not null (parameter default only)
  protected override _initialize(options?: Document.InitializeOptions): void;

  // _onCreate and _preUpdate are overridden but with no signature changes.
  // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

  /**
   * Cast the value of the Setting into its defined type.
   * @returns The initialized type of the Setting document.
   */
  // TODO: This could probably be derived
  protected _castType(): unknown;

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

  // Descendant Document operations have been left out because Setting does not have any descendant documents.

  // context: not null (destructured)
  static override defaultName(context?: Document.DefaultNameContext<"Setting", Setting.Parent>): string;

  /**
   * @throws Foundry tries to figure out the folders for the world collection and errors out
   */
  // data: not null (parameter default only), context: not null (destructured)
  static override createDialog(
    data?: Setting.CreateData,
    context?: Document.CreateDialogContext<"Setting", Setting.Parent>,
  ): never;

  // options: not null (parameter default only)
  static override fromDropData(
    data: Setting.DropData,
    options?: Setting.DropDataOptions,
  ): Promise<Setting.Implementation | undefined>;

  static override fromImport(
    source: Setting.Source,
    context?: Document.FromImportContext<Setting.Parent> | null,
  ): Promise<Setting.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // Embedded document operations have been left out because Setting does not have any embedded documents.

  static #Setting: true;
}

export default Setting;

import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Folder Document.
 * Defines the DataSchema and common behaviors for a Folder which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseFolder<out _SubType extends BaseFolder.SubType = BaseFolder.SubType> extends Document<
  "Folder",
  BaseFolder.Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseFolder`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseFolder` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Folder.implementation | `new Folder.implementation(...)`} instead which will give you
   * a system specific implementation of `Folder`.
   */
  constructor(...args: Folder.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Folder",
   *   collection: "folders",
   *   label: "DOCUMENT.Folder",
   *   labelPlural: "DOCUMENT.Folders",
   *   coreTypes: CONST.FOLDER_DOCUMENT_TYPES,
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseFolder.Metadata;

  static override defineSchema(): BaseFolder.Schema;

  /**
   * @remarks
   * @throws If `data.folder === data._id` (no putting folders inside themselves)
   * */
  static validateJoint(data: Folder.Source): void;

  /**
   * Allow folder sorting modes
   * @defaultValue `["a", "m"]`
   */
  static SORTING_MODES: ("a" | "m")[];

  /**
   * @remarks Never returns an index entry, only ever {@linkcode Folder.Implementation} or `null`, as the `folders` collection of a
   * compendium is always loaded and available synchronously
   */
  static override get(documentId: string, options?: Folder.Database.GetOptions): Folder.Implementation | null;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  /* Document overrides */

  static " fvtt_types_internal_document_name_static": "Folder";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: Folder.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): Folder.ImplementationClass;

  static override get baseDocument(): typeof BaseFolder;

  static override get collectionName(): Folder.ParentCollectionName;

  static override get documentName(): Folder.Name;

  static override get TYPES(): BaseFolder.SubType[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): Folder.Hierarchy;

  override parent: BaseFolder.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Folder.Implementation | Folder.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Folder.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Folder.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: Folder.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Folder.Database.Update>,
  ): Promise<Folder.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Folder.Database.Delete>,
  ): Promise<Folder.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Folder.CreateData | Folder.CreateData[],
    operation?: Folder.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Folder.Implementation, Temporary> | undefined>;

  override update(
    data: Folder.UpdateData | undefined,
    operation?: Folder.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Folder.Database.DeleteOperation): Promise<this | undefined>;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Folder.Flags.Scope, Key extends Folder.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Folder.Name, Scope, Key>;

  override setFlag<
    Scope extends Folder.Flags.Scope,
    Key extends Folder.Flags.Key<Scope>,
    Value extends Document.GetFlag<Folder.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Folder.Flags.Scope, Key extends Folder.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: Folder.CreateData,
    options: Folder.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: Folder.CreateData,
    options: Folder.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Folder.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Folder.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Folder.Implementation[],
    operation: Folder.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: Folder.UpdateData,
    options: Folder.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: Folder.UpdateData,
    options: Folder.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Folder.Implementation[],
    operation: Folder.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Folder.Implementation[],
    operation: Folder.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: Folder.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: Folder.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Folder.Implementation[],
    operation: Folder.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Folder.Implementation[],
    operation: Folder.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static override get hasSystemData(): undefined;

  // These data field things have been ticketed but will probably go into backlog hell for a while.
  // We'll end up copy and pasting without modification for now I think. It makes it a tiny bit easier to update though.

  // options: not null (parameter default only in _addDataFieldShim)
  protected static override _addDataFieldShims(
    data: AnyMutableObject,
    shims: Record<string, string>,
    options?: Document.DataFieldShimOptions,
  ): void;

  // options: not null (parameter default only)
  protected static override _addDataFieldShim(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    options?: Document.DataFieldShimOptions,
  ): void;

  protected static override _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: Folder.Implementation[],
    context: Document.ModificationContext<Folder.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: Folder.Implementation[],
    context: Document.ModificationContext<Folder.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: Folder.Implementation[],
    context: Document.ModificationContext<Folder.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<Folder.Schema>;

  static override get schema(): SchemaField<Folder.Schema>;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(source: Folder.CreateData, context?: DataModel.FromSourceOptions): Folder.Implementation;

  static override fromJSON(json: string): Folder.Implementation;
}

export default BaseFolder;

declare namespace BaseFolder {
  export import Name = Folder.Name;
  export import ConstructorArgs = Folder.ConstructorArgs;
  export import Hierarchy = Folder.Hierarchy;
  export import Metadata = Folder.Metadata;
  export import SubType = Folder.SubType;
  export import Parent = Folder.Parent;
  export import Descendant = Folder.Descendant;
  export import DescendantClass = Folder.DescendantClass;
  export import Pack = Folder.Pack;
  export import Embedded = Folder.Embedded;
  export import ParentCollectionName = Folder.ParentCollectionName;
  export import CollectionClass = Folder.CollectionClass;
  export import Collection = Folder.Collection;
  export import Invalid = Folder.Invalid;
  export import Stored = Folder.Stored;
  export import Source = Folder.Source;
  export import PersistedData = Folder.PersistedData;
  export import CreateData = Folder.CreateData;
  export import InitializedData = Folder.InitializedData;
  export import UpdateData = Folder.UpdateData;
  export import Schema = Folder.Schema;
  export import DatabaseOperation = Folder.Database;
  export import Flags = Folder.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseFolder.SubType | `BaseFolder.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseFolder.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseFolder.CreateData | `BaseFolder.CreateData`}
   */
  type ConstructorData = BaseFolder.CreateData;
}

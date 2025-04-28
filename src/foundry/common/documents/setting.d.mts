import type { AnyMutableObject } from "fvtt-types/utils";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Setting Document.
 * Defines the DataSchema and common behaviors for a Setting which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseSetting extends Document<"Setting", BaseSetting.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseSetting`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseSetting` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Setting.implementation | `new Setting.implementation(...)`} instead which will give you
   * a system specific implementation of `Setting`.
   */
  constructor(...args: Setting.ConstructorArgs);

  static override metadata: BaseSetting.Metadata;

  static override defineSchema(): BaseSetting.Schema;

  static canUserCreate(user: User.Implementation): boolean;

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

  static " fvtt_types_internal_document_name_static": "Setting";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: Setting.ParentCollectionName | null;

  readonly pack: string | null;

  static get baseDocument(): typeof BaseSetting;

  static get implementation(): Setting.ImplementationClass;

  static get collectionName(): Setting.ParentCollectionName;

  static get documentName(): Setting.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): Setting.Hierarchy;

  override parent: Setting.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Setting.Implementation | Setting.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Setting.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Setting.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Setting.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Setting.Database.Update>,
  ): Promise<Setting.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Setting.Database.Delete>,
  ): Promise<Setting.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Setting.CreateData | Setting.CreateData[],
    operation?: Setting.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Setting.Implementation, Temporary> | undefined>;

  override update(
    data: Setting.UpdateData | undefined,
    operation?: Setting.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Setting.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Setting.Database.GetOptions): Setting.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  protected _preCreate(
    data: Setting.CreateData,
    options: Setting.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Setting.CreateData, options: Setting.Database.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Setting.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Setting.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Setting.Implementation[],
    operation: Setting.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Setting.UpdateData,
    options: Setting.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(changed: Setting.UpdateData, options: Setting.Database.OnUpdateOperation, userId: string): void;

  protected static _preUpdateOperation(
    documents: Setting.Implementation[],
    operation: Setting.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Setting.Implementation[],
    operation: Setting.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(options: Setting.Database.PreDeleteOptions, user: User.Implementation): Promise<boolean | void>;

  protected _onDelete(options: Setting.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Setting.Implementation[],
    operation: Setting.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Setting.Implementation[],
    operation: Setting.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): undefined;

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
  protected static override _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  protected static _onCreateDocuments(
    documents: Setting.Implementation[],
    context: Document.ModificationContext<Setting.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Setting.Implementation[],
    context: Document.ModificationContext<Setting.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Setting.Implementation[],
    context: Document.ModificationContext<Setting.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<Setting.Schema>;

  static get schema(): SchemaField<Setting.Schema>;

  static validateJoint(data: Setting.Source): void;

  // context: not null (destructured)
  static override fromSource(
    source: Setting.CreateData,
    context?: Document.ConstructionContext<BaseSetting.Parent>,
  ): Setting.Implementation;

  static override fromJSON(json: string): Setting.Implementation;
}

export default BaseSetting;

declare namespace BaseSetting {
  export import Name = Setting.Name;
  export import ConstructorArgs = Setting.ConstructorArgs;
  export import Hierarchy = Setting.Hierarchy;
  export import Metadata = Setting.Metadata;
  export import Parent = Setting.Parent;
  export import Descendant = Setting.Descendant;
  export import DescendantClass = Setting.DescendantClass;
  export import Pack = Setting.Pack;
  export import Embedded = Setting.Embedded;
  export import ParentCollectionName = Setting.ParentCollectionName;
  export import CollectionClass = Setting.CollectionClass;
  export import Collection = Setting.Collection;
  export import Invalid = Setting.Invalid;
  export import Stored = Setting.Stored;
  export import Source = Setting.Source;
  export import PersistedData = Setting.PersistedData;
  export import CreateData = Setting.CreateData;
  export import InitializedData = Setting.InitializedData;
  export import UpdateData = Setting.UpdateData;
  export import Schema = Setting.Schema;
  export import DatabaseOperation = Setting.Database;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseSetting.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseSetting.CreateData | `BaseSetting.CreateData`}
   */
  type ConstructorData = BaseSetting.CreateData;
}

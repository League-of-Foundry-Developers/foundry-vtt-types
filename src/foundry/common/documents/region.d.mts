import type { DataField, SchemaField } from "#common/data/fields.mjs";
import type { AnyObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Region Document.
 * Defines the DataSchema and common behaviors for a Region which are shared between both client and server.
 */
declare abstract class BaseRegion extends Document<"Region", BaseRegion.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseRegion`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseRegion` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link RegionDocument.implementation | `new RegionDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `RegionDocument`.
   */
  constructor(...args: RegionDocument.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Region",
   *   collection: "regions",
   *   label: "DOCUMENT.Region",
   *   labelPlural: "DOCUMENT.Regions",
   *   isEmbedded: true,
   *   embedded: {
   *     RegionBehavior: "behaviors"
   *   },
   *   schemaVersion: "12.324"
   * }
   * ```
   */
  static override metadata: BaseRegion.Metadata;

  static override defineSchema(): BaseRegion.Schema;

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

  static " fvtt_types_internal_document_name_static": "Region";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: RegionDocument.ParentCollectionName | null;

  readonly pack: string | null;

  static get implementation(): RegionDocument.ImplementationClass;

  static get baseDocument(): typeof BaseRegion;

  static get collectionName(): RegionDocument.ParentCollectionName;

  static get documentName(): RegionDocument.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): RegionDocument.Hierarchy;

  override parent: BaseRegion.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<RegionDocument.Implementation | RegionDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<RegionDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<RegionDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: RegionDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<RegionDocument.Database.Update>,
  ): Promise<RegionDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<RegionDocument.Database.Delete>,
  ): Promise<RegionDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: RegionDocument.CreateData | RegionDocument.CreateData[],
    operation?: RegionDocument.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<RegionDocument.Implementation, Temporary> | undefined>;

  override update(
    data: RegionDocument.UpdateData | undefined,
    operation?: RegionDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: RegionDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: RegionDocument.Database.GetOptions,
  ): RegionDocument.Implementation | null;

  static override getCollectionName<CollectionName extends RegionDocument.Embedded.Name>(
    name: CollectionName,
  ): RegionDocument.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends RegionDocument.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): RegionDocument.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends RegionDocument.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): RegionDocument.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends RegionDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends RegionDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends RegionDocument.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends RegionDocument.Flags.Scope, Key extends RegionDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<RegionDocument.Name, Scope, Key>;

  override setFlag<
    Scope extends RegionDocument.Flags.Scope,
    Key extends RegionDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<RegionDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends RegionDocument.Flags.Scope, Key extends RegionDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: RegionDocument.CreateData,
    options: RegionDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: RegionDocument.CreateData,
    options: RegionDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: RegionDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<RegionDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: RegionDocument.UpdateData,
    options: RegionDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: RegionDocument.UpdateData,
    options: RegionDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: RegionDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: RegionDocument.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): undefined;

  // These data field things have been ticketed but will probably go into backlog hell for a while.
  // We'll end up copy and pasting without modification for now I think. It makes it a tiny bit easier to update though.
  protected static _addDataFieldShims(data: AnyObject, shims: AnyObject, options?: Document.DataFieldShimOptions): void;

  protected static _addDataFieldMigration(
    data: AnyObject,
    oldKey: string,
    newKey: string,
    apply?: (data: AnyObject) => unknown,
  ): unknown;

  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  protected static _onCreateDocuments(
    documents: RegionDocument.Implementation[],
    context: Document.ModificationContext<RegionDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: RegionDocument.Implementation[],
    context: Document.ModificationContext<RegionDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: RegionDocument.Implementation[],
    context: Document.ModificationContext<RegionDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<RegionDocument.Schema>;

  static get schema(): SchemaField<RegionDocument.Schema>;

  static validateJoint(data: RegionDocument.Source): void;

  static override fromSource(
    source: RegionDocument.CreateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): RegionDocument.Implementation;

  static override fromJSON(json: string): RegionDocument.Implementation;
}

export default BaseRegion;

declare namespace BaseRegion {
  export import Name = RegionDocument.Name;
  export import ConstructorArgs = RegionDocument.ConstructorArgs;
  export import Hierarchy = RegionDocument.Hierarchy;
  export import Metadata = RegionDocument.Metadata;
  export import Parent = RegionDocument.Parent;
  export import Descendant = RegionDocument.Descendant;
  export import DescendantClass = RegionDocument.DescendantClass;
  export import Pack = RegionDocument.Pack;
  export import Embedded = RegionDocument.Embedded;
  export import ParentCollectionName = RegionDocument.ParentCollectionName;
  export import CollectionClass = RegionDocument.CollectionClass;
  export import Collection = RegionDocument.Collection;
  export import Invalid = RegionDocument.Invalid;
  export import Stored = RegionDocument.Stored;
  export import Source = RegionDocument.Source;
  export import PersistedData = RegionDocument.PersistedData;
  export import CreateData = RegionDocument.CreateData;
  export import InitializedData = RegionDocument.InitializedData;
  export import UpdateData = RegionDocument.UpdateData;
  export import Schema = RegionDocument.Schema;
  export import DatabaseOperation = RegionDocument.Database;
  export import Flags = RegionDocument.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseRegionDocument.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseRegion.CreateData | `BaseRegionDocument.CreateData`}
   */
  type ConstructorData = BaseRegion.CreateData;
}

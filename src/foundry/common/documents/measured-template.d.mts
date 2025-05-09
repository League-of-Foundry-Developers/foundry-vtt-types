import type { AnyMutableObject, AnyObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Document definition for a MeasuredTemplate.
 * Defines the DataSchema and common behaviors for a MeasuredTemplate which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseMeasuredTemplate extends Document<"MeasuredTemplate", BaseMeasuredTemplate.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseMeasuredTemplate`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseMeasuredTemplate` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link MeasuredTemplateDocument.implementation | `new MeasuredTemplateDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `MeasuredTemplateDocument`.
   */
  constructor(...args: MeasuredTemplateDocument.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "MeasuredTemplate",
   *   collection: "templates",
   *   label: "DOCUMENT.MeasuredTemplate",
   *   labelPlural: "DOCUMENT.MeasuredTemplates",
   *   isEmbedded: true,
   *   permissions: {
   *     create: this.#canCreate,
   *     update: this.#canUpdate
   *   },
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseMeasuredTemplate.Metadata;

  static override defineSchema(): BaseMeasuredTemplate.Schema;

  // options: not null (destructured)
  override testUserPermission(
    user: User.Internal.Implementation,
    permission: Document.TestableOwnershipLevel,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  /**
   * @remarks Migrates:
   * - `user` to `author`
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks Shims:
   * - `user` to `author` since v12, until v14
   */
  // options: not null (destructured)
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated since v12, until 14
   * @remarks "You are accessing `user` which has been migrated to `author`"
   */
  get user(): this["author"];

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

  static " fvtt_types_internal_document_name_static": "MeasuredTemplate";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: MeasuredTemplateDocument.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): MeasuredTemplateDocument.ImplementationClass;

  static get baseDocument(): typeof BaseMeasuredTemplate;

  static get collectionName(): MeasuredTemplateDocument.ParentCollectionName;

  static get documentName(): MeasuredTemplateDocument.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): MeasuredTemplateDocument.Hierarchy;

  override parent: MeasuredTemplateDocument.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<MeasuredTemplateDocument.Implementation | MeasuredTemplateDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<MeasuredTemplateDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<MeasuredTemplateDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: MeasuredTemplateDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<MeasuredTemplateDocument.Database.Update>,
  ): Promise<MeasuredTemplateDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<MeasuredTemplateDocument.Database.Delete>,
  ): Promise<MeasuredTemplateDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: MeasuredTemplateDocument.CreateData | MeasuredTemplateDocument.CreateData[],
    operation?: MeasuredTemplateDocument.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<MeasuredTemplateDocument.Implementation, Temporary> | undefined>;

  override update(
    data: MeasuredTemplateDocument.UpdateData | undefined,
    operation?: MeasuredTemplateDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: MeasuredTemplateDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: MeasuredTemplateDocument.Database.GetOptions,
  ): MeasuredTemplateDocument.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<
    Scope extends MeasuredTemplateDocument.Flags.Scope,
    Key extends MeasuredTemplateDocument.Flags.Key<Scope>,
  >(scope: Scope, key: Key): Document.GetFlag<MeasuredTemplateDocument.Name, Scope, Key>;

  override setFlag<
    Scope extends MeasuredTemplateDocument.Flags.Scope,
    Key extends MeasuredTemplateDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<MeasuredTemplateDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<
    Scope extends MeasuredTemplateDocument.Flags.Scope,
    Key extends MeasuredTemplateDocument.Flags.Key<Scope>,
  >(scope: Scope, key: Key): Promise<this>;

  protected _preCreate(
    data: MeasuredTemplateDocument.CreateData,
    options: MeasuredTemplateDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: MeasuredTemplateDocument.CreateData,
    options: MeasuredTemplateDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<MeasuredTemplateDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: MeasuredTemplateDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: MeasuredTemplateDocument.UpdateData,
    options: MeasuredTemplateDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: MeasuredTemplateDocument.UpdateData,
    options: MeasuredTemplateDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: MeasuredTemplateDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: MeasuredTemplateDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: MeasuredTemplateDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: MeasuredTemplateDocument.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: MeasuredTemplateDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: MeasuredTemplateDocument.Database.Delete,
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
    documents: MeasuredTemplateDocument.Implementation[],
    context: Document.ModificationContext<MeasuredTemplateDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: MeasuredTemplateDocument.Implementation[],
    context: Document.ModificationContext<MeasuredTemplateDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: MeasuredTemplateDocument.Implementation[],
    context: Document.ModificationContext<MeasuredTemplateDocument.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<MeasuredTemplateDocument.Schema>;

  static get schema(): SchemaField<MeasuredTemplateDocument.Schema>;

  static validateJoint(data: MeasuredTemplateDocument.Source): void;

  static override fromSource(
    source: MeasuredTemplateDocument.CreateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): MeasuredTemplateDocument.Implementation;

  static override fromJSON(json: string): MeasuredTemplateDocument.Implementation;
}

export default BaseMeasuredTemplate;

declare namespace BaseMeasuredTemplate {
  export import Name = MeasuredTemplateDocument.Name;
  export import ConstructorArgs = MeasuredTemplateDocument.ConstructorArgs;
  export import Hierarchy = MeasuredTemplateDocument.Hierarchy;
  export import Metadata = MeasuredTemplateDocument.Metadata;
  export import Parent = MeasuredTemplateDocument.Parent;
  export import Descendant = MeasuredTemplateDocument.Descendant;
  export import DescendantClass = MeasuredTemplateDocument.DescendantClass;
  export import Pack = MeasuredTemplateDocument.Pack;
  export import Embedded = MeasuredTemplateDocument.Embedded;
  export import ParentCollectionName = MeasuredTemplateDocument.ParentCollectionName;
  export import CollectionClass = MeasuredTemplateDocument.CollectionClass;
  export import Collection = MeasuredTemplateDocument.Collection;
  export import Invalid = MeasuredTemplateDocument.Invalid;
  export import Stored = MeasuredTemplateDocument.Stored;
  export import Source = MeasuredTemplateDocument.Source;
  export import PersistedData = MeasuredTemplateDocument.PersistedData;
  export import CreateData = MeasuredTemplateDocument.CreateData;
  export import InitializedData = MeasuredTemplateDocument.InitializedData;
  export import UpdateData = MeasuredTemplateDocument.UpdateData;
  export import Schema = MeasuredTemplateDocument.Schema;
  export import DatabaseOperation = MeasuredTemplateDocument.Database;
  export import Flags = MeasuredTemplateDocument.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated Replaced with {@link foundry.data.fields.SchemaField | `SchemaField<BaseMeasuredTemplate.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated Replaced with {@linkcode BaseMeasuredTemplate.CreateData}
   */
  type ConstructorData = BaseMeasuredTemplate.CreateData;
}

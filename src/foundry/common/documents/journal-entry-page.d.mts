import type { AnyObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The JournalEntryPage Document.
 * Defines the DataSchema and common behaviors for a JournalEntryPage which are shared between both client and server.
 */
declare abstract class BaseJournalEntryPage<
  out SubType extends BaseJournalEntryPage.SubType = BaseJournalEntryPage.SubType,
> extends Document<"JournalEntryPage", BaseJournalEntryPage._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseJournalEntryPage`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseJournalEntryPage` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link JournalEntryPage.implementation | `new JournalEntryPage.implementation(...)`} instead which will give you
   * a system specific implementation of `JournalEntryPage`.
   */
  constructor(...args: JournalEntryPage.ConstructorArgs);

  _source: BaseJournalEntryPage.Source;

  static override metadata: BaseJournalEntryPage.Metadata;

  static override defineSchema(): BaseJournalEntryPage.Schema;

  override getUserLevel(user?: User.Implementation): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

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

  static " fvtt_types_internal_document_name_static": "JournalEntryPage";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: JournalEntryPage.ParentCollectionName | null;

  readonly pack: string | null;

  static get implementation(): JournalEntryPage.ImplementationClass;

  static get baseDocument(): typeof BaseJournalEntryPage;

  static get collectionName(): JournalEntryPage.ParentCollectionName;

  static get documentName(): JournalEntryPage.Name;

  static get TYPES(): BaseJournalEntryPage.SubType[];

  static get hasTypeData(): true;

  static get hierarchy(): JournalEntryPage.Hierarchy;

  override system: JournalEntryPage.SystemOfType<SubType>;

  override parent: BaseJournalEntryPage.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<JournalEntryPage.Implementation | JournalEntryPage.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<JournalEntryPage.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<JournalEntryPage.Implementation, Temporary>>>;

  static updateDocuments(
    updates: JournalEntryPage.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<JournalEntryPage.Database.Update>,
  ): Promise<JournalEntryPage.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<JournalEntryPage.Database.Delete>,
  ): Promise<JournalEntryPage.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: JournalEntryPage.CreateData | JournalEntryPage.CreateData[],
    operation?: JournalEntryPage.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<JournalEntryPage.Implementation, Temporary> | undefined>;

  override update(
    data: JournalEntryPage.UpdateData | undefined,
    operation?: JournalEntryPage.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: JournalEntryPage.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: JournalEntryPage.Database.GetOptions,
  ): JournalEntryPage.Implementation | null;

  static override getCollectionName<CollectionName extends JournalEntryPage.EmbeddedName>(
    name: CollectionName,
  ): JournalEntryPage.CollectionNameOf<CollectionName> | null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends JournalEntryPage.Flags.Scope, Key extends JournalEntryPage.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<JournalEntryPage.Name, Scope, Key>;

  override setFlag<
    Scope extends JournalEntryPage.Flags.Scope,
    Key extends JournalEntryPage.Flags.Key<Scope>,
    Value extends Document.GetFlag<JournalEntryPage.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends JournalEntryPage.Flags.Scope, Key extends JournalEntryPage.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: JournalEntryPage.CreateData,
    options: JournalEntryPage.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: JournalEntryPage.CreateData,
    options: JournalEntryPage.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<JournalEntryPage.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: JournalEntryPage.UpdateData,
    options: JournalEntryPage.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: JournalEntryPage.UpdateData,
    options: JournalEntryPage.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: JournalEntryPage.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: JournalEntryPage.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): true;

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
    documents: JournalEntryPage.Implementation[],
    context: Document.ModificationContext<JournalEntryPage.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: JournalEntryPage.Implementation[],
    context: Document.ModificationContext<JournalEntryPage.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: JournalEntryPage.Implementation[],
    context: Document.ModificationContext<JournalEntryPage.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<JournalEntryPage.Schema>;

  static get schema(): SchemaField<JournalEntryPage.Schema>;

  static validateJoint(data: JournalEntryPage.Source): void;

  static override fromSource(
    source: JournalEntryPage.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<JournalEntryPage.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<JournalEntryPage.Schema, DataModel.Any | null>;
}

export default BaseJournalEntryPage;

declare namespace BaseJournalEntryPage {
  export import Name = JournalEntryPage.Name;
  export import ConstructorArgs = JournalEntryPage.ConstructorArgs;
  export import Hierarchy = JournalEntryPage.Hierarchy;
  export import Metadata = JournalEntryPage.Metadata;
  export import SubType = JournalEntryPage.SubType;
  export import ConfiguredSubTypes = JournalEntryPage.ConfiguredSubTypes;
  export import Known = JournalEntryPage.Known;
  export import OfType = JournalEntryPage.OfType;
  export import SystemOfType = JournalEntryPage.SystemOfType;
  export import Parent = JournalEntryPage.Parent;
  export import Descendants = JournalEntryPage.Descendants;
  export import DescendantClasses = JournalEntryPage.DescendantClasses;
  export import Pack = JournalEntryPage.Pack;
  export import Embedded = JournalEntryPage.Embedded;
  export import EmbeddedName = JournalEntryPage.EmbeddedName;
  export import EmbeddedCollectionName = JournalEntryPage.EmbeddedCollectionName;
  export import ParentCollectionName = JournalEntryPage.ParentCollectionName;
  export import CollectionClass = JournalEntryPage.CollectionClass;
  export import Collection = JournalEntryPage.Collection;
  export import Stored = JournalEntryPage.Stored;
  export import Source = JournalEntryPage.Source;
  export import PersistedData = JournalEntryPage.PersistedData;
  export import CreateData = JournalEntryPage.CreateData;
  export import InitializedData = JournalEntryPage.InitializedData;
  export import UpdateData = JournalEntryPage.UpdateData;
  export import Schema = JournalEntryPage.Schema;
  export import DatabaseOperation = JournalEntryPage.Database;
  export import Flags = JournalEntryPage.Flags;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends JournalEntryPage.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseJournalEntryPage.SubType | `BaseJournalEntryPage.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseJournalEntryPage.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseJournalEntryPage.CreateData | `BaseJournalEntryPage.CreateData`}
   */
  type ConstructorData = BaseJournalEntryPage.CreateData;
}

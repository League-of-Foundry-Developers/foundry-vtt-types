import type { AnyMutableObject } from "fvtt-types/utils";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Combat Document.
 * Defines the DataSchema and common behaviors for a Combat which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseCombat<out SubType extends BaseCombat.SubType = BaseCombat.SubType> extends Document<
  "Combat",
  BaseCombat._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseCombat`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseCombat` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Combat.implementation | `new Combat.implementation(...)`} instead which will give you
   * a system specific implementation of `Combat`.
   */
  constructor(...args: Combat.ConstructorArgs);

  static override metadata: BaseCombat.Metadata;

  static override defineSchema(): BaseCombat.Schema;

  /**
   * Is a user able to update an existing Combat?
   * @internal
   */
  static #canUpdate(user: User.Implementation, doc: BaseCombat, data: BaseCombat.UpdateData): boolean;

  /**
   * Can a certain User change the Combat round?
   * @param user - The user attempting to change the round
   * @returns Is the user allowed to change the round?
   */
  protected _canChangeRound(user: User.Implementation): boolean;

  /**
   * Can a certain User change the Combat turn?
   * @param user - The user attempting to change the turn
   * @returns Is the user allowed to change the turn?
   */
  protected _canChangeTurn(user: User.Implementation): boolean;

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

  static " fvtt_types_internal_document_name_static": "Combat";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: Combat.ParentCollectionName | null;

  readonly pack: string | null;

  static get implementation(): Combat.ImplementationClass;

  static get baseDocument(): typeof BaseCombat;

  static get collectionName(): Combat.ParentCollectionName;

  static get documentName(): Combat.Name;

  static get TYPES(): BaseCombat.SubType[];

  static get hasTypeData(): true;

  static get hierarchy(): Combat.Hierarchy;

  override system: Combat.SystemOfType<SubType>;

  override parent: BaseCombat.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Combat.Implementation | Combat.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Combat.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Combat.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Combat.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Combat.Database.Update>,
  ): Promise<Combat.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Combat.Database.Delete>,
  ): Promise<Combat.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Combat.CreateData | Combat.CreateData[],
    operation?: Combat.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Combat.Implementation, Temporary> | undefined>;

  override update(
    data: Combat.UpdateData | undefined,
    operation?: Combat.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Combat.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Combat.Database.GetOptions): Combat.Implementation | null;

  static override getCollectionName<CollectionName extends Combat.Embedded.Name>(
    name: CollectionName,
  ): Combat.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends Combat.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): Combat.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends Combat.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): Combat.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends Combat.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends Combat.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends Combat.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Combat.Flags.Scope, Key extends Combat.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Combat.Name, Scope, Key>;

  override setFlag<
    Scope extends Combat.Flags.Scope,
    Key extends Combat.Flags.Key<Scope>,
    Value extends Document.GetFlag<Combat.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Combat.Flags.Scope, Key extends Combat.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: Combat.CreateData,
    options: Combat.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Combat.CreateData, options: Combat.Database.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Combat.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Combat.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Combat.Implementation[],
    operation: Combat.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Combat.UpdateData,
    options: Combat.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(changed: Combat.UpdateData, options: Combat.Database.OnUpdateOperation, userId: string): void;

  protected static _preUpdateOperation(
    documents: Combat.Implementation[],
    operation: Combat.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Combat.Implementation[],
    operation: Combat.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(options: Combat.Database.PreDeleteOptions, user: User.Implementation): Promise<boolean | void>;

  protected _onDelete(options: Combat.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Combat.Implementation[],
    operation: Combat.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Combat.Implementation[],
    operation: Combat.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): true;

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
    documents: Combat.Implementation[],
    context: Document.ModificationContext<Combat.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Combat.Implementation[],
    context: Document.ModificationContext<Combat.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Combat.Implementation[],
    context: Document.ModificationContext<Combat.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<Combat.Schema>;

  static get schema(): SchemaField<Combat.Schema>;

  static validateJoint(data: Combat.Source): void;

  // context: not null (destructured)
  static override fromSource(
    source: Combat.CreateData,
    context?: Document.ConstructionContext<BaseCombat.Parent>,
  ): Combat.Implementation;

  static override fromJSON(json: string): Combat.Implementation;
}

export default BaseCombat;

declare namespace BaseCombat {
  export import Name = Combat.Name;
  export import ConstructorArgs = Combat.ConstructorArgs;
  export import Hierarchy = Combat.Hierarchy;
  export import Metadata = Combat.Metadata;
  export import SubType = Combat.SubType;
  export import ConfiguredSubTypes = Combat.ConfiguredSubTypes;
  export import Known = Combat.Known;
  export import OfType = Combat.OfType;
  export import SystemOfType = Combat.SystemOfType;
  export import Parent = Combat.Parent;
  export import Descendant = Combat.Descendant;
  export import DescendantClass = Combat.DescendantClass;
  export import Pack = Combat.Pack;
  export import Embedded = Combat.Embedded;
  export import ParentCollectionName = Combat.ParentCollectionName;
  export import CollectionClass = Combat.CollectionClass;
  export import Collection = Combat.Collection;
  export import Invalid = Combat.Invalid;
  export import Stored = Combat.Stored;
  export import Source = Combat.Source;
  export import PersistedData = Combat.PersistedData;
  export import CreateData = Combat.CreateData;
  export import InitializedData = Combat.InitializedData;
  export import UpdateData = Combat.UpdateData;
  export import Schema = Combat.Schema;
  export import DatabaseOperation = Combat.Database;
  export import Flags = Combat.Flags;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends Combat.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseCombat.SubType | `BaseCombat.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseCombat.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseCombat.CreateData | `BaseCombat.CreateData`}
   */
  type ConstructorData = BaseCombat.CreateData;
}

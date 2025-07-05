import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
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
   * @remarks Constructing `BaseCombat` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Combat.implementation | `new Combat.implementation(...)`} instead which will give you
   * a system specific implementation of `Combat`.
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: Combat.CreateData, context?: Combat.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Combat",
   *   collection: "combats",
   *   label: "DOCUMENT.Combat",
   *   labelPlural: "DOCUMENT.Combats",
   *   embedded: {
   *     Combatant: "combatants",
   *     CombatantGroup: "groups"
   *   },
   *   hasTypeData: true,
   *   permissions: {
   *     update: this.#canUpdate
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseCombat.Metadata;

  /** @defaultValue `["DOCUMENT", "COMBAT"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): BaseCombat.Schema;

  /**
   * Can a certain User change the Combat round?
   * @param user - The user attempting to change the round
   * @returns Is the user allowed to change the round?
   * @remarks Foundry's implementation always returns `true`
   */
  protected _canChangeRound(user: User.Implementation): boolean;

  /**
   * Can a certain User change the Combat turn?
   * @param user - The user attempting to change the turn
   * @returns Is the user allowed to change the turn?
   * @remarks Foundry's implementation always returns `true`
   */
  protected _canChangeTurn(user: User.Implementation): boolean;

  protected override _preUpdate(
    changed: Combat.UpdateData,
    options: Combat.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  type: SubType;

  /* Document overrides */

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: Combat.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): Combat.ImplementationClass;

  static override get baseDocument(): typeof BaseCombat;

  static override get collectionName(): Combat.ParentCollectionName;

  static override get documentName(): Combat.Name;

  static override get TYPES(): BaseCombat.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): Combat.Hierarchy;

  override system: Combat.SystemOfType<SubType>;

  override parent: BaseCombat.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<Combat.Implementation | Combat.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Combat.Database.Create<Temporary>>,
  ): Promise<Array<Combat.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: Combat.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Combat.Database.Update>,
  ): Promise<Combat.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Combat.Database.Delete>,
  ): Promise<Combat.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: Combat.CreateData | Combat.CreateData[],
    operation?: Combat.Database.CreateOperation<Temporary>,
  ): Promise<Combat.TemporaryIf<Temporary> | undefined>;

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
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends Combat.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends Combat.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends Combat.Flags.Scope, Key extends Combat.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Combat.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends Combat.Flags.Scope,
    Key extends Combat.Flags.Key<Scope>,
    Value extends Combat.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Combat.Flags.Scope, Key extends Combat.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: Combat.CreateData,
    options: Combat.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: Combat.CreateData,
    options: Combat.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Combat.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Combat.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Combat.Implementation[],
    operation: Combat.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _onUpdate(
    changed: Combat.UpdateData,
    options: Combat.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Combat.Implementation[],
    operation: Combat.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Combat.Implementation[],
    operation: Combat.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: Combat.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: Combat.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Combat.Implementation[],
    operation: Combat.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Combat.Implementation[],
    operation: Combat.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

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
    documents: Combat.Implementation[],
    context: Document.ModificationContext<Combat.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: Combat.Implementation[],
    context: Document.ModificationContext<Combat.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: Combat.Implementation[],
    context: Document.ModificationContext<Combat.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<Combat.Schema>;

  static override get schema(): SchemaField<Combat.Schema>;

  static override validateJoint(data: Combat.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(source: Combat.CreateData, context?: DataModel.FromSourceOptions): Combat.Implementation;

  static override fromJSON(json: string): Combat.Implementation;

  static #BaseCombat: true;
}

export default BaseCombat;

declare namespace BaseCombat {
  export import Name = Combat.Name;
  export import ConstructionContext = Combat.ConstructionContext;
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
  export import CreateData = Combat.CreateData;
  export import InitializedData = Combat.InitializedData;
  export import UpdateData = Combat.UpdateData;
  export import Schema = Combat.Schema;
  export import Database = Combat.Database;
  export import TemporaryIf = Combat.TemporaryIf;
  export import Flags = Combat.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Combat` a name.
    // The expression `ClientDocumentMixin(BaseCombat)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseCombat> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends Combat.Schema {
    system: any;
  }
}

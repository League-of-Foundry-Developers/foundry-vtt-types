import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

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
   * You should use {@linkcode Combat.implementation | new Combat.implementation(...)} instead which will give you
   * a system specific implementation of `Combat`.
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: BaseCombat.CreateData, context?: BaseCombat.ConstructionContext);

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
    changed: BaseCombat.UpdateData,
    options: BaseCombat.Database.PreUpdateOptions,
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

  override readonly parentCollection: BaseCombat.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Combat.ImplementationClass;

  static override get baseDocument(): typeof BaseCombat;

  static override get collectionName(): BaseCombat.ParentCollectionName;

  static override get documentName(): BaseCombat.Name;

  static override get TYPES(): BaseCombat.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): BaseCombat.Hierarchy;

  override system: BaseCombat.SystemOfType<SubType>;

  override parent: BaseCombat.Parent;

  override " fvtt_types_internal_document_parent": BaseCombat.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<Combat.Implementation | BaseCombat.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseCombat.Database.Create<Temporary>>,
  ): Promise<Array<BaseCombat.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseCombat.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseCombat.Database.Update>,
  ): Promise<Combat.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseCombat.Database.Delete>,
  ): Promise<Combat.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseCombat.CreateData | BaseCombat.CreateData[],
    operation?: BaseCombat.Database.CreateOperation<Temporary>,
  ): Promise<BaseCombat.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseCombat.UpdateData | undefined,
    operation?: BaseCombat.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseCombat.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: BaseCombat.Database.GetOptions): Combat.Implementation | null;

  static override getCollectionName<CollectionName extends BaseCombat.Embedded.Name>(
    name: CollectionName,
  ): BaseCombat.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends BaseCombat.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseCombat.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends BaseCombat.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): BaseCombat.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends BaseCombat.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.CreateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseCombat.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseCombat.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends BaseCombat.Flags.Scope, Key extends BaseCombat.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseCombat.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseCombat.Flags.Scope,
    Key extends BaseCombat.Flags.Key<Scope>,
    Value extends BaseCombat.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseCombat.Flags.Scope, Key extends BaseCombat.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: BaseCombat.CreateData,
    options: BaseCombat.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseCombat.CreateData,
    options: BaseCombat.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Combat.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseCombat.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Combat.Implementation[],
    operation: BaseCombat.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _onUpdate(
    changed: BaseCombat.UpdateData,
    options: BaseCombat.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Combat.Implementation[],
    operation: BaseCombat.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Combat.Implementation[],
    operation: BaseCombat.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseCombat.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseCombat.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Combat.Implementation[],
    operation: BaseCombat.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Combat.Implementation[],
    operation: BaseCombat.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation | Document._onCreateOperation}"
   */
  protected static override _onCreateDocuments(
    documents: Combat.Implementation[],
    context: Document.ModificationContext<BaseCombat.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation | Document._onUpdateOperation}"
   */
  protected static override _onUpdateDocuments(
    documents: Combat.Implementation[],
    context: Document.ModificationContext<BaseCombat.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation | Document._onDeleteOperation}"
   */
  protected static override _onDeleteDocuments(
    documents: Combat.Implementation[],
    context: Document.ModificationContext<BaseCombat.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseCombat.Schema>;

  static override get schema(): SchemaField<BaseCombat.Schema>;

  static override validateJoint(data: BaseCombat.Source): void;

  static override fromSource(
    source: BaseCombat.CreateData,
    context?: DataModel.FromSourceOptions,
  ): Combat.Implementation;

  static override fromJSON(json: string): Combat.Implementation;

  static #BaseCombat: true;
}

export default BaseCombat;

declare namespace BaseCombat {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Combat.Name;
  export import ConstructionContext = Combat.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Combat.ConstructorArgs;
  export import Hierarchy = Combat.Hierarchy;
  export import Metadata = Combat.Metadata;
  export import SubType = Combat.SubType;
  export import ConfiguredSubType = Combat.ConfiguredSubType;
  export import Known = Combat.Known;
  export import OfType = Combat.OfType;
  export import SystemOfType = Combat.SystemOfType;
  export import Parent = Combat.Parent;
  export import Descendant = Combat.Descendant;
  export import DescendantClass = Combat.DescendantClass;
  export import Embedded = Combat.Embedded;
  export import ParentCollectionName = Combat.ParentCollectionName;
  export import CollectionClass = Combat.CollectionClass;
  export import Collection = Combat.Collection;
  export import Invalid = Combat.Invalid;
  export import Stored = Combat.Stored;
  export import Source = Combat.Source;
  export import CreateData = Combat.CreateData;
  export import CreateInput = Combat.CreateInput;
  export import CreateReturn = Combat.CreateReturn;
  export import InitializedData = Combat.InitializedData;
  export import UpdateData = Combat.UpdateData;
  export import UpdateInput = Combat.UpdateInput;
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

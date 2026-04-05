import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

/**
 * A Document that represents a grouping of individual Combatants in a Combat.
 * Defines the DataSchema and common behaviors for a CombatantGroup which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseCombatantGroup<
  out SubType extends BaseCombatantGroup.SubType = BaseCombatantGroup.SubType,
> extends Document<"CombatantGroup", BaseCombatantGroup._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseCombatantGroup`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseCombatantGroup` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link CombatantGroup.implementation | `new CombatantGroup.implementation(...)`} instead which will give you
   * a system specific implementation of `CombatantGroup`.
   */
  constructor(data: BaseCombatantGroup.CreateData, context?: BaseCombatantGroup.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "CombatantGroup",
   *   collection: "groups",
   *   label: "DOCUMENT.CombatantGroup",
   *   labelPlural: "DOCUMENT.CombatantGroups",
   *   isEmbedded: true,
   *   hasTypeData: true,
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseCombatantGroup.Metadata;

  static override defineSchema(): BaseCombatantGroup.Schema;

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
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: BaseCombatantGroup.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): CombatantGroup.ImplementationClass;

  static override get baseDocument(): typeof BaseCombatantGroup;

  static override get collectionName(): BaseCombatantGroup.ParentCollectionName;

  static override get documentName(): BaseCombatantGroup.Name;

  static override get TYPES(): BaseCombatantGroup.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): BaseCombatantGroup.Hierarchy;

  override system: BaseCombatantGroup.SystemOfType<SubType>;

  override parent: BaseCombatantGroup.Parent;

  override " fvtt_types_internal_document_parent": BaseCombatantGroup.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<CombatantGroup.Implementation | BaseCombatantGroup.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseCombatantGroup.Database.Create<Temporary>>,
  ): Promise<Array<BaseCombatantGroup.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseCombatantGroup.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseCombatantGroup.Database.Update>,
  ): Promise<CombatantGroup.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseCombatantGroup.Database.Delete>,
  ): Promise<CombatantGroup.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseCombatantGroup.CreateData | BaseCombatantGroup.CreateData[],
    operation?: BaseCombatantGroup.Database.CreateOperation<Temporary>,
  ): Promise<BaseCombatantGroup.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseCombatantGroup.UpdateData | undefined,
    operation?: BaseCombatantGroup.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseCombatantGroup.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: BaseCombatantGroup.Database.GetOptions,
  ): CombatantGroup.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends BaseCombatantGroup.Flags.Scope, Key extends BaseCombatantGroup.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseCombatantGroup.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseCombatantGroup.Flags.Scope,
    Key extends BaseCombatantGroup.Flags.Key<Scope>,
    Value extends BaseCombatantGroup.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseCombatantGroup.Flags.Scope, Key extends BaseCombatantGroup.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: BaseCombatantGroup.CreateData,
    options: BaseCombatantGroup.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseCombatantGroup.CreateData,
    options: BaseCombatantGroup.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: CombatantGroup.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseCombatantGroup.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: CombatantGroup.Implementation[],
    operation: BaseCombatantGroup.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseCombatantGroup.UpdateData,
    options: BaseCombatantGroup.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseCombatantGroup.UpdateData,
    options: BaseCombatantGroup.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: CombatantGroup.Implementation[],
    operation: BaseCombatantGroup.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: CombatantGroup.Implementation[],
    operation: BaseCombatantGroup.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseCombatantGroup.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseCombatantGroup.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: CombatantGroup.Implementation[],
    operation: BaseCombatantGroup.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: CombatantGroup.Implementation[],
    operation: BaseCombatantGroup.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: CombatantGroup.Implementation[],
    context: Document.ModificationContext<BaseCombatantGroup.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: CombatantGroup.Implementation[],
    context: Document.ModificationContext<BaseCombatantGroup.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: CombatantGroup.Implementation[],
    context: Document.ModificationContext<BaseCombatantGroup.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseCombatantGroup.Schema>;

  static override get schema(): SchemaField<BaseCombatantGroup.Schema>;

  static override validateJoint(data: BaseCombatantGroup.Source): void;

  static override fromSource(
    source: BaseCombatantGroup.CreateData,
    context?: DataModel.FromSourceOptions,
  ): CombatantGroup.Implementation;

  static override fromJSON(json: string): CombatantGroup.Implementation;
}

declare namespace BaseCombatantGroup {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = CombatantGroup.Name;
  export import ConstructionContext = CombatantGroup.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = CombatantGroup.ConstructorArgs;
  export import Hierarchy = CombatantGroup.Hierarchy;
  export import Metadata = CombatantGroup.Metadata;
  export import SubType = CombatantGroup.SubType;
  export import ConfiguredSubType = CombatantGroup.ConfiguredSubType;
  export import Known = CombatantGroup.Known;
  export import OfType = CombatantGroup.OfType;
  export import SystemOfType = CombatantGroup.SystemOfType;
  export import Parent = CombatantGroup.Parent;
  export import Descendant = CombatantGroup.Descendant;
  export import DescendantClass = CombatantGroup.DescendantClass;
  export import Embedded = CombatantGroup.Embedded;
  export import ParentCollectionName = CombatantGroup.ParentCollectionName;
  export import CollectionClass = CombatantGroup.CollectionClass;
  export import Collection = CombatantGroup.Collection;
  export import Invalid = CombatantGroup.Invalid;
  export import Stored = CombatantGroup.Stored;
  export import Source = CombatantGroup.Source;
  export import CreateData = CombatantGroup.CreateData;
  export import CreateInput = CombatantGroup.CreateInput;
  export import CreateReturn = CombatantGroup.CreateReturn;
  export import InitializedData = CombatantGroup.InitializedData;
  export import UpdateData = CombatantGroup.UpdateData;
  export import UpdateInput = CombatantGroup.UpdateInput;
  export import Schema = CombatantGroup.Schema;
  export import Database = CombatantGroup.Database;
  export import TemporaryIf = CombatantGroup.TemporaryIf;
  export import Flags = CombatantGroup.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `CombatantGroup` a name.
    // The expression `ClientDocumentMixin(BaseCombatantGroup)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseCombatantGroup> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends CombatantGroup.Schema {
    system: any;
  }
}

export default BaseCombatantGroup;

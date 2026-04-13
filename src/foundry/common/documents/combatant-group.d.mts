import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

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
   * You should use {@linkcode CombatantGroup.implementation | new CombatantGroup.implementation(...)} instead which will give you
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

  override readonly parentCollection: BaseCombatantGroup.ParentCollectionName | null;

  /** @privateRemarks Neither `CombatantGroup`s nor any of its ancestor document(s) can exist in compendia. */
  override get pack(): null;

  static override get implementation(): CombatantGroup.ImplementationClass;

  static override get baseDocument(): typeof BaseCombatantGroup;

  static override get collectionName(): BaseCombatantGroup.ParentCollectionName;

  static override get documentName(): BaseCombatantGroup.Name;

  static override get TYPES(): BaseCombatantGroup.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseCombatantGroup.Hierarchy;

  override system: BaseCombatantGroup.SystemOfType<SubType>;

  override parent: BaseCombatantGroup.Parent;

  override " fvtt_types_internal_document_parent": BaseCombatantGroup.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseCombatantGroup.CreateInput[],
    operation?: BaseCombatantGroup.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseCombatantGroup.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseCombatantGroup.UpdateInput[],
    operation?: BaseCombatantGroup.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<CombatantGroup.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseCombatantGroup.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<CombatantGroup.Stored>>;

  static override create<
    Data extends MaybeArray<BaseCombatantGroup.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseCombatantGroup.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseCombatantGroup.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseCombatantGroup.UpdateInput,
    operation?: BaseCombatantGroup.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseCombatantGroup.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  /**
   * @privateRemarks `CombatantGroup`s are neither {@link CONST.WORLD_DOCUMENT_TYPES | world documents} (and so have no
   * {@link foundry.Game.collections | world collection}) nor {@link CONST.COMPENDIUM_DOCUMENT_TYPES | compendium documents} (so there's no
   * chance of index entry return), so this always returns `null`
   */
  static override get(documentId: string, operation?: BaseCombatantGroup.Database.GetDocumentsOperation): null;

  /** @privateRemarks `CombatantGroup`s have no embedded collections, so this always returns `null` */
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseCombatantGroup.Flags.Scope, Key extends BaseCombatantGroup.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseCombatantGroup.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseCombatantGroup.Flags.Scope,
    Key extends BaseCombatantGroup.Flags.Key<Scope>,
    Value extends BaseCombatantGroup.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseCombatantGroup.Flags.Scope, Key extends BaseCombatantGroup.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseCombatantGroup.CreateData,
    options: BaseCombatantGroup.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseCombatantGroup.CreateData,
    options: BaseCombatantGroup.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: CombatantGroup.Implementation[],
    operation: BaseCombatantGroup.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: CombatantGroup.Stored[],
    operation: BaseCombatantGroup.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseCombatantGroup.UpdateData,
    options: BaseCombatantGroup.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseCombatantGroup.UpdateData,
    options: BaseCombatantGroup.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: CombatantGroup.Stored[],
    operation: BaseCombatantGroup.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: CombatantGroup.Stored[],
    operation: BaseCombatantGroup.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseCombatantGroup.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseCombatantGroup.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: CombatantGroup.Stored[],
    operation: BaseCombatantGroup.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: CombatantGroup.Stored[],
    operation: BaseCombatantGroup.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `CombatantGroup._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode CombatantGroup._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: CombatantGroup.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseCombatantGroup.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `CombatantGroup._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode CombatantGroup._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: CombatantGroup.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseCombatantGroup.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `CombatantGroup._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode CombatantGroup._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: CombatantGroup.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseCombatantGroup.Database.OnDeleteDocumentsOperation,
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

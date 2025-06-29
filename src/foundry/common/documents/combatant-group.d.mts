import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
  constructor(data: CombatantGroup.CreateData, context?: CombatantGroup.ConstructionContext);

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

  /* Document overrides */

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: CombatantGroup.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): CombatantGroup.ImplementationClass;

  static override get baseDocument(): typeof BaseCombatantGroup;

  static override get collectionName(): CombatantGroup.ParentCollectionName;

  static override get documentName(): CombatantGroup.Name;

  static override get TYPES(): BaseCombatantGroup.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): CombatantGroup.Hierarchy;

  override system: CombatantGroup.SystemOfType<SubType>;

  override parent: BaseCombatantGroup.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<CombatantGroup.Implementation | CombatantGroup.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<CombatantGroup.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<CombatantGroup.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: CombatantGroup.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<CombatantGroup.Database.Update>,
  ): Promise<CombatantGroup.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<CombatantGroup.Database.Delete>,
  ): Promise<CombatantGroup.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: CombatantGroup.CreateData | CombatantGroup.CreateData[],
    operation?: CombatantGroup.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<CombatantGroup.Implementation, Temporary> | undefined>;

  override update(
    data: CombatantGroup.UpdateData | undefined,
    operation?: CombatantGroup.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: CombatantGroup.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: CombatantGroup.Database.GetOptions,
  ): CombatantGroup.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends CombatantGroup.Flags.Scope, Key extends CombatantGroup.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<CombatantGroup.Name, Scope, Key>;

  override setFlag<
    Scope extends CombatantGroup.Flags.Scope,
    Key extends CombatantGroup.Flags.Key<Scope>,
    Value extends Document.GetFlag<CombatantGroup.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends CombatantGroup.Flags.Scope, Key extends CombatantGroup.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: CombatantGroup.CreateData,
    options: CombatantGroup.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: CombatantGroup.CreateData,
    options: CombatantGroup.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: CombatantGroup.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<CombatantGroup.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: CombatantGroup.Implementation[],
    operation: CombatantGroup.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: CombatantGroup.UpdateData,
    options: CombatantGroup.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: CombatantGroup.UpdateData,
    options: CombatantGroup.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: CombatantGroup.Implementation[],
    operation: CombatantGroup.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: CombatantGroup.Implementation[],
    operation: CombatantGroup.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: CombatantGroup.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: CombatantGroup.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: CombatantGroup.Implementation[],
    operation: CombatantGroup.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: CombatantGroup.Implementation[],
    operation: CombatantGroup.Database.Delete,
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
    documents: CombatantGroup.Implementation[],
    context: Document.ModificationContext<CombatantGroup.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: CombatantGroup.Implementation[],
    context: Document.ModificationContext<CombatantGroup.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: CombatantGroup.Implementation[],
    context: Document.ModificationContext<CombatantGroup.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<CombatantGroup.Schema>;

  static override get schema(): SchemaField<CombatantGroup.Schema>;

  static override validateJoint(data: CombatantGroup.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: CombatantGroup.CreateData,
    context?: DataModel.FromSourceOptions,
  ): CombatantGroup.Implementation;

  static override fromJSON(json: string): CombatantGroup.Implementation;
}

declare namespace BaseCombatantGroup {
  export import Name = CombatantGroup.Name;
  export import ConstructionContext = Item.ConstructionContext;
  export import ConstructorArgs = CombatantGroup.ConstructorArgs;
  export import Hierarchy = CombatantGroup.Hierarchy;
  export import Metadata = CombatantGroup.Metadata;
  export import SubType = CombatantGroup.SubType;
  export import ConfiguredSubTypes = CombatantGroup.ConfiguredSubTypes;
  export import Known = CombatantGroup.Known;
  export import OfType = CombatantGroup.OfType;
  export import SystemOfType = CombatantGroup.SystemOfType;
  export import Parent = CombatantGroup.Parent;
  export import Descendant = CombatantGroup.Descendant;
  export import DescendantClass = CombatantGroup.DescendantClass;
  export import Pack = CombatantGroup.Pack;
  export import Embedded = CombatantGroup.Embedded;
  export import ParentCollectionName = CombatantGroup.ParentCollectionName;
  export import CollectionClass = CombatantGroup.CollectionClass;
  export import Collection = CombatantGroup.Collection;
  export import Invalid = CombatantGroup.Invalid;
  export import Stored = CombatantGroup.Stored;
  export import Source = CombatantGroup.Source;
  export import CreateData = CombatantGroup.CreateData;
  export import InitializedData = CombatantGroup.InitializedData;
  export import UpdateData = CombatantGroup.UpdateData;
  export import Schema = CombatantGroup.Schema;
  export import DatabaseOperation = CombatantGroup.Database;
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

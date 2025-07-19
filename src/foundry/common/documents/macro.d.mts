import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.d.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Macro Document.
 * Defines the DataSchema and common behaviors for a Macro which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseMacro<out SubType extends BaseMacro.SubType = BaseMacro.SubType> extends Document<
  "Macro",
  BaseMacro.Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseMacro`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseMacro` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Macro.implementation | `new Macro.implementation(...)`} instead which will give you
   * a system specific implementation of `Macro`.
   */
  constructor(data: Macro.CreateData, context?: Macro.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Macro",
   *   collection: "macros",
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "img", "sort", "folder"],
   *   label: "DOCUMENT.Macro",
   *   labelPlural: "DOCUMENT.Macros",
   *   coreTypes: Object.values(CONST.MACRO_TYPES),
   *   permissions: {
   *     create: this.#canCreate,
   *     update: this.#canUpdate,
   *     delete: "OWNER"
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseMacro.Metadata;

  static override defineSchema(): BaseMacro.Schema;

  /** @defaultValue `["DOCUMENT", "MACRO"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The default icon used for newly created Macro documents.
   * @defaultValue `"icons/svg/dice-target.svg"`
   */
  static DEFAULT_ICON: string;

  protected override _initialize(options?: Document.InitializeOptions): void;

  /**
   * @remarks
   * Migrations:
   * - `flags.core.sourceId` to `_stats.compendiumSource` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /** @remarks `source` instead of the parent's `data` here */
  static override shimData(source: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @remarks
   * @throws If `data.command` doesn't pass {@link foundry.data.fields.JavaScriptField | `JavaScriptField`} validation
   */
  static override validateJoint(data: Macro.Source): void;

  /** @remarks Returns `user.hasRole("PLAYER")` */
  static override canUserCreate(user: User.Implementation): boolean;

  override getUserLevel(user?: User.Internal.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  protected override _preCreate(
    data: Macro.CreateData,
    options: Macro.Database.PreCreateOptions,
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

  override readonly parentCollection: Macro.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): Macro.ImplementationClass;

  static override get baseDocument(): typeof BaseMacro;

  static override get collectionName(): Macro.ParentCollectionName;

  static override get documentName(): Macro.Name;

  static override get TYPES(): BaseMacro.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): Macro.Hierarchy;

  override parent: BaseMacro.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<Macro.Implementation | Macro.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Macro.Database.Create<Temporary>>,
  ): Promise<Array<Macro.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: Macro.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Macro.Database.Update>,
  ): Promise<Macro.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Macro.Database.Delete>,
  ): Promise<Macro.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: Macro.CreateData | Macro.CreateData[],
    operation?: Macro.Database.CreateOperation<Temporary>,
  ): Promise<Macro.TemporaryIf<Temporary> | undefined>;

  override update(
    data: Macro.UpdateData | undefined,
    operation?: Macro.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Macro.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Macro.Database.GetOptions): Macro.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends Macro.Flags.Scope, Key extends Macro.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Macro.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends Macro.Flags.Scope,
    Key extends Macro.Flags.Key<Scope>,
    Value extends Macro.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Macro.Flags.Scope, Key extends Macro.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _onCreate(data: Macro.CreateData, options: Macro.Database.OnCreateOperation, userId: string): void;

  protected static override _preCreateOperation(
    documents: Macro.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Macro.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Macro.Implementation[],
    operation: Macro.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: Macro.UpdateData,
    options: Macro.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: Macro.UpdateData,
    options: Macro.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Macro.Implementation[],
    operation: Macro.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Macro.Implementation[],
    operation: Macro.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: Macro.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: Macro.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Macro.Implementation[],
    operation: Macro.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Macro.Implementation[],
    operation: Macro.Database.Delete,
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
    documents: Macro.Implementation[],
    context: Document.ModificationContext<Macro.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: Macro.Implementation[],
    context: Document.ModificationContext<Macro.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: Macro.Implementation[],
    context: Document.ModificationContext<Macro.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<Macro.Schema>;

  static override get schema(): SchemaField<Macro.Schema>;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(source: Macro.CreateData, context?: DataModel.FromSourceOptions): Macro.Implementation;

  static override fromJSON(json: string): Macro.Implementation;

  static #BaseMacro: true;
}
export default BaseMacro;

declare namespace BaseMacro {
  export import Name = Macro.Name;
  export import ConstructionContext = Macro.ConstructionContext;
  export import ConstructorArgs = Macro.ConstructorArgs;
  export import Hierarchy = Macro.Hierarchy;
  export import Metadata = Macro.Metadata;
  export import SubType = Macro.SubType;
  export import ConfiguredSubType = Macro.ConfiguredSubType;
  export import Known = Macro.Known;
  export import OfType = Macro.OfType;
  export import Parent = Macro.Parent;
  export import Descendant = Macro.Descendant;
  export import DescendantClass = Macro.DescendantClass;
  export import Pack = Macro.Pack;
  export import Embedded = Macro.Embedded;
  export import ParentCollectionName = Macro.ParentCollectionName;
  export import CollectionClass = Macro.CollectionClass;
  export import Collection = Macro.Collection;
  export import Invalid = Macro.Invalid;
  export import Stored = Macro.Stored;
  export import Source = Macro.Source;
  export import CreateData = Macro.CreateData;
  export import InitializedData = Macro.InitializedData;
  export import UpdateData = Macro.UpdateData;
  export import Schema = Macro.Schema;
  export import Database = Macro.Database;
  export import TemporaryIf = Macro.TemporaryIf;
  export import Flags = Macro.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Macro` a name.
    // The expression `ClientDocumentMixin(BaseMacro)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseMacro> {}
    const ClientDocument: ClientDocument;
  }
}

import type { AnyMutableObject, MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

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
   * You should use {@linkcode Macro.implementation | new Macro.implementation(...)} instead which will give you
   * a system specific implementation of `Macro`.
   */
  constructor(data: BaseMacro.CreateData, context?: BaseMacro.ConstructionContext);

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
   * @throws If `data.command` doesn't pass {@linkcode foundry.data.fields.JavaScriptField | JavaScriptField} validation
   */
  static override validateJoint(data: BaseMacro.Source): void;

  /** @remarks Returns `user.hasRole("PLAYER")` */
  static override canUserCreate(user: User.Implementation): boolean;

  override getUserLevel(user?: User.Internal.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  protected override _preCreate(
    data: BaseMacro.CreateData,
    options: BaseMacro.Database.PreCreateOptions,
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

  override readonly parentCollection: BaseMacro.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Macro.ImplementationClass;

  static override get baseDocument(): typeof BaseMacro;

  static override get collectionName(): BaseMacro.ParentCollectionName;

  static override get documentName(): BaseMacro.Name;

  static override get TYPES(): BaseMacro.SubType[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseMacro.Hierarchy;

  override parent: BaseMacro.Parent;

  override " fvtt_types_internal_document_parent": BaseMacro.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseMacro.CreateInput[],
    operation?: Document.Database.CreateOperation<BaseMacro.Database.Create<Temporary>>,
  ): Promise<Array<BaseMacro.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseMacro.UpdateInput[],
    operation?: Document.Database.UpdateDocumentsOperation<BaseMacro.Database.Update>,
  ): Promise<Array<Macro.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: Document.Database.DeleteDocumentsOperation<BaseMacro.Database.Delete>,
  ): Promise<Array<Macro.Stored>>;

  static override create<
    Data extends MaybeArray<BaseMacro.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseMacro.Database.CreateOperation<Temporary>,
  ): Promise<BaseMacro.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseMacro.UpdateInput,
    operation?: BaseMacro.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseMacro.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    operation?: BaseMacro.Database.GetOptions,
  ): Macro.Stored | CompendiumCollection.IndexEntry<"Macro"> | null;

  // `Macro`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseMacro.Flags.Scope, Key extends BaseMacro.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseMacro.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseMacro.Flags.Scope,
    Key extends BaseMacro.Flags.Key<Scope>,
    Value extends BaseMacro.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseMacro.Flags.Scope, Key extends BaseMacro.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _onCreate(
    data: BaseMacro.CreateData,
    options: BaseMacro.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Macro.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseMacro.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Macro.Stored[],
    operation: BaseMacro.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseMacro.UpdateData,
    options: BaseMacro.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseMacro.UpdateData,
    options: BaseMacro.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Macro.Stored[],
    operation: BaseMacro.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Macro.Stored[],
    operation: BaseMacro.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseMacro.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseMacro.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Macro.Stored[],
    operation: BaseMacro.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Macro.Stored[],
    operation: BaseMacro.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated "The `Macro._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode Macro._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Macro.Implementation[],
    context: BaseMacro.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Macro._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode Macro._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Macro.Stored[],
    context: BaseMacro.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Macro._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode Macro._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Macro.Stored[],
    context: BaseMacro.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseMacro.Schema>;

  static override get schema(): SchemaField<BaseMacro.Schema>;

  static override fromSource(source: BaseMacro.CreateData, context?: DataModel.FromSourceOptions): Macro.Implementation;

  static override fromJSON(json: string): Macro.Implementation;

  static #BaseMacro: true;
}

export default BaseMacro;

declare namespace BaseMacro {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Macro.Name;
  export import ConstructionContext = Macro.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Macro.ConstructorArgs;
  export import Hierarchy = Macro.Hierarchy;
  export import Metadata = Macro.Metadata;
  export import SubType = Macro.SubType;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConfiguredSubType = Macro.ConfiguredSubType; // not globally deprecated, Macro has no types
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Known = Macro.Known; // not globally deprecated, Macro has no types
  export import OfType = Macro.OfType;
  export import Parent = Macro.Parent;
  export import Descendant = Macro.Descendant;
  export import DescendantClass = Macro.DescendantClass;
  export import Embedded = Macro.Embedded;
  export import ParentCollectionName = Macro.ParentCollectionName;
  export import CollectionClass = Macro.CollectionClass;
  export import Collection = Macro.Collection;
  export import Invalid = Macro.Invalid;
  export import Source = Macro.Source;
  export import CreateData = Macro.CreateData;
  export import CreateInput = Macro.CreateInput;
  export import CreateReturn = Macro.CreateReturn;
  export import InitializedData = Macro.InitializedData;
  export import UpdateData = Macro.UpdateData;
  export import UpdateInput = Macro.UpdateInput;
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

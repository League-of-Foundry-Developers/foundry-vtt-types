import type { AnyMutableObject, MaybeArray } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.d.mts";
import type { SchemaField } from "../data/fields.d.mts";

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

  /**
   * @remarks Only calls {@linkcode foundry.data.fields.DocumentStatsField._shimData | DocumentStatsField._shimData} and
   * {@linkcode DataModel.shimData | super.shimData}.
   */
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

  type: SubType;

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

  override readonly parentCollection: BaseMacro.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): BaseMacro.ImplementationClass;

  static override get baseDocument(): typeof BaseMacro;

  static override get collectionName(): BaseMacro.ParentCollectionName;

  static override get documentName(): BaseMacro.Name;

  static override get TYPES(): BaseMacro.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): BaseMacro.Hierarchy;

  override parent: BaseMacro.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseMacro.CreateInput[],
    operation?: BaseMacro.Database2.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<Macro.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseMacro.UpdateInput[],
    operation?: BaseMacro.Database2.UpdateManyDocumentsOperation,
  ): Promise<Array<BaseMacro.Implementation>>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: BaseMacro.Database2.DeleteManyDocumentsOperation,
  ): Promise<Array<BaseMacro.Implementation>>;

  static override create<Data extends MaybeArray<Macro.CreateInput>, Temporary extends boolean | undefined = undefined>(
    data: Data,
    operation?: BaseMacro.Database2.CreateDocumentsOperation<Temporary>,
  ): Promise<Macro.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseMacro.UpdateInput,
    operation?: BaseMacro.Database2.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseMacro.Database2.DeleteOneDocumentOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: BaseMacro.Database2.GetDocumentsOperation,
  ): BaseMacro.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends Macro.Flags.Scope, Key extends Macro.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseMacro.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends Macro.Flags.Scope,
    Key extends Macro.Flags.Key<Scope>,
    Value extends Macro.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends Macro.Flags.Scope, Key extends Macro.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _onCreate(
    data: BaseMacro.CreateData,
    options: BaseMacro.Database2.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: BaseMacro.Implementation[],
    operation: BaseMacro.Database2.PreCreateOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: BaseMacro.Stored[],
    operation: BaseMacro.Database2.OnCreateOperation,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseMacro.UpdateData,
    options: BaseMacro.Database2.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseMacro.UpdateData,
    options: BaseMacro.Database2.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: BaseMacro.Stored[],
    operation: BaseMacro.Database2.PreUpdateOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: BaseMacro.Stored[],
    operation: BaseMacro.Database2.OnUpdateOperation,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseMacro.Database2.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseMacro.Database2.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: BaseMacro.Stored[],
    operation: BaseMacro.Database2.PreDeleteOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: BaseMacro.Stored[],
    operation: BaseMacro.Database2.OnDeleteOperation,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation}"
   * (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: BaseMacro.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseMacro.Database2.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation}"
   * (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: BaseMacro.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseMacro.Database2.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation}"
   * (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: BaseMacro.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseMacro.Database2.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<Macro.Schema>;

  static override get schema(): SchemaField<Macro.Schema>;

  static override fromSource(
    source: BaseMacro.CreateData,
    context?: DataModel.FromSourceOptions,
  ): BaseMacro.Implementation;

  static override fromJSON(json: string): BaseMacro.Implementation;

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
  export import Implementation = Macro.Implementation;
  export import ImplementationClass = Macro.ImplementationClass;
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
  export import Pack = Macro.Pack;
  export import Embedded = Macro.Embedded;
  export import ParentCollectionName = Macro.ParentCollectionName;
  export import CollectionClass = Macro.CollectionClass;
  export import Collection = Macro.Collection;
  export import Invalid = Macro.Invalid;
  export import Stored = Macro.Stored;
  export import Source = Macro.Source;
  export import CreateData = Macro.CreateData;
  export import CreateInput = Macro.CreateInput;
  export import CreateReturn = Macro.CreateReturn;
  export import InitializedData = Macro.InitializedData;
  export import UpdateData = Macro.UpdateData;
  export import UpdateInput = Macro.UpdateInput;
  export import Schema = Macro.Schema;
  export import Database = Macro.Database;
  export import Database2 = Macro.Database2;
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

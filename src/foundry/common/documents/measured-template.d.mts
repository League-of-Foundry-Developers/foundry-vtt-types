import type { AnyMutableObject, MaybeArray } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for a MeasuredTemplate.
 * Defines the DataSchema and common behaviors for a MeasuredTemplate which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseMeasuredTemplate extends Document<"MeasuredTemplate", BaseMeasuredTemplate.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseMeasuredTemplate`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseMeasuredTemplate` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link MeasuredTemplateDocument.implementation | `new MeasuredTemplateDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `MeasuredTemplateDocument`.
   */
  constructor(data?: BaseMeasuredTemplate.CreateData, context?: BaseMeasuredTemplate.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "MeasuredTemplate",
   *   collection: "templates",
   *   label: "DOCUMENT.MeasuredTemplate",
   *   labelPlural: "DOCUMENT.MeasuredTemplates",
   *   isEmbedded: true,
   *   permissions: {
   *     create: this.#canCreate,
   *     delete: "OWNER"
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseMeasuredTemplate.Metadata;

  static override defineSchema(): BaseMeasuredTemplate.Schema;

  /** @defaultValue `["DOCUMENT", "TEMPLATE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * @remarks
   * Migrations:
   * - `user` to `author` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `user` to `author` (since v12, until v14)
   */
  // options: not null (destructured)
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated "You are accessing `user` which has been migrated to `author`" (since v12, until 14)
   */
  get user(): this["author"];

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

  override readonly parentCollection: BaseMeasuredTemplate.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): MeasuredTemplateDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseMeasuredTemplate;

  static override get collectionName(): BaseMeasuredTemplate.ParentCollectionName;

  static override get documentName(): BaseMeasuredTemplate.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseMeasuredTemplate.Hierarchy;

  override parent: BaseMeasuredTemplate.Parent;

  override " fvtt_types_internal_document_parent": BaseMeasuredTemplate.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseMeasuredTemplate.CreateInput[],
    operation?: BaseMeasuredTemplate.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseMeasuredTemplate.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseMeasuredTemplate.UpdateInput[],
    operation?: BaseMeasuredTemplate.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<MeasuredTemplateDocument.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseMeasuredTemplate.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<MeasuredTemplateDocument.Stored>>;

  static override create<
    Data extends MaybeArray<BaseMeasuredTemplate.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseMeasuredTemplate.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseMeasuredTemplate.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseMeasuredTemplate.UpdateInput,
    operation?: BaseMeasuredTemplate.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseMeasuredTemplate.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  /**
   * @privateRemarks `MeasuredTemplateDocument`s are neither {@link CONST.WORLD_DOCUMENT_TYPES | world documents} (and so have no
   * {@link foundry.Game.collections | world collection}) nor {@link CONST.COMPENDIUM_DOCUMENT_TYPES | compendium documents} (so there's no
   * chance of index entry return), so this always returns `null`
   */
  static override get(documentId: string, operation?: BaseMeasuredTemplate.Database.GetDocumentsOperation): null;

  /** @privateRemarks `MeasuredTemplateDocument`s have no embedded collections, so this always returns `null` */
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseMeasuredTemplate.Flags.Scope, Key extends BaseMeasuredTemplate.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseMeasuredTemplate.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseMeasuredTemplate.Flags.Scope,
    Key extends BaseMeasuredTemplate.Flags.Key<Scope>,
    Value extends BaseMeasuredTemplate.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseMeasuredTemplate.Flags.Scope, Key extends BaseMeasuredTemplate.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseMeasuredTemplate.CreateData,
    options: BaseMeasuredTemplate.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseMeasuredTemplate.CreateData,
    options: BaseMeasuredTemplate.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: BaseMeasuredTemplate.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: MeasuredTemplateDocument.Stored[],
    operation: BaseMeasuredTemplate.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseMeasuredTemplate.UpdateData,
    options: BaseMeasuredTemplate.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseMeasuredTemplate.UpdateData,
    options: BaseMeasuredTemplate.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: MeasuredTemplateDocument.Stored[],
    operation: BaseMeasuredTemplate.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: MeasuredTemplateDocument.Stored[],
    operation: BaseMeasuredTemplate.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseMeasuredTemplate.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseMeasuredTemplate.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: MeasuredTemplateDocument.Stored[],
    operation: BaseMeasuredTemplate.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: MeasuredTemplateDocument.Stored[],
    operation: BaseMeasuredTemplate.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation}"
   * (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: MeasuredTemplateDocument.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseMeasuredTemplate.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation}"
   * (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: MeasuredTemplateDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseMeasuredTemplate.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation}"
   * (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: MeasuredTemplateDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseMeasuredTemplate.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseMeasuredTemplate.Schema>;

  static override get schema(): SchemaField<BaseMeasuredTemplate.Schema>;

  static override validateJoint(data: BaseMeasuredTemplate.Source): void;

  static override fromSource(
    source: BaseMeasuredTemplate.CreateData,
    context?: DataModel.FromSourceOptions,
  ): MeasuredTemplateDocument.Implementation;

  static override fromJSON(json: string): MeasuredTemplateDocument.Implementation;

  static #BaseMeasuredTemplate: true;
}

export default BaseMeasuredTemplate;

declare namespace BaseMeasuredTemplate {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = MeasuredTemplateDocument.Name;
  export import ConstructionContext = MeasuredTemplateDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = MeasuredTemplateDocument.ConstructorArgs;
  export import Hierarchy = MeasuredTemplateDocument.Hierarchy;
  export import Metadata = MeasuredTemplateDocument.Metadata;
  export import Parent = MeasuredTemplateDocument.Parent;
  export import Descendant = MeasuredTemplateDocument.Descendant;
  export import DescendantClass = MeasuredTemplateDocument.DescendantClass;
  export import Embedded = MeasuredTemplateDocument.Embedded;
  export import ParentCollectionName = MeasuredTemplateDocument.ParentCollectionName;
  export import CollectionClass = MeasuredTemplateDocument.CollectionClass;
  export import Collection = MeasuredTemplateDocument.Collection;
  export import Invalid = MeasuredTemplateDocument.Invalid;
  export import Source = MeasuredTemplateDocument.Source;
  export import CreateData = MeasuredTemplateDocument.CreateData;
  export import CreateInput = MeasuredTemplateDocument.CreateInput;
  export import CreateReturn = MeasuredTemplateDocument.CreateReturn;
  export import InitializedData = MeasuredTemplateDocument.InitializedData;
  export import UpdateData = MeasuredTemplateDocument.UpdateData;
  export import UpdateInput = MeasuredTemplateDocument.UpdateInput;
  export import Schema = MeasuredTemplateDocument.Schema;
  export import Database = MeasuredTemplateDocument.Database;
  export import TemporaryIf = MeasuredTemplateDocument.TemporaryIf;
  export import Flags = MeasuredTemplateDocument.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `MeasuredTemplateDocument` a name.
    // The expression `CanvasDocumentMixin(BaseMeasuredTemplate)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseMeasuredTemplate> {}
    const CanvasDocument: CanvasDocument;
  }
}

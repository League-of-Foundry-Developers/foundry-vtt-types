import type { AnyMutableObject } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

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
   * You should use {@linkcode MeasuredTemplateDocument.implementation | new MeasuredTemplateDocument.implementation(...)} instead which will give you
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

  override getUserLevel(user?: User.Internal.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

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
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated since v12, until 14
   * @remarks "You are accessing `user` which has been migrated to `author`"
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
    data: Array<MeasuredTemplateDocument.Implementation | BaseMeasuredTemplate.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseMeasuredTemplate.Database.Create<Temporary>>,
  ): Promise<Array<BaseMeasuredTemplate.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseMeasuredTemplate.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseMeasuredTemplate.Database.Update>,
  ): Promise<MeasuredTemplateDocument.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseMeasuredTemplate.Database.Delete>,
  ): Promise<MeasuredTemplateDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseMeasuredTemplate.CreateData | BaseMeasuredTemplate.CreateData[],
    operation?: BaseMeasuredTemplate.Database.CreateOperation<Temporary>,
  ): Promise<BaseMeasuredTemplate.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseMeasuredTemplate.UpdateData | undefined,
    operation?: BaseMeasuredTemplate.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseMeasuredTemplate.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: BaseMeasuredTemplate.Database.GetOptions,
  ): MeasuredTemplateDocument.Implementation | null;

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
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseMeasuredTemplate.CreateData,
    options: BaseMeasuredTemplate.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseMeasuredTemplate.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: BaseMeasuredTemplate.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseMeasuredTemplate.UpdateData,
    options: BaseMeasuredTemplate.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseMeasuredTemplate.UpdateData,
    options: BaseMeasuredTemplate.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: BaseMeasuredTemplate.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: BaseMeasuredTemplate.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseMeasuredTemplate.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseMeasuredTemplate.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: BaseMeasuredTemplate.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: BaseMeasuredTemplate.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated "The `MeasuredTemplateDocument._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode MeasuredTemplateDocument._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: MeasuredTemplateDocument.Implementation[],
    context: BaseMeasuredTemplate.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `MeasuredTemplateDocument._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode MeasuredTemplateDocument._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: MeasuredTemplateDocument.Stored[],
    context: BaseMeasuredTemplate.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `MeasuredTemplateDocument._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode MeasuredTemplateDocument._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: MeasuredTemplateDocument.Stored[],
    context: BaseMeasuredTemplate.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

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
  export import Stored = MeasuredTemplateDocument.Stored;
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

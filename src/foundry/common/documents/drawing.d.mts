import type { AnyMutableObject, MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The Document definition for a Drawing.
 * Defines the DataSchema and common behaviors for a Drawing which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseDrawing extends Document<"Drawing", BaseDrawing.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseDrawing`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseDrawing` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode DrawingDocument.implementation | new DrawingDocument.implementation(...)} instead which will give you
   * a system specific implementation of `DrawingDocument`.
   */
  // Note(LukeAbby): Required because while `DrawingDocument` has no directly required schema
  // properties the `validateJoint` method will fail.
  constructor(data: BaseDrawing.CreateData, context?: BaseDrawing.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Drawing",
   *   collection: "drawings",
   *   label: "DOCUMENT.Drawing",
   *   labelPlural: "DOCUMENT.Drawings",
   *   isEmbedded: true,
   *   permissions: {
   *     create: this.#canCreate,
   *     delete: "OWNER"
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseDrawing.Metadata;

  /** @defaultValue `["DOCUMENT", "DRAWING"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): BaseDrawing.Schema;

  /**
   * Validate whether the drawing has some visible content (as required by validation).
   */
  protected static _validateVisibleContent(data: DrawingDocument.ValidateVisibleContentData): boolean;

  /**
   * @remarks
   * @throws If `data` fails `BaseDrawing.#validateVisibleContent` validation (must have some visible text, fill, *or* line)
   */
  static override validateJoint(data: BaseDrawing.Source): void;

  static override canUserCreate(user: User.Implementation): boolean;

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * @remarks
   * Migrations:
   * - `z` to `elevation` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `z` to `elevation` (since v12, until v14)
   */
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated since v12, until v14
   * @remarks "You are accessing `z` which has been migrated to `elevation`"
   */
  get z(): this["elevation"];

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  override readonly parentCollection: BaseDrawing.ParentCollectionName | null;

  static override get implementation(): DrawingDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseDrawing;

  static override get collectionName(): BaseDrawing.ParentCollectionName;

  static override get documentName(): BaseDrawing.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseDrawing.Hierarchy;

  override parent: BaseDrawing.Parent;

  override " fvtt_types_internal_document_parent": BaseDrawing.Parent;

  // `canUserCreate` omitted from template due to actual override above.

  // `getUserLevel` omitted from template due to actual override above.

  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  override canUserModify<Action extends Document.Database.OperationAction>(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<"Drawing", Action>,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseDrawing.CreateInput[],
    operation?: Document.Database.CreateOperation<BaseDrawing.Database.Create<Temporary>>,
  ): Promise<Array<BaseDrawing.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseDrawing.UpdateInput[],
    operation?: Document.Database.UpdateDocumentsOperation<BaseDrawing.Database.Update>,
  ): Promise<Array<DrawingDocument.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: Document.Database.DeleteDocumentsOperation<BaseDrawing.Database.Delete>,
  ): Promise<Array<DrawingDocument.Stored>>;

  static override create<
    Data extends MaybeArray<BaseDrawing.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseDrawing.Database.CreateOperation<Temporary>,
  ): Promise<BaseDrawing.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseDrawing.UpdateInput,
    operation?: BaseDrawing.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseDrawing.Database.DeleteOperation): Promise<this | undefined>;

  // `DrawingDocument`s are neither world documents nor compendium documents, so this always returns `null`.
  static override get(documentId: string, operation?: BaseDrawing.Database.GetOptions): null;

  // `DrawingDocument`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseDrawing.Flags.Scope, Key extends BaseDrawing.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseDrawing.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseDrawing.Flags.Scope,
    Key extends BaseDrawing.Flags.Key<Scope>,
    Value extends BaseDrawing.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseDrawing.Flags.Scope, Key extends BaseDrawing.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseDrawing.CreateData,
    options: BaseDrawing.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseDrawing.CreateData,
    options: BaseDrawing.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: DrawingDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseDrawing.Database.Create>,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: DrawingDocument.Stored[],
    operation: BaseDrawing.Database.Create,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseDrawing.UpdateData,
    options: BaseDrawing.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseDrawing.UpdateData,
    options: BaseDrawing.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: DrawingDocument.Stored[],
    operation: BaseDrawing.Database.Update,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: DrawingDocument.Stored[],
    operation: BaseDrawing.Database.Update,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseDrawing.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseDrawing.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: DrawingDocument.Stored[],
    operation: BaseDrawing.Database.Delete,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: DrawingDocument.Stored[],
    operation: BaseDrawing.Database.Delete,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `DrawingDocument._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode DrawingDocument._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: DrawingDocument.Implementation[],
    context: BaseDrawing.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `DrawingDocument._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode DrawingDocument._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: DrawingDocument.Stored[],
    context: BaseDrawing.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `DrawingDocument._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode DrawingDocument._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: DrawingDocument.Stored[],
    context: BaseDrawing.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseDrawing.Schema>;

  static override get schema(): SchemaField<BaseDrawing.Schema>;

  static override fromSource(
    source: BaseDrawing.CreateData,
    context?: DataModel.FromSourceOptions,
  ): DrawingDocument.Implementation;

  static override fromJSON(json: string): DrawingDocument.Implementation;

  static #BaseDrawing: true;
}

export default BaseDrawing;

declare namespace BaseDrawing {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = DrawingDocument.Name;
  export import ConstructionContext = DrawingDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = DrawingDocument.ConstructorArgs;
  export import Hierarchy = DrawingDocument.Hierarchy;
  export import Metadata = DrawingDocument.Metadata;
  export import Parent = DrawingDocument.Parent;
  export import Descendant = DrawingDocument.Descendant;
  export import DescendantClass = DrawingDocument.DescendantClass;
  export import Embedded = DrawingDocument.Embedded;
  export import ParentCollectionName = DrawingDocument.ParentCollectionName;
  export import CollectionClass = DrawingDocument.CollectionClass;
  export import Collection = DrawingDocument.Collection;
  export import Invalid = DrawingDocument.Invalid;
  export import Source = DrawingDocument.Source;
  export import CreateData = DrawingDocument.CreateData;
  export import CreateInput = DrawingDocument.CreateInput;
  export import CreateReturn = DrawingDocument.CreateReturn;
  export import InitializedData = DrawingDocument.InitializedData;
  export import UpdateData = DrawingDocument.UpdateData;
  export import UpdateInput = DrawingDocument.UpdateInput;
  export import Schema = DrawingDocument.Schema;
  export import Database = DrawingDocument.Database;
  export import TemporaryIf = DrawingDocument.TemporaryIf;
  export import Flags = DrawingDocument.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `DrawingDocument` a name.
    // The expression `CanvasDocumentMixin(BaseDrawing)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseDrawing> {}
    const CanvasDocument: CanvasDocument;
  }
}

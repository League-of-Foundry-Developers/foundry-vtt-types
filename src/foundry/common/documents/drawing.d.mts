import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * You should use {@link DrawingDocument.implementation | `new DrawingDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `DrawingDocument`.
   */
  constructor(data: DrawingDocument.CreateData, context?: DrawingDocument.ConstructionContext);

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
  static override validateJoint(data: DrawingDocument.Source): void;

  /** @remarks Returns `user.hasPermission("DRAWING_CREATE")` */
  static override canUserCreate(user: User.Implementation): boolean;

  override getUserLevel(user?: User.Internal.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

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
  // options: not null (destructured)
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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: DrawingDocument.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): DrawingDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseDrawing;

  static override get collectionName(): DrawingDocument.ParentCollectionName;

  static override get documentName(): DrawingDocument.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): DrawingDocument.Hierarchy;

  override parent: DrawingDocument.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<DrawingDocument.Implementation | DrawingDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<DrawingDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<DrawingDocument.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: DrawingDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<DrawingDocument.Database.Update>,
  ): Promise<DrawingDocument.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<DrawingDocument.Database.Delete>,
  ): Promise<DrawingDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: DrawingDocument.CreateData | DrawingDocument.CreateData[],
    operation?: DrawingDocument.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<DrawingDocument.Implementation, Temporary> | undefined>;

  override update(
    data: DrawingDocument.UpdateData | undefined,
    operation?: DrawingDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: DrawingDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: DrawingDocument.Database.GetOptions,
  ): DrawingDocument.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends DrawingDocument.Flags.Scope, Key extends DrawingDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<DrawingDocument.Name, Scope, Key>;

  override setFlag<
    Scope extends DrawingDocument.Flags.Scope,
    Key extends DrawingDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<DrawingDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends DrawingDocument.Flags.Scope, Key extends DrawingDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: DrawingDocument.CreateData,
    options: DrawingDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: DrawingDocument.CreateData,
    options: DrawingDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: DrawingDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<DrawingDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: DrawingDocument.Implementation[],
    operation: DrawingDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: DrawingDocument.UpdateData,
    options: DrawingDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: DrawingDocument.UpdateData,
    options: DrawingDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: DrawingDocument.Implementation[],
    operation: DrawingDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: DrawingDocument.Implementation[],
    operation: DrawingDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: DrawingDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: DrawingDocument.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: DrawingDocument.Implementation[],
    operation: DrawingDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: DrawingDocument.Implementation[],
    operation: DrawingDocument.Database.Delete,
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
    documents: DrawingDocument.Implementation[],
    context: Document.ModificationContext<DrawingDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: DrawingDocument.Implementation[],
    context: Document.ModificationContext<DrawingDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: DrawingDocument.Implementation[],
    context: Document.ModificationContext<DrawingDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<DrawingDocument.Schema>;

  static override get schema(): SchemaField<DrawingDocument.Schema>;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: DrawingDocument.CreateData,
    context?: DataModel.FromSourceOptions,
  ): DrawingDocument.Implementation;

  static override fromJSON(json: string): DrawingDocument.Implementation;

  static #BaseDrawing: true;
}

export default BaseDrawing;

declare namespace BaseDrawing {
  export import Name = DrawingDocument.Name;
  export import ConstructionContext = DrawingDocument.ConstructionContext;
  export import ConstructorArgs = DrawingDocument.ConstructorArgs;
  export import Hierarchy = DrawingDocument.Hierarchy;
  export import Metadata = DrawingDocument.Metadata;
  export import Parent = DrawingDocument.Parent;
  export import Descendant = DrawingDocument.Descendant;
  export import DescendantClass = DrawingDocument.DescendantClass;
  export import Pack = DrawingDocument.Pack;
  export import Embedded = DrawingDocument.Embedded;
  export import ParentCollectionName = DrawingDocument.ParentCollectionName;
  export import CollectionClass = DrawingDocument.CollectionClass;
  export import Collection = DrawingDocument.Collection;
  export import Invalid = DrawingDocument.Invalid;
  export import Stored = DrawingDocument.Stored;
  export import Source = DrawingDocument.Source;
  export import CreateData = DrawingDocument.CreateData;
  export import InitializedData = DrawingDocument.InitializedData;
  export import UpdateData = DrawingDocument.UpdateData;
  export import Schema = DrawingDocument.Schema;
  export import DatabaseOperation = DrawingDocument.Database;
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

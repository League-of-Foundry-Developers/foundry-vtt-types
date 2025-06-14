import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Document definition for an AmbientLight.
 * Defines the DataSchema and common behaviors for an AmbientLight which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseAmbientLight extends Document<"AmbientLight", BaseAmbientLight.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseAmbientLight`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseAmbientLight` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link AmbientLightDocument.implementation | `new AmbientLightDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `AmbientLightDocument`.
   */
  constructor(...args: AmbientLightDocument.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "AmbientLight",
   *   collection: "lights",
   *   label: "DOCUMENT.AmbientLight",
   *   labelPlural: "DOCUMENT.AmbientLights",
   *   schemaVersion: "13.341",
   * })
   * ```
   */
  static override metadata: BaseAmbientLight.Metadata;

  static override defineSchema(): BaseAmbientLight.Schema;

  /** @defaultValue `["DOCUMENT", "AMBIENT_LIGHT"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: AmbientLightDocument.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): AmbientLightDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseAmbientLight;

  static override get collectionName(): AmbientLightDocument.ParentCollectionName;

  static override get documentName(): AmbientLightDocument.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): AmbientLightDocument.Hierarchy;

  override parent: BaseAmbientLight.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<AmbientLightDocument.Implementation | AmbientLightDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<AmbientLightDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<AmbientLightDocument.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: AmbientLightDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<AmbientLightDocument.Database.Update>,
  ): Promise<AmbientLightDocument.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<AmbientLightDocument.Database.Delete>,
  ): Promise<AmbientLightDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: AmbientLightDocument.CreateData | AmbientLightDocument.CreateData[],
    operation?: AmbientLightDocument.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<AmbientLightDocument.Implementation, Temporary> | undefined>;

  override update(
    data: AmbientLightDocument.UpdateData | undefined,
    operation?: AmbientLightDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: AmbientLightDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: AmbientLightDocument.Database.GetOptions,
  ): AmbientLightDocument.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends AmbientLightDocument.Flags.Scope, Key extends AmbientLightDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<AmbientLightDocument.Name, Scope, Key>;

  override setFlag<
    Scope extends AmbientLightDocument.Flags.Scope,
    Key extends AmbientLightDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<AmbientLightDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends AmbientLightDocument.Flags.Scope, Key extends AmbientLightDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: AmbientLightDocument.CreateData,
    options: AmbientLightDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: AmbientLightDocument.CreateData,
    options: AmbientLightDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<AmbientLightDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: AmbientLightDocument.UpdateData,
    options: AmbientLightDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: AmbientLightDocument.UpdateData,
    options: AmbientLightDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: AmbientLightDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: AmbientLightDocument.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.Database.Delete,
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
    documents: AmbientLightDocument.Implementation[],
    context: Document.ModificationContext<AmbientLightDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: AmbientLightDocument.Implementation[],
    context: Document.ModificationContext<AmbientLightDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: AmbientLightDocument.Implementation[],
    context: Document.ModificationContext<AmbientLightDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<AmbientLightDocument.Schema>;

  static override get schema(): SchemaField<AmbientLightDocument.Schema>;

  static override validateJoint(data: AmbientLightDocument.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: AmbientLightDocument.CreateData,
    context?: DataModel.FromSourceOptions,
  ): AmbientLightDocument.Implementation;

  static override fromJSON(json: string): AmbientLightDocument.Implementation;
}

export default BaseAmbientLight;

declare namespace BaseAmbientLight {
  export import Name = AmbientLightDocument.Name;
  export import ConstructorArgs = AmbientLightDocument.ConstructorArgs;
  export import Hierarchy = AmbientLightDocument.Hierarchy;
  export import Metadata = AmbientLightDocument.Metadata;
  export import Parent = AmbientLightDocument.Parent;
  export import Descendant = AmbientLightDocument.Descendant;
  export import DescendantClass = AmbientLightDocument.DescendantClass;
  export import Pack = AmbientLightDocument.Pack;
  export import Embedded = AmbientLightDocument.Embedded;
  export import ParentCollectionName = AmbientLightDocument.ParentCollectionName;
  export import CollectionClass = AmbientLightDocument.CollectionClass;
  export import Collection = AmbientLightDocument.Collection;
  export import Invalid = AmbientLightDocument.Invalid;
  export import Stored = AmbientLightDocument.Stored;
  export import Source = AmbientLightDocument.Source;
  export import CreateData = AmbientLightDocument.CreateData;
  export import InitializedData = AmbientLightDocument.InitializedData;
  export import UpdateData = AmbientLightDocument.UpdateData;
  export import Schema = AmbientLightDocument.Schema;
  export import DatabaseOperation = AmbientLightDocument.Database;
  export import Flags = AmbientLightDocument.Flags;
  export import CoreFlags = AmbientLightDocument.CoreFlags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `AmbientLightDocument` a name.
    // The expression `CanvasDocumentMixin(BaseAmbientLight)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseAmbientLight> {}
    const CanvasDocument: CanvasDocument;
  }
}

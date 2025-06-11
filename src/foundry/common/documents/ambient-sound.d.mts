import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Document definition for an AmbientSound.
 * Defines the DataSchema and common behaviors for an AmbientSound which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseAmbientSound extends Document<"AmbientSound", BaseAmbientSound.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseAmbientSound`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseAmbientSound` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link AmbientSoundDocument.implementation | `new AmbientSoundDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `AmbientSoundDocument`.
   */
  constructor(...args: AmbientSoundDocument.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "AmbientSound",
   *   collection: "sounds",
   *   label: "DOCUMENT.AmbientSound",
   *   labelPlural: "DOCUMENT.AmbientSounds",
   *   isEmbedded: true,
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: AmbientSoundDocument.Metadata;

  static override defineSchema(): BaseAmbientSound.Schema;

  /** @defaultValue `["AMBIENT_SOUND"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: AmbientSoundDocument.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): AmbientSoundDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseAmbientSound;

  static override get collectionName(): AmbientSoundDocument.ParentCollectionName;

  static override get documentName(): AmbientSoundDocument.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): AmbientSoundDocument.Hierarchy;

  override parent: BaseAmbientSound.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<AmbientSoundDocument.Implementation | AmbientSoundDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<AmbientSoundDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<AmbientSoundDocument.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: AmbientSoundDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<AmbientSoundDocument.Database.Update>,
  ): Promise<AmbientSoundDocument.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<AmbientSoundDocument.Database.Delete>,
  ): Promise<AmbientSoundDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: AmbientSoundDocument.CreateData | AmbientSoundDocument.CreateData[],
    operation?: AmbientSoundDocument.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<AmbientSoundDocument.Implementation, Temporary> | undefined>;

  override update(
    data: AmbientSoundDocument.UpdateData | undefined,
    operation?: AmbientSoundDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: AmbientSoundDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: AmbientSoundDocument.Database.GetOptions,
  ): AmbientSoundDocument.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends AmbientSoundDocument.Flags.Scope, Key extends AmbientSoundDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<AmbientSoundDocument.Name, Scope, Key>;

  override setFlag<
    Scope extends AmbientSoundDocument.Flags.Scope,
    Key extends AmbientSoundDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<AmbientSoundDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends AmbientSoundDocument.Flags.Scope, Key extends AmbientSoundDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  override _preCreate(
    data: AmbientSoundDocument.CreateData,
    options: AmbientSoundDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: AmbientSoundDocument.CreateData,
    options: AmbientSoundDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<AmbientSoundDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: AmbientSoundDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: AmbientSoundDocument.UpdateData,
    options: AmbientSoundDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: AmbientSoundDocument.UpdateData,
    options: AmbientSoundDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: AmbientSoundDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: AmbientSoundDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: AmbientSoundDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: AmbientSoundDocument.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: AmbientSoundDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: AmbientSoundDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static override get hasSystemData(): undefined;

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
    documents: AmbientSoundDocument.Implementation[],
    context: Document.ModificationContext<AmbientSoundDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: AmbientSoundDocument.Implementation[],
    context: Document.ModificationContext<AmbientSoundDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: AmbientSoundDocument.Implementation[],
    context: Document.ModificationContext<AmbientSoundDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<AmbientSoundDocument.Schema>;

  static override get schema(): SchemaField<AmbientSoundDocument.Schema>;

  static override validateJoint(data: AmbientSoundDocument.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: AmbientSoundDocument.CreateData,
    context?: DataModel.FromSourceOptions,
  ): AmbientSoundDocument.Implementation;

  static override fromJSON(json: string): AmbientSoundDocument.Implementation;
}

export default BaseAmbientSound;

declare namespace BaseAmbientSound {
  export import Name = AmbientSoundDocument.Name;
  export import ConstructorArgs = AmbientSoundDocument.ConstructorArgs;
  export import Hierarchy = AmbientSoundDocument.Hierarchy;
  export import Metadata = AmbientSoundDocument.Metadata;
  export import Parent = AmbientSoundDocument.Parent;
  export import Descendant = AmbientSoundDocument.Descendant;
  export import DescendantClass = AmbientSoundDocument.DescendantClass;
  export import Pack = AmbientSoundDocument.Pack;
  export import Embedded = AmbientSoundDocument.Embedded;
  export import ParentCollectionName = AmbientSoundDocument.ParentCollectionName;
  export import CollectionClass = AmbientSoundDocument.CollectionClass;
  export import Collection = AmbientSoundDocument.Collection;
  export import Invalid = AmbientSoundDocument.Invalid;
  export import Stored = AmbientSoundDocument.Stored;
  export import Source = AmbientSoundDocument.Source;
  export import CreateData = AmbientSoundDocument.CreateData;
  export import InitializedData = AmbientSoundDocument.InitializedData;
  export import UpdateData = AmbientSoundDocument.UpdateData;
  export import Schema = AmbientSoundDocument.Schema;
  export import DatabaseOperation = AmbientSoundDocument.Database;
  export import Flags = AmbientSoundDocument.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `AmbientSoundDocument` a name.
    // The expression `CanvasDocumentMixin(BaseAmbientSound)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseAmbientSound> {}
    const CanvasDocument: CanvasDocument;
  }
}

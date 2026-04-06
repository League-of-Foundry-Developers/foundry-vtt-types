import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

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
   * @remarks Constructing `BaseAmbientSound` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode AmbientSoundDocument.implementation | new AmbientSoundDocument.implementation(...)} instead which will give you
   * a system specific implementation of `AmbientSoundDocument`.
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: BaseAmbientSound.CreateData, context?: BaseAmbientSound.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "AmbientSound",
   *   collection: "sounds",
   *   label: "DOCUMENT.AmbientSound",
   *   labelPlural: "DOCUMENT.AmbientSounds",
   *   isEmbedded: true,
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseAmbientSound.Metadata;

  static override defineSchema(): BaseAmbientSound.Schema;

  /** @defaultValue `["DOCUMENT", "AMBIENT_SOUND"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: BaseAmbientSound.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): AmbientSoundDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseAmbientSound;

  static override get collectionName(): BaseAmbientSound.ParentCollectionName;

  static override get documentName(): BaseAmbientSound.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): BaseAmbientSound.Hierarchy;

  override parent: BaseAmbientSound.Parent;

  override " fvtt_types_internal_document_parent": BaseAmbientSound.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<AmbientSoundDocument.Implementation | BaseAmbientSound.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseAmbientSound.Database.Create<Temporary>>,
  ): Promise<Array<BaseAmbientSound.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseAmbientSound.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseAmbientSound.Database.Update>,
  ): Promise<AmbientSoundDocument.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseAmbientSound.Database.Delete>,
  ): Promise<AmbientSoundDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseAmbientSound.CreateData | BaseAmbientSound.CreateData[],
    operation?: BaseAmbientSound.Database.CreateOperation<Temporary>,
  ): Promise<BaseAmbientSound.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseAmbientSound.UpdateData | undefined,
    operation?: BaseAmbientSound.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseAmbientSound.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: BaseAmbientSound.Database.GetOptions,
  ): AmbientSoundDocument.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends BaseAmbientSound.Flags.Scope, Key extends BaseAmbientSound.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseAmbientSound.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseAmbientSound.Flags.Scope,
    Key extends BaseAmbientSound.Flags.Key<Scope>,
    Value extends BaseAmbientSound.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseAmbientSound.Flags.Scope, Key extends BaseAmbientSound.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  override _preCreate(
    data: BaseAmbientSound.CreateData,
    options: BaseAmbientSound.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseAmbientSound.CreateData,
    options: BaseAmbientSound.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseAmbientSound.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: BaseAmbientSound.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseAmbientSound.UpdateData,
    options: BaseAmbientSound.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseAmbientSound.UpdateData,
    options: BaseAmbientSound.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: BaseAmbientSound.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: BaseAmbientSound.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseAmbientSound.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseAmbientSound.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: BaseAmbientSound.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: BaseAmbientSound.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation | Document._onCreateOperation}"
   */
  protected static override _onCreateDocuments(
    documents: AmbientSoundDocument.Implementation[],
    context: Document.ModificationContext<BaseAmbientSound.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation | Document._onUpdateOperation}"
   */
  protected static override _onUpdateDocuments(
    documents: AmbientSoundDocument.Implementation[],
    context: Document.ModificationContext<BaseAmbientSound.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation | Document._onDeleteOperation}"
   */
  protected static override _onDeleteDocuments(
    documents: AmbientSoundDocument.Implementation[],
    context: Document.ModificationContext<BaseAmbientSound.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseAmbientSound.Schema>;

  static override get schema(): SchemaField<BaseAmbientSound.Schema>;

  static override validateJoint(data: BaseAmbientSound.Source): void;

  static override fromSource(
    source: BaseAmbientSound.CreateData,
    context?: DataModel.FromSourceOptions,
  ): AmbientSoundDocument.Implementation;

  static override fromJSON(json: string): AmbientSoundDocument.Implementation;
}

export default BaseAmbientSound;

declare namespace BaseAmbientSound {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = AmbientSoundDocument.Name;
  export import ConstructionContext = AmbientSoundDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = AmbientSoundDocument.ConstructorArgs;
  export import Hierarchy = AmbientSoundDocument.Hierarchy;
  export import Metadata = AmbientSoundDocument.Metadata;
  export import Parent = AmbientSoundDocument.Parent;
  export import Descendant = AmbientSoundDocument.Descendant;
  export import DescendantClass = AmbientSoundDocument.DescendantClass;
  export import Embedded = AmbientSoundDocument.Embedded;
  export import ParentCollectionName = AmbientSoundDocument.ParentCollectionName;
  export import CollectionClass = AmbientSoundDocument.CollectionClass;
  export import Collection = AmbientSoundDocument.Collection;
  export import Invalid = AmbientSoundDocument.Invalid;
  export import Stored = AmbientSoundDocument.Stored;
  export import Source = AmbientSoundDocument.Source;
  export import CreateData = AmbientSoundDocument.CreateData;
  export import CreateInput = AmbientSoundDocument.CreateInput;
  export import CreateReturn = AmbientSoundDocument.CreateReturn;
  export import InitializedData = AmbientSoundDocument.InitializedData;
  export import UpdateData = AmbientSoundDocument.UpdateData;
  export import UpdateInput = AmbientSoundDocument.UpdateInput;
  export import Schema = AmbientSoundDocument.Schema;
  export import Database = AmbientSoundDocument.Database;
  export import TemporaryIf = AmbientSoundDocument.TemporaryIf;
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

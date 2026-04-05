import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "../data/fields.d.mts";

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
   * @remarks Constructing `BaseAmbientLight` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link AmbientLightDocument.implementation | `new AmbientLightDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `AmbientLightDocument`.
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: BaseAmbientLight.CreateData, context?: BaseAmbientLight.ConstructionContext);

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

  override readonly parentCollection: AmbientLightDocument.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): AmbientLightDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseAmbientLight;

  static override get collectionName(): BaseAmbientLight.ParentCollectionName;

  static override get documentName(): BaseAmbientLight.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseAmbientLight.Hierarchy;

  override parent: BaseAmbientLight.Parent;

  override " fvtt_types_internal_document_parent": BaseAmbientLight.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseAmbientLight.CreateInput[],
    operation?: BaseAmbientLight.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseAmbientLight.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseAmbientLight.UpdateInput[],
    operation?: BaseAmbientLight.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<AmbientLightDocument.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseAmbientLight.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<AmbientLightDocument.Stored>>;

  static override create<
    Data extends MaybeArray<BaseAmbientLight.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseAmbientLight.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseAmbientLight.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseAmbientLight.UpdateInput,
    operation?: BaseAmbientLight.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseAmbientLight.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  /**
   * @privateRemarks `AmbientLightDocument`s are neither {@link CONST.WORLD_DOCUMENT_TYPES | world documents} (and so have no
   * {@link foundry.Game.collections | world collection}) nor {@link CONST.COMPENDIUM_DOCUMENT_TYPES | compendium documents} (so there's no
   * chance of index entry return), so this always returns `null`
   */
  static override get(documentId: string, operation?: BaseAmbientLight.Database.GetDocumentsOperation): null;

  /** @privateRemarks `AmbientLightDocument`s have no embedded collections, so this always returns `null` */
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseAmbientLight.Flags.Scope, Key extends BaseAmbientLight.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseAmbientLight.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseAmbientLight.Flags.Scope,
    Key extends BaseAmbientLight.Flags.Key<Scope>,
    Value extends BaseAmbientLight.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseAmbientLight.Flags.Scope, Key extends BaseAmbientLight.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseAmbientLight.CreateData,
    options: BaseAmbientLight.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseAmbientLight.CreateData,
    options: BaseAmbientLight.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: BaseAmbientLight.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: AmbientLightDocument.Stored[],
    operation: BaseAmbientLight.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseAmbientLight.UpdateData,
    options: BaseAmbientLight.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseAmbientLight.UpdateData,
    options: BaseAmbientLight.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: AmbientLightDocument.Stored[],
    operation: BaseAmbientLight.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: AmbientLightDocument.Stored[],
    operation: BaseAmbientLight.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseAmbientLight.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseAmbientLight.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: AmbientLightDocument.Stored[],
    operation: BaseAmbientLight.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: AmbientLightDocument.Stored[],
    operation: BaseAmbientLight.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation}"
   * (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: AmbientLightDocument.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseAmbientLight.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation}"
   * (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: AmbientLightDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseAmbientLight.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation}"
   * (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: AmbientLightDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseAmbientLight.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseAmbientLight.Schema>;

  static override get schema(): SchemaField<BaseAmbientLight.Schema>;

  static override validateJoint(data: BaseAmbientLight.Source): void;

  static override fromSource(
    source: BaseAmbientLight.CreateData,
    context?: DataModel.FromSourceOptions,
  ): AmbientLightDocument.Implementation;

  static override fromJSON(json: string): AmbientLightDocument.Implementation;
}

export default BaseAmbientLight;

declare namespace BaseAmbientLight {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = AmbientLightDocument.Name;
  export import ConstructionContext = AmbientLightDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = AmbientLightDocument.ConstructorArgs;
  export import Hierarchy = AmbientLightDocument.Hierarchy;
  export import Metadata = AmbientLightDocument.Metadata;
  export import Parent = AmbientLightDocument.Parent;
  export import Descendant = AmbientLightDocument.Descendant;
  export import DescendantClass = AmbientLightDocument.DescendantClass;
  export import Embedded = AmbientLightDocument.Embedded;
  export import ParentCollectionName = AmbientLightDocument.ParentCollectionName;
  export import CollectionClass = AmbientLightDocument.CollectionClass;
  export import Collection = AmbientLightDocument.Collection;
  export import Invalid = AmbientLightDocument.Invalid;
  export import Source = AmbientLightDocument.Source;
  export import CreateData = AmbientLightDocument.CreateData;
  export import CreateInput = AmbientLightDocument.CreateInput;
  export import CreateReturn = AmbientLightDocument.CreateReturn;
  export import InitializedData = AmbientLightDocument.InitializedData;
  export import UpdateData = AmbientLightDocument.UpdateData;
  export import UpdateInput = AmbientLightDocument.UpdateInput;
  export import Schema = AmbientLightDocument.Schema;
  export import Database = AmbientLightDocument.Database;
  export import TemporaryIf = AmbientLightDocument.TemporaryIf;
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

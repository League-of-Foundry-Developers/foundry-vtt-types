import type { AnyMutableObject } from "fvtt-types/utils";
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
   *   schemaVersion: "12.324",
   * })
   * ```
   */
  static override metadata: BaseAmbientLight.Metadata;

  static override defineSchema(): BaseAmbientLight.Schema;

  /** @defaultValue `["AMBIENT_SOUND"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "AmbientLight";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: AmbientLightDocument.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): AmbientLightDocument.ImplementationClass;

  static get baseDocument(): typeof BaseAmbientLight;

  static get collectionName(): AmbientLightDocument.ParentCollectionName;

  static get documentName(): AmbientLightDocument.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): AmbientLightDocument.Hierarchy;

  override parent: BaseAmbientLight.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<AmbientLightDocument.Implementation | AmbientLightDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<AmbientLightDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<AmbientLightDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: AmbientLightDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<AmbientLightDocument.Database.Update>,
  ): Promise<AmbientLightDocument.Implementation[]>;

  static deleteDocuments(
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

  protected _preCreate(
    data: AmbientLightDocument.CreateData,
    options: AmbientLightDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: AmbientLightDocument.CreateData,
    options: AmbientLightDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<AmbientLightDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: AmbientLightDocument.UpdateData,
    options: AmbientLightDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: AmbientLightDocument.UpdateData,
    options: AmbientLightDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: AmbientLightDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: AmbientLightDocument.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): undefined;

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
  protected static _onCreateDocuments(
    documents: AmbientLightDocument.Implementation[],
    context: Document.ModificationContext<AmbientLightDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static _onUpdateDocuments(
    documents: AmbientLightDocument.Implementation[],
    context: Document.ModificationContext<AmbientLightDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static _onDeleteDocuments(
    documents: AmbientLightDocument.Implementation[],
    context: Document.ModificationContext<AmbientLightDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<AmbientLightDocument.Schema>;

  static get schema(): SchemaField<AmbientLightDocument.Schema>;

  /** @remarks Not actually overridden, still a no-op, typed for ease of subclassing */
  static validateJoint(data: AmbientLightDocument.Source): void;

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
  export import PersistedData = AmbientLightDocument.PersistedData;
  export import CreateData = AmbientLightDocument.CreateData;
  export import InitializedData = AmbientLightDocument.InitializedData;
  export import UpdateData = AmbientLightDocument.UpdateData;
  export import Schema = AmbientLightDocument.Schema;
  export import DatabaseOperation = AmbientLightDocument.Database;
  export import Flags = AmbientLightDocument.Flags;
  export import CoreFlags = AmbientLightDocument.CoreFlags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseAmbientLight.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseAmbientLight.CreateData | `BaseAmbientLight.CreateData`}
   */
  type ConstructorData = BaseAmbientLight.CreateData;
}

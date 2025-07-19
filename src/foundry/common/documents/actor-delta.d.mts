import type { AnyMutableObject, Identity } from "#utils";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";
import type EmbeddedCollection from "../abstract/embedded-collection.d.mts";

/**
 * The ActorDelta Document.
 * Defines the DataSchema and common behaviors for an ActorDelta which are shared between both client and server.
 * ActorDeltas store a delta that can be applied to a particular Actor in order to produce a new Actor.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseActorDelta<
  out SubType extends BaseActorDelta.SubType = BaseActorDelta.SubType,
> extends Document<"ActorDelta", BaseActorDelta._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseActorDelta`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseActorDelta` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link ActorDelta.implementation | `new ActorDelta.implementation(...)`} instead which will give you
   * a system specific implementation of `ActorDelta`.
   */
  // Note(LukeAbby): `data` is not actually required but `context.parent` is.
  constructor(data: ActorDelta.CreateData | undefined, context: ActorDelta.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "ActorDelta",
   *   collection: "delta",
   *   label: "DOCUMENT.ActorDelta",
   *   labelPlural: "DOCUMENT.ActorDeltas",
   *   isEmbedded: true,
   *   embedded: {
   *     Item: "items",
   *     ActiveEffect: "effects"
   *   },
   *   permissions: {
   *     create: "OWNER",
   *     delete: "OWNER"
   *   }
   *   schemaVersion: "13.341"
   * });
   * ```
   */
  static override metadata: BaseActorDelta.Metadata;

  static override defineSchema(): BaseActorDelta.Schema;

  override getUserLevel(user: User.Implementation): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * Retrieve the base actor's collection, if it exists.
   * @param collectionName - The collection name.
   * @remarks Passes `collectionName` to the token's `baseActor`'s {@link Actor.getEmbeddedCollection | `#getEmbeddedCollection`}
   */
  getBaseCollection<DocType extends Actor.Embedded.Name>(
    collectionName: DocType,
  ): EmbeddedCollection<Document.ImplementationFor<DocType>, Actor.Implementation> | undefined;

  /**
   * Apply an ActorDelta to an Actor and return the resultant synthetic Actor.
   * @param delta     - The ActorDelta.
   * @param baseActor - The base Actor.
   * @param context   - Context to supply to synthetic Actor instantiation.
   * @remarks `baseActor` is documented as being a `BaseActor` but in practice can only ever be `Actor.Implementation`
   */
  static applyDelta(
    delta: BaseActorDelta,
    baseActor: Actor.Implementation,
    context?: BaseActorDelta.ApplyDeltaContext,
  ): Actor.Implementation | null;

  /**
   * @remarks
   * Migrations:
   * - {@link foundry.documents.BaseActor.migrateData | `BaseActor`}'s
   *
   * Simply forwards to `BaseActor`
   */
  static migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * Prepare changes to a descendent delta collection.
   * @param changes - Candidate source changes. (default: `{}`)
   * @param options - Options which determine how the new data is merged. (default: `{}`)
   */
  protected _prepareDeltaUpdate(changes: ActorDelta.UpdateData, options: DataModel.UpdateOptions): void;

  /** @remarks passes to {@linkcode _prepareDeltaUpdate} prior to calling super */
  override updateSource(changes?: ActorDelta.UpdateData, options?: DataModel.UpdateOptions): ActorDelta.UpdateData;

  /** @remarks Strips optional (`required: false`) fields from the object before returning */
  // TODO: Properly type this override
  override toObject(source?: boolean): SchemaField.SourceData<ActorDelta.Schema>;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  // This is technically a property in this class but in the interest of avoiding an error it's been
  // made a getter/setter pair.
  get type(): SubType;

  set type(type);

  /* Document overrides */

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: ActorDelta.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): ActorDelta.ImplementationClass;

  static override get baseDocument(): typeof BaseActorDelta;

  static override get collectionName(): ActorDelta.ParentCollectionName;

  static override get documentName(): ActorDelta.Name;

  static override get TYPES(): BaseActorDelta.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): ActorDelta.Hierarchy;

  override system: ActorDelta.SystemOfType<SubType>;

  override parent: BaseActorDelta.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<ActorDelta.Implementation | ActorDelta.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<ActorDelta.Database.Create<Temporary>>,
  ): Promise<Array<ActorDelta.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: ActorDelta.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<ActorDelta.Database.Update>,
  ): Promise<ActorDelta.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<ActorDelta.Database.Delete>,
  ): Promise<ActorDelta.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: ActorDelta.CreateData | ActorDelta.CreateData[],
    operation?: ActorDelta.Database.CreateOperation<Temporary>,
  ): Promise<ActorDelta.TemporaryIf<Temporary> | undefined>;

  override update(
    data: ActorDelta.UpdateData | undefined,
    operation?: ActorDelta.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: ActorDelta.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: ActorDelta.Database.GetOptions): ActorDelta.Implementation | null;

  static override getCollectionName<CollectionName extends ActorDelta.Embedded.Name>(
    name: CollectionName,
  ): ActorDelta.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends ActorDelta.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): ActorDelta.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends ActorDelta.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): ActorDelta.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends ActorDelta.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.CreateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends ActorDelta.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends ActorDelta.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends ActorDelta.Flags.Scope, Key extends ActorDelta.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): ActorDelta.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends ActorDelta.Flags.Scope,
    Key extends ActorDelta.Flags.Key<Scope>,
    Value extends ActorDelta.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends ActorDelta.Flags.Scope, Key extends ActorDelta.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: ActorDelta.CreateData,
    options: ActorDelta.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: ActorDelta.CreateData,
    options: ActorDelta.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: ActorDelta.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<ActorDelta.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: ActorDelta.Implementation[],
    operation: ActorDelta.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: ActorDelta.UpdateData,
    options: ActorDelta.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: ActorDelta.UpdateData,
    options: ActorDelta.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: ActorDelta.Implementation[],
    operation: ActorDelta.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: ActorDelta.Implementation[],
    operation: ActorDelta.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: ActorDelta.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: ActorDelta.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: ActorDelta.Implementation[],
    operation: ActorDelta.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: ActorDelta.Implementation[],
    operation: ActorDelta.Database.Delete,
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
    documents: ActorDelta.Implementation[],
    context: Document.ModificationContext<ActorDelta.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: ActorDelta.Implementation[],
    context: Document.ModificationContext<ActorDelta.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: ActorDelta.Implementation[],
    context: Document.ModificationContext<ActorDelta.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<ActorDelta.Schema>;

  static override get schema(): SchemaField<ActorDelta.Schema>;

  static override validateJoint(data: ActorDelta.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: ActorDelta.CreateData,
    context?: DataModel.FromSourceOptions,
  ): ActorDelta.Implementation;

  static override fromJSON(json: string): ActorDelta.Implementation;

  static #BaseActorDelta: true;
}

export default BaseActorDelta;

declare namespace BaseActorDelta {
  interface Any extends AnyBaseActorDelta {}
  interface AnyConstructor extends Identity<typeof AnyBaseActorDelta> {}

  export import Name = ActorDelta.Name;
  export import ConstructionContext = ActorDelta.ConstructionContext;
  export import ConstructorArgs = ActorDelta.ConstructorArgs;
  export import Hierarchy = ActorDelta.Hierarchy;
  export import Metadata = ActorDelta.Metadata;
  export import SubType = ActorDelta.SubType;
  export import ConfiguredSubType = ActorDelta.ConfiguredSubType;
  export import Known = ActorDelta.Known;
  export import OfType = ActorDelta.OfType;
  export import SystemOfType = ActorDelta.SystemOfType;
  export import Parent = ActorDelta.Parent;
  export import Descendant = ActorDelta.Descendant;
  export import DescendantClass = ActorDelta.DescendantClass;
  export import Pack = ActorDelta.Pack;
  export import Embedded = ActorDelta.Embedded;
  export import ParentCollectionName = ActorDelta.ParentCollectionName;
  export import CollectionClass = ActorDelta.CollectionClass;
  export import Collection = ActorDelta.Collection;
  export import Invalid = ActorDelta.Invalid;
  export import Stored = ActorDelta.Stored;
  export import Source = ActorDelta.Source;
  export import CreateData = ActorDelta.CreateData;
  export import InitializedData = ActorDelta.InitializedData;
  export import UpdateData = ActorDelta.UpdateData;
  export import Schema = ActorDelta.Schema;
  export import Database = ActorDelta.Database;
  export import TemporaryIf = ActorDelta.TemporaryIf;
  export import Flags = ActorDelta.Flags;

  /**
   * This interface is spread into an object that already has `parent` defined, and as this is ActorDelta logic,
   * let's assume that overwriting the parent is contraindicated.
   *
   * @internal
   */
  type _ApplyDeltaContext = Omit<Document.ConstructionContext<TokenDocument.Implementation>, "parent">;

  interface ApplyDeltaContext extends _ApplyDeltaContext {
    /**
     * @deprecated This context is spread into an `Actor` creation context for the synthetic actor,
     * overriding the provided default of `parent: delta.parent` is nonsensical
     */
    parent?: never;
  }

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `ActorDelta` a name.
    // The expression `ClientDocumentMixin(BaseActorDelta)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseActorDelta> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends ActorDelta.Schema {
    system: any;
  }
}

declare abstract class AnyBaseActorDelta extends BaseActorDelta<BaseActorDelta.SubType> {
  constructor(...args: never);
}

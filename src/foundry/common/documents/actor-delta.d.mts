import type { AnyMutableObject, Identity, MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";
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
   * You should use {@linkcode ActorDelta.implementation | new ActorDelta.implementation(...)} instead which will give you
   * a system specific implementation of `ActorDelta`.
   */
  // Note(LukeAbby): `data` is not actually required but `context.parent` is.
  constructor(data: BaseActorDelta.CreateData | undefined, context: BaseActorDelta.ConstructionContext);

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
   * @remarks Passes `collectionName` to the token's `baseActor`'s {@linkcode Actor.getEmbeddedCollection | #getEmbeddedCollection}
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
   * - {@linkcode foundry.documents.BaseActor.migrateData | BaseActor}'s
   *
   * Simply forwards to `BaseActor`
   */
  static migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * Prepare changes to a descendent delta collection.
   * @param changes - Candidate source changes. (default: `{}`)
   * @param options - Options which determine how the new data is merged. (default: `{}`)
   */
  protected _prepareDeltaUpdate(changes: BaseActorDelta.UpdateData, options: DataModel.UpdateOptions): void;

  /** @remarks passes to {@linkcode _prepareDeltaUpdate} prior to calling super */
  override updateSource(
    changes?: BaseActorDelta.UpdateData,
    options?: DataModel.UpdateOptions,
  ): BaseActorDelta.UpdateData;

  /** @remarks Strips optional (`required: false`) fields from the object before returning */
  // TODO: Properly type this override
  override toObject(source?: boolean): SchemaField.SourceData<BaseActorDelta.Schema>;

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

  override readonly parentCollection: BaseActorDelta.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): ActorDelta.ImplementationClass;

  static override get baseDocument(): typeof BaseActorDelta;

  static override get collectionName(): BaseActorDelta.ParentCollectionName;

  static override get documentName(): BaseActorDelta.Name;

  static override get TYPES(): BaseActorDelta.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseActorDelta.Hierarchy;

  override system: BaseActorDelta.SystemOfType<SubType>;

  override parent: BaseActorDelta.Parent;

  override " fvtt_types_internal_document_parent": BaseActorDelta.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseActorDelta.CreateInput[],
    operation?: Document.Database.CreateOperation<BaseActorDelta.Database.Create<Temporary>>,
  ): Promise<Array<BaseActorDelta.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseActorDelta.UpdateInput[],
    operation?: Document.Database.UpdateDocumentsOperation<BaseActorDelta.Database.Update>,
  ): Promise<Array<ActorDelta.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: Document.Database.DeleteDocumentsOperation<BaseActorDelta.Database.Delete>,
  ): Promise<Array<ActorDelta.Stored>>;

  static override create<
    Data extends MaybeArray<BaseActorDelta.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseActorDelta.Database.CreateOperation<Temporary>,
  ): Promise<BaseActorDelta.CreateReturn<Data, Temporary>>;
  override update(
    data: BaseActorDelta.UpdateInput,
    operation?: BaseActorDelta.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseActorDelta.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: BaseActorDelta.Database.GetOptions,
  ): ActorDelta.Implementation | null;

  static override getCollectionName<CollectionName extends BaseActorDelta.Embedded.Name>(
    name: CollectionName,
  ): BaseActorDelta.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends BaseActorDelta.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseActorDelta.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends BaseActorDelta.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): BaseActorDelta.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends BaseActorDelta.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.CreateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseActorDelta.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseActorDelta.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseActorDelta.Flags.Scope, Key extends BaseActorDelta.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseActorDelta.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseActorDelta.Flags.Scope,
    Key extends BaseActorDelta.Flags.Key<Scope>,
    Value extends BaseActorDelta.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseActorDelta.Flags.Scope, Key extends BaseActorDelta.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseActorDelta.CreateData,
    options: BaseActorDelta.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseActorDelta.CreateData,
    options: BaseActorDelta.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: ActorDelta.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseActorDelta.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: ActorDelta.Implementation[],
    operation: BaseActorDelta.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseActorDelta.UpdateData,
    options: BaseActorDelta.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseActorDelta.UpdateData,
    options: BaseActorDelta.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: ActorDelta.Implementation[],
    operation: BaseActorDelta.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: ActorDelta.Implementation[],
    operation: BaseActorDelta.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseActorDelta.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseActorDelta.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: ActorDelta.Implementation[],
    operation: BaseActorDelta.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: ActorDelta.Implementation[],
    operation: BaseActorDelta.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated "The `ActorDelta._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode ActorDelta._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: ActorDelta.Implementation[],
    context: BaseActorDelta.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `ActorDelta._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode ActorDelta._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: ActorDelta.Stored[],
    context: BaseActorDelta.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `ActorDelta._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode ActorDelta._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: ActorDelta.Stored[],
    context: BaseActorDelta.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseActorDelta.Schema>;

  static override get schema(): SchemaField<BaseActorDelta.Schema>;

  static override validateJoint(data: BaseActorDelta.Source): void;

  static override fromSource(
    source: BaseActorDelta.CreateData,
    context?: DataModel.FromSourceOptions,
  ): ActorDelta.Implementation;

  static override fromJSON(json: string): ActorDelta.Implementation;

  static #BaseActorDelta: true;
}

export default BaseActorDelta;

declare namespace BaseActorDelta {
  // These types exist only because `ActorDeltaField` needs a constructor type to be a constraint
  interface Any extends AnyBaseActorDelta {}
  interface AnyConstructor extends Identity<typeof AnyBaseActorDelta> {}

  // All types really live in the full document and are mirrored here for convenience
  export import Name = ActorDelta.Name;
  export import ConstructionContext = ActorDelta.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
  export import Embedded = ActorDelta.Embedded;
  export import ParentCollectionName = ActorDelta.ParentCollectionName;
  export import CollectionClass = ActorDelta.CollectionClass;
  export import Collection = ActorDelta.Collection;
  export import Invalid = ActorDelta.Invalid;
  export import Stored = ActorDelta.Stored;
  export import Source = ActorDelta.Source;
  export import CreateData = ActorDelta.CreateData;
  export import CreateInput = ActorDelta.CreateInput;
  export import CreateReturn = ActorDelta.CreateReturn;
  export import InitializedData = ActorDelta.InitializedData;
  export import UpdateData = ActorDelta.UpdateData;
  export import UpdateInput = ActorDelta.UpdateInput;
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

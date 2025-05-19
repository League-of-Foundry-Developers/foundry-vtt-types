import type { AnyMutableObject } from "fvtt-types/utils";
import type Document from "../abstract/document.mts";
import type { fields } from "../data/module.d.mts";
import type { documents } from "../../client-esm/client.d.mts";
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
   * @deprecated Constructing `BaseActorDelta` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link ActorDelta.implementation | `new ActorDelta.implementation(...)`} instead which will give you
   * a system specific implementation of `ActorDelta`.
   */
  constructor(...args: ActorDelta.ConstructorArgs);

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
   *   schemaVersion: "12.324"
   * });
   * ```
   */
  static override metadata: BaseActorDelta.Metadata;

  static override defineSchema(): BaseActorDelta.Schema;

  /**
   * @remarks Forwards to `this.parent.canUserModify`. Core's `TokenDocument` implementation doesn't override this method,
   * so without further extension that's equivalent to {@link Document.canUserModify | `Document#canUserModify`}
   */
  // data: not null (parameter default only)
  override canUserModify<Action extends "create" | "update" | "delete">(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<TokenDocument.Schema, Action>,
  ): boolean;

  /** @remarks Forwards to {@link TokenDocument.testUserPermission | `this.parent.testUserPermission`} */
  // options: not null (destructured)
  override testUserPermission(
    user: User.Implementation,
    permission: Document.TestableOwnershipLevel,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

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
   * @remarks `context` is spread into an object, so it being `null` is effectively the same as omitted
   */
  static applyDelta(
    delta: BaseActorDelta,
    baseActor: documents.BaseActor,
    context?: BaseActorDelta.ApplyDeltaContext | null,
  ): Actor.Implementation | null;

  /**
   * @remarks
   * Migrations:
   * - {@link documents.BaseActor.migrateData | `BaseActor`}'s
   *
   * Simply forwards to `BaseActor`
   */
  static migrateData(source: AnyMutableObject): AnyMutableObject;

  /** @remarks Strips optional (`required: false`) fields from the object before returning */
  // TODO: Properly type this override
  override toObject(source?: boolean | null): SchemaField.SourceData<ActorDelta.Schema>;

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

  static " fvtt_types_internal_document_name_static": "ActorDelta";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

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

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<ActorDelta.Implementation | ActorDelta.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<ActorDelta.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<ActorDelta.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: ActorDelta.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<ActorDelta.Database.Update>,
  ): Promise<ActorDelta.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<ActorDelta.Database.Delete>,
  ): Promise<ActorDelta.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: ActorDelta.CreateData | ActorDelta.CreateData[],
    operation?: ActorDelta.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<ActorDelta.Implementation, Temporary> | undefined>;

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
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends ActorDelta.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends ActorDelta.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends ActorDelta.Flags.Scope, Key extends ActorDelta.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<ActorDelta.Name, Scope, Key>;

  override setFlag<
    Scope extends ActorDelta.Flags.Scope,
    Key extends ActorDelta.Flags.Key<Scope>,
    Value extends Document.GetFlag<ActorDelta.Name, Scope, Key>,
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

  static override get hasSystemData(): true;

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
}

export default BaseActorDelta;

declare namespace BaseActorDelta {
  export import Name = ActorDelta.Name;
  export import ConstructorArgs = ActorDelta.ConstructorArgs;
  export import Hierarchy = ActorDelta.Hierarchy;
  export import Metadata = ActorDelta.Metadata;
  export import SubType = ActorDelta.SubType;
  export import ConfiguredSubTypes = ActorDelta.ConfiguredSubTypes;
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
  export import PersistedData = ActorDelta.PersistedData;
  export import CreateData = ActorDelta.CreateData;
  export import InitializedData = ActorDelta.InitializedData;
  export import UpdateData = ActorDelta.UpdateData;
  export import Schema = ActorDelta.Schema;
  export import DatabaseOperation = ActorDelta.Database;
  export import Flags = ActorDelta.Flags;

  /**
   * @internal
   * This interface is spread into an object that already has `parent` defined, and as this is ActorDelta logic,
   * let's assume that overwriting the parent is contraindicated.
   */
  type _ApplyDeltaContext = Omit<Document.ConstructionContext<TokenDocument.Implementation>, "parent">;

  interface ApplyDeltaContext extends _ApplyDeltaContext {
    /**
     * @deprecated This context is spread into an `Actor` creation context for the synthetic actor,
     * overriding the provided default of `parent: delta.parent` is nonsensical
     */
    parent?: never;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends ActorDelta.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = fields.SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseActorDelta.SubType | `BaseActorDelta.SubType`} */
  type TypeNames = Game.Model.TypeNames<"Actor">;

  /**
   * @deprecated {@link fields.SchemaField | `SchemaField<BaseActorDelta.Schema>`}
   */
  type SchemaField = fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseActorDelta.CreateData | `BaseActorDelta.CreateData`}
   */
  type ConstructorData = fields.SchemaField.CreateData<Schema>;
}

import type { AnyMutableObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Actor Document.
 * Defines the DataSchema and common behaviors for an Actor which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseActor<out SubType extends Actor.SubType = Actor.SubType> extends Document<
  "Actor",
  BaseActor._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseActor`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseActor` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Actor.implementation | `new Actor.implementation(...)`} instead which will give you
   * a system specific implementation of `Actor`.
   */
  constructor(...args: Actor.ConstructorArgs);

  static override metadata: BaseActor.Metadata;

  static override defineSchema(): BaseActor.Schema;

  /**
   * The default icon used for newly created Actor documents.
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  static DEFAULT_ICON: string;

  /**
   * Determine default artwork based on the provided actor data
   * @param actorData - The source actor data
   */
  static getDefaultArtwork(actorData: BaseActor.CreateData): {
    img: string;
    texture: { src: string };
  };

  // options: not null (parameter default only)
  protected override _initializeSource(
    data: BaseActor.CreateData | this,
    options?: Document.InitializeSourceOptions,
  ): BaseActor.Source;

  /** @remarks Returns `user.hasPermission("ACTOR_CREATE")` */
  static override canUserCreate(user: User.Implementation): boolean;

  /**
   * @remarks
   * Migrations:
   * - `flags.core.sourceId` to `_stats.compendiumSource` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

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

  static " fvtt_types_internal_document_name_static": "Actor";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: Actor.ParentCollectionName | null;

  readonly pack: string | null;

  static get implementation(): Actor.ImplementationClass;

  static get baseDocument(): typeof BaseActor;

  static get collectionName(): Actor.ParentCollectionName;

  static get documentName(): Actor.Name;

  static get TYPES(): BaseActor.SubType[];

  static get hasTypeData(): true;

  static get hierarchy(): Actor.Hierarchy;

  override system: Actor.SystemOfType<SubType>;

  override parent: BaseActor.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Actor.Implementation | Actor.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Actor.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Actor.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Actor.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Actor.Database.Update>,
  ): Promise<Actor.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Actor.Database.Delete>,
  ): Promise<Actor.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Actor.CreateData | Actor.CreateData[],
    operation?: Actor.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Actor.Implementation, Temporary> | undefined>;

  override update(
    data: Actor.UpdateData | undefined,
    operation?: Actor.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Actor.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Actor.Database.GetOptions): Actor.Implementation | null;

  static override getCollectionName<CollectionName extends Actor.Embedded.Name>(
    name: CollectionName,
  ): Actor.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends Actor.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): Actor.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends Actor.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): Actor.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends Actor.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends Actor.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends Actor.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Actor.Flags.Scope, Key extends Actor.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Actor.Name, Scope, Key>;

  override setFlag<
    Scope extends Actor.Flags.Scope,
    Key extends Actor.Flags.Key<Scope>,
    Value extends Document.GetFlag<Actor.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Actor.Flags.Scope, Key extends Actor.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: Actor.CreateData,
    options: Actor.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Actor.CreateData, options: Actor.Database.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Actor.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Actor.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Actor.Implementation[],
    operation: Actor.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Actor.UpdateData,
    options: Actor.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(changed: Actor.UpdateData, options: Actor.Database.OnUpdateOperation, userId: string): void;

  protected static _preUpdateOperation(
    documents: Actor.Implementation[],
    operation: Actor.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Actor.Implementation[],
    operation: Actor.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(options: Actor.Database.PreDeleteOptions, user: User.Implementation): Promise<boolean | void>;

  protected _onDelete(options: Actor.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Actor.Implementation[],
    operation: Actor.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Actor.Implementation[],
    operation: Actor.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): true;

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
    documents: Actor.Implementation[],
    context: Document.ModificationContext<Actor.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static _onUpdateDocuments(
    documents: Actor.Implementation[],
    context: Document.ModificationContext<Actor.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static _onDeleteDocuments(
    documents: Actor.Implementation[],
    context: Document.ModificationContext<Actor.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<Actor.Schema>;

  static get schema(): SchemaField<Actor.Schema>;

  /** @remarks Not actually overridden, still a no-op, typed for ease of subclassing */
  static validateJoint(data: Actor.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(source: Actor.CreateData, context?: DataModel.FromSourceOptions): Actor.Implementation;

  static override fromJSON(json: string): Actor.Implementation;

  #baseActor: true;
}

declare namespace BaseActor {
  export import Name = Actor.Name;
  export import ConstructorArgs = Actor.ConstructorArgs;
  export import Hierarchy = Actor.Hierarchy;
  export import Metadata = Actor.Metadata;
  export import SubType = Actor.SubType;
  export import ConfiguredSubTypes = Actor.ConfiguredSubTypes;
  export import Known = Actor.Known;
  export import OfType = Actor.OfType;
  export import SystemOfType = Actor.SystemOfType;
  export import Parent = Actor.Parent;
  export import Descendant = Actor.Descendant;
  export import DescendantClass = Actor.DescendantClass;
  export import Pack = Actor.Pack;
  export import Embedded = Actor.Embedded;
  export import ParentCollectionName = Actor.ParentCollectionName;
  export import CollectionClass = Actor.CollectionClass;
  export import Collection = Actor.Collection;
  export import Invalid = Actor.Invalid;
  export import Stored = Actor.Stored;
  export import Source = Actor.Source;
  export import PersistedData = Actor.PersistedData;
  export import CreateData = Actor.CreateData;
  export import InitializedData = Actor.InitializedData;
  export import UpdateData = Actor.UpdateData;
  export import Schema = Actor.Schema;
  export import DatabaseOperation = Actor.Database;
  export import Flags = Actor.Flags;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends Actor.Schema {
    // For performance reasons don't bother calculating the `system` field.
    // This is overridden anyways.
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  interface Properties extends SchemaField.InitializedData<Schema> {}

  /**
   * @deprecated {@link BaseActor.SubType | `BaseActor.SubType`}
   */
  type TypeNames = Game.Model.TypeNames<"Actor">;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseActor.Schema>`}
   */
  interface SchemaField extends foundry.data.fields.SchemaField<Schema> {}

  /**
   * @deprecated {@link BaseActor.CreateData | `BaseActor.CreateData`}
   */
  interface ConstructorData extends SchemaField.CreateData<Schema> {}
}

export default BaseActor;

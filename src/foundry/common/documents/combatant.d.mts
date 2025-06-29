import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.d.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Combatant Document.
 * Defines the DataSchema and common behaviors for a Combatant which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseCombatant<
  out SubType extends BaseCombatant.SubType = BaseCombatant.SubType,
> extends Document<"Combatant", BaseCombatant._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseCombatant`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseCombatant` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Combatant.implementation | `new Combatant.implementation(...)`} instead which will give you
   * a system specific implementation of `Combatant`.
   */
  // Note(LukeAbby): `data` is not actually required but `context.parent` is.
  constructor(data: Combatant.CreateData | undefined, context: Combatant.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Combatant",
   *   collection: "combatants",
   *   label: "DOCUMENT.Combatant",
   *   labelPlural: "DOCUMENT.Combatants",
   *   isEmbedded: true,
   *   hasTypeData: true,
   *   permissions: {
   *     create: "OWNER",
   *     update: this.#canUpdate,
   *     delete: "OWNER"
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseCombatant.Metadata;

  static override defineSchema(): BaseCombatant.Schema;

  /**
   * @remarks Uses `game.user` if `user` is falsey.
   *
   * Returns {@link DOCUMENT_OWNERSHIP_LEVELS.OWNER | `OWNER`} if `user.isGM`, otherwise forwards to `this.actor?.getUserLevel(user)`.
   * If thats nullish, returns {@link DOCUMENT_OWNERSHIP_LEVELS.NONE | `NONE`}
   */
  override getUserLevel(user?: User.Implementation): DOCUMENT_OWNERSHIP_LEVELS;

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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: Combatant.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): Combatant.ImplementationClass;

  static override get baseDocument(): typeof BaseCombatant;

  static override get collectionName(): Combatant.ParentCollectionName;

  static override get documentName(): Combatant.Name;

  static override get TYPES(): BaseCombatant.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): Combatant.Hierarchy;

  override system: Combatant.SystemOfType<SubType>;

  override parent: BaseCombatant.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<Combatant.Implementation | Combatant.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Combatant.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Combatant.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: Combatant.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Combatant.Database.Update>,
  ): Promise<Combatant.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Combatant.Database.Delete>,
  ): Promise<Combatant.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: Combatant.CreateData | Combatant.CreateData[],
    operation?: Combatant.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Combatant.Implementation, Temporary> | undefined>;

  override update(
    data: Combatant.UpdateData | undefined,
    operation?: Combatant.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Combatant.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Combatant.Database.GetOptions): Combatant.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends Combatant.Flags.Scope, Key extends Combatant.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Combatant.Name, Scope, Key>;

  override setFlag<
    Scope extends Combatant.Flags.Scope,
    Key extends Combatant.Flags.Key<Scope>,
    Value extends Document.GetFlag<Combatant.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Combatant.Flags.Scope, Key extends Combatant.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: Combatant.CreateData,
    options: Combatant.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: Combatant.CreateData,
    options: Combatant.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Combatant.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Combatant.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: Combatant.UpdateData,
    options: Combatant.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: Combatant.UpdateData,
    options: Combatant.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: Combatant.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: Combatant.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.Database.Delete,
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
    documents: Combatant.Implementation[],
    context: Document.ModificationContext<Combatant.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: Combatant.Implementation[],
    context: Document.ModificationContext<Combatant.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: Combatant.Implementation[],
    context: Document.ModificationContext<Combatant.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<Combatant.Schema>;

  static override get schema(): SchemaField<Combatant.Schema>;

  static override validateJoint(data: Combatant.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: Combatant.CreateData,
    context?: DataModel.FromSourceOptions,
  ): Combatant.Implementation;

  static override fromJSON(json: string): Combatant.Implementation;

  static #BaseCombatant: true;
}

export default BaseCombatant;

declare namespace BaseCombatant {
  export import Name = Combatant.Name;
  export import ConstructionContext = Combatant.ConstructionContext;
  export import ConstructorArgs = Combatant.ConstructorArgs;
  export import Hierarchy = Combatant.Hierarchy;
  export import Metadata = Combatant.Metadata;
  export import SubType = Combatant.SubType;
  export import ConfiguredSubTypes = Combatant.ConfiguredSubTypes;
  export import Known = Combatant.Known;
  export import OfType = Combatant.OfType;
  export import SystemOfType = Combatant.SystemOfType;
  export import Parent = Combatant.Parent;
  export import Descendant = Combatant.Descendant;
  export import DescendantClass = Combatant.DescendantClass;
  export import Pack = Combatant.Pack;
  export import Embedded = Combatant.Embedded;
  export import ParentCollectionName = Combatant.ParentCollectionName;
  export import CollectionClass = Combatant.CollectionClass;
  export import Collection = Combatant.Collection;
  export import Invalid = Combatant.Invalid;
  export import Stored = Combatant.Stored;
  export import Source = Combatant.Source;
  export import CreateData = Combatant.CreateData;
  export import InitializedData = Combatant.InitializedData;
  export import UpdateData = Combatant.UpdateData;
  export import Schema = Combatant.Schema;
  export import DatabaseOperation = Combatant.Database;
  export import Flags = Combatant.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Combatant` a name.
    // The expression `ClientDocumentMixin(BaseCombatant)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseCombatant> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends Combatant.Schema {
    system: any;
  }
}

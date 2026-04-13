import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

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
   * You should use {@linkcode Combatant.implementation | new Combatant.implementation(...)} instead which will give you
   * a system specific implementation of `Combatant`.
   */
  // Note(LukeAbby): `data` is not actually required but `context.parent` is.
  constructor(data: BaseCombatant.CreateData | undefined, context: BaseCombatant.ConstructionContext);

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
   * Returns {@linkcode DOCUMENT_OWNERSHIP_LEVELS.OWNER | OWNER} if `user.isGM`, otherwise forwards to `this.actor?.getUserLevel(user)`.
   * If thats nullish, returns {@linkcode DOCUMENT_OWNERSHIP_LEVELS.NONE | NONE}
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

  type: SubType;

  /* Document overrides */

  override readonly parentCollection: BaseCombatant.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Combatant.ImplementationClass;

  static override get baseDocument(): typeof BaseCombatant;

  static override get collectionName(): BaseCombatant.ParentCollectionName;

  static override get documentName(): BaseCombatant.Name;

  static override get TYPES(): BaseCombatant.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseCombatant.Hierarchy;

  override system: BaseCombatant.SystemOfType<SubType>;

  override parent: BaseCombatant.Parent;

  override " fvtt_types_internal_document_parent": BaseCombatant.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<Combatant.Implementation | BaseCombatant.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseCombatant.Database.Create<Temporary>>,
  ): Promise<Array<BaseCombatant.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseCombatant.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseCombatant.Database.Update>,
  ): Promise<Combatant.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseCombatant.Database.Delete>,
  ): Promise<Combatant.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseCombatant.CreateData | BaseCombatant.CreateData[],
    operation?: BaseCombatant.Database.CreateOperation<Temporary>,
  ): Promise<BaseCombatant.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseCombatant.UpdateData | undefined,
    operation?: BaseCombatant.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseCombatant.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: BaseCombatant.Database.GetOptions): Combatant.Implementation | null;

  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseCombatant.Flags.Scope, Key extends BaseCombatant.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseCombatant.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseCombatant.Flags.Scope,
    Key extends BaseCombatant.Flags.Key<Scope>,
    Value extends BaseCombatant.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseCombatant.Flags.Scope, Key extends BaseCombatant.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseCombatant.CreateData,
    options: BaseCombatant.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseCombatant.CreateData,
    options: BaseCombatant.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Combatant.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseCombatant.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Combatant.Implementation[],
    operation: BaseCombatant.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseCombatant.UpdateData,
    options: BaseCombatant.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseCombatant.UpdateData,
    options: BaseCombatant.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Combatant.Implementation[],
    operation: BaseCombatant.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Combatant.Implementation[],
    operation: BaseCombatant.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseCombatant.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseCombatant.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Combatant.Implementation[],
    operation: BaseCombatant.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Combatant.Implementation[],
    operation: BaseCombatant.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated "The `Combatant._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode Combatant._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Combatant.Implementation[],
    context: BaseCombatant.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Combatant._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode Combatant._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Combatant.Stored[],
    context: BaseCombatant.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Combatant._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode Combatant._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Combatant.Stored[],
    context: BaseCombatant.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseCombatant.Schema>;

  static override get schema(): SchemaField<BaseCombatant.Schema>;

  static override validateJoint(data: BaseCombatant.Source): void;

  static override fromSource(
    source: BaseCombatant.CreateData,
    context?: DataModel.FromSourceOptions,
  ): Combatant.Implementation;

  static override fromJSON(json: string): Combatant.Implementation;

  static #BaseCombatant: true;
}

export default BaseCombatant;

declare namespace BaseCombatant {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Combatant.Name;
  export import ConstructionContext = Combatant.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Combatant.ConstructorArgs;
  export import Hierarchy = Combatant.Hierarchy;
  export import Metadata = Combatant.Metadata;
  export import SubType = Combatant.SubType;
  export import ConfiguredSubType = Combatant.ConfiguredSubType;
  export import Known = Combatant.Known;
  export import OfType = Combatant.OfType;
  export import SystemOfType = Combatant.SystemOfType;
  export import Parent = Combatant.Parent;
  export import Descendant = Combatant.Descendant;
  export import DescendantClass = Combatant.DescendantClass;
  export import Embedded = Combatant.Embedded;
  export import ParentCollectionName = Combatant.ParentCollectionName;
  export import CollectionClass = Combatant.CollectionClass;
  export import Collection = Combatant.Collection;
  export import Invalid = Combatant.Invalid;
  export import Stored = Combatant.Stored;
  export import Source = Combatant.Source;
  export import CreateData = Combatant.CreateData;
  export import CreateInput = Combatant.CreateInput;
  export import CreateReturn = Combatant.CreateReturn;
  export import InitializedData = Combatant.InitializedData;
  export import UpdateData = Combatant.UpdateData;
  export import UpdateInput = Combatant.UpdateInput;
  export import Schema = Combatant.Schema;
  export import Database = Combatant.Database;
  export import TemporaryIf = Combatant.TemporaryIf;
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

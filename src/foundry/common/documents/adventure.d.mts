import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";
import type { fields } from "../data/_module.d.mts";

/**
 * The Adventure Document.
 * Defines the DataSchema and common behaviors for an Adventure which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseAdventure extends Document<"Adventure", BaseAdventure.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseAdventure`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseAdventure` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode Adventure.implementation | new Adventure.implementation(...)} instead which will give you
   * a system specific implementation of `Adventure`.
   */
  constructor(data: BaseAdventure.CreateData, context?: BaseAdventure.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Adventure",
   *   collection: "adventures",
   *   compendiumIndexFields: ["_id", "name", "description", "img", "sort", "folder"],
   *   label: "DOCUMENT.Adventure",
   *   labelPlural: "DOCUMENT.Adventures",
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseAdventure.Metadata;

  static override defineSchema(): BaseAdventure.Schema;

  /** @defaultValue `["DOCUMENT", "ADVENTURE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * An array of the fields which provide imported content from the BaseAdventure.
   */
  static get contentFields(): BaseAdventure.ContentFields;

  /**
   * Provide a thumbnail image path used to represent the Adventure document.
   */
  get thumbnail(): string | null;

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

  override readonly parentCollection: BaseAdventure.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Adventure.ImplementationClass;

  static override get baseDocument(): typeof BaseAdventure;

  static override get collectionName(): BaseAdventure.ParentCollectionName;

  static override get documentName(): BaseAdventure.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseAdventure.Hierarchy;

  override parent: BaseAdventure.Parent;

  override " fvtt_types_internal_document_parent": BaseAdventure.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseAdventure.CreateInput[],
    operation?: Document.Database.CreateOperation<BaseAdventure.Database.Create<Temporary>>,
  ): Promise<Array<BaseAdventure.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseAdventure.UpdateInput[],
    operation?: Document.Database.UpdateDocumentsOperation<BaseAdventure.Database.Update>,
  ): Promise<Array<Adventure.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: Document.Database.DeleteDocumentsOperation<BaseAdventure.Database.Delete>,
  ): Promise<Array<Adventure.Stored>>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseAdventure.CreateData | BaseAdventure.CreateData[],
    operation?: BaseAdventure.Database.CreateOperation<Temporary>,
  ): Promise<BaseAdventure.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseAdventure.UpdateData | undefined,
    operation?: BaseAdventure.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseAdventure.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: BaseAdventure.Database.GetOptions): Adventure.Implementation | null;

  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseAdventure.Flags.Scope, Key extends BaseAdventure.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseAdventure.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseAdventure.Flags.Scope,
    Key extends BaseAdventure.Flags.Key<Scope>,
    Value extends BaseAdventure.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseAdventure.Flags.Scope, Key extends BaseAdventure.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseAdventure.CreateData,
    options: BaseAdventure.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseAdventure.CreateData,
    options: BaseAdventure.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Adventure.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseAdventure.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Adventure.Implementation[],
    operation: BaseAdventure.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseAdventure.UpdateData,
    options: BaseAdventure.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseAdventure.UpdateData,
    options: BaseAdventure.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Adventure.Implementation[],
    operation: BaseAdventure.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Adventure.Implementation[],
    operation: BaseAdventure.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseAdventure.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseAdventure.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Adventure.Implementation[],
    operation: BaseAdventure.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Adventure.Implementation[],
    operation: BaseAdventure.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated "The `Adventure._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode Adventure._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Adventure.Implementation[],
    context: BaseAdventure.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Adventure._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode Adventure._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Adventure.Stored[],
    context: BaseAdventure.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Adventure._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode Adventure._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Adventure.Stored[],
    context: BaseAdventure.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseAdventure.Schema>;

  static override get schema(): SchemaField<BaseAdventure.Schema>;

  static override validateJoint(data: BaseAdventure.Source): void;

  static override fromSource(
    source: BaseAdventure.CreateData,
    context?: DataModel.FromSourceOptions,
  ): Adventure.Implementation;

  static override fromJSON(json: string): Adventure.Implementation;
}

export default BaseAdventure;

declare namespace BaseAdventure {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Adventure.Name;
  export import ConstructionContext = Adventure.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Adventure.ConstructorArgs;
  export import Hierarchy = Adventure.Hierarchy;
  export import Metadata = Adventure.Metadata;
  export import Parent = Adventure.Parent;
  export import Descendant = Adventure.Descendant;
  export import DescendantClass = Adventure.DescendantClass;
  export import Embedded = Adventure.Embedded;
  export import ParentCollectionName = Adventure.ParentCollectionName;
  export import CollectionClass = Adventure.CollectionClass;
  export import Collection = Adventure.Collection;
  export import Invalid = Adventure.Invalid;
  export import Stored = Adventure.Stored;
  export import Source = Adventure.Source;
  export import CreateData = Adventure.CreateData;
  export import CreateInput = Adventure.CreateInput;
  export import CreateReturn = Adventure.CreateReturn;
  export import InitializedData = Adventure.InitializedData;
  export import UpdateData = Adventure.UpdateData;
  export import UpdateInput = Adventure.UpdateInput;
  export import Schema = Adventure.Schema;
  export import Database = Adventure.Database;
  export import TemporaryIf = Adventure.TemporaryIf;
  export import Flags = Adventure.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Adventure` a name.
    // The expression `ClientDocumentMixin(BaseAdventure)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseAdventure> {}
    const ClientDocument: ClientDocument;
  }

  /**
   * A helper type to extract the return value for {@linkcode BaseAdventure.contentFields}
   */
  type ContentFields = {
    [Key in keyof BaseAdventure.Schema as BaseAdventure.Schema[Key] extends fields.SetField.Any
      ? Key
      : never]: BaseAdventure.Schema[Key] extends fields.SetField<
      infer ElementType,
      infer _1,
      infer _2,
      infer _3,
      infer _4,
      infer _5,
      infer _6,
      infer _7
    >
      ? ElementType extends fields.EmbeddedDataField<infer ModelType, infer _8, infer _9, infer _10, infer _11>
        ? ModelType extends Document.AnyConstructor // TODO: This doesn't seem to quite work to ensure it's the configured class
          ? ModelType["implementation"]
          : ModelType
        : never
      : never;
  };
}

import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type * as fields from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Adventure Document.
 * Defines the DataSchema and common behaviors for an Adventure which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseAdventure extends Document<"Adventure", BaseAdventure.Schema, any> {
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
  static override metadata: Adventure.Metadata;

  static override defineSchema(): BaseAdventure.Schema;

  /** @defaultValue `["DOCUMENT", "ADVENTURE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * An array of the fields which provide imported content from the Adventure.
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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: Adventure.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): Adventure.ImplementationClass;

  static override get baseDocument(): typeof BaseAdventure;

  static override get collectionName(): Adventure.ParentCollectionName;

  static override get documentName(): Adventure.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): Adventure.Hierarchy;

  override parent: Adventure.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Adventure.Implementation | Adventure.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Adventure.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Adventure.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: Adventure.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Adventure.Database.Update>,
  ): Promise<Adventure.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Adventure.Database.Delete>,
  ): Promise<Adventure.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Adventure.CreateData | Adventure.CreateData[],
    operation?: Adventure.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Adventure.Implementation, Temporary> | undefined>;

  override update(
    data: Adventure.UpdateData | undefined,
    operation?: Adventure.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Adventure.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Adventure.Database.GetOptions): Adventure.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Adventure.Flags.Scope, Key extends Adventure.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Adventure.Name, Scope, Key>;

  override setFlag<
    Scope extends Adventure.Flags.Scope,
    Key extends Adventure.Flags.Key<Scope>,
    Value extends Document.GetFlag<Adventure.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Adventure.Flags.Scope, Key extends Adventure.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: Adventure.CreateData,
    options: Adventure.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: Adventure.CreateData,
    options: Adventure.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Adventure.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Adventure.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: Adventure.UpdateData,
    options: Adventure.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: Adventure.UpdateData,
    options: Adventure.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: Adventure.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: Adventure.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static override get hasSystemData(): undefined;

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
    documents: Adventure.Implementation[],
    context: Document.ModificationContext<Adventure.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: Adventure.Implementation[],
    context: Document.ModificationContext<Adventure.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: Adventure.Implementation[],
    context: Document.ModificationContext<Adventure.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<Adventure.Schema>;

  static override get schema(): SchemaField<Adventure.Schema>;

  static override validateJoint(data: Adventure.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: Adventure.CreateData,
    context?: DataModel.FromSourceOptions,
  ): Adventure.Implementation;

  static override fromJSON(json: string): Adventure.Implementation;
}

export default BaseAdventure;

declare namespace BaseAdventure {
  export import Name = Adventure.Name;
  export import ConstructorArgs = Adventure.ConstructorArgs;
  export import Hierarchy = Adventure.Hierarchy;
  export import Metadata = Adventure.Metadata;
  export import Parent = Adventure.Parent;
  export import Descendant = Adventure.Descendant;
  export import DescendantClass = Adventure.DescendantClass;
  export import Pack = Adventure.Pack;
  export import Embedded = Adventure.Embedded;
  export import ParentCollectionName = Adventure.ParentCollectionName;
  export import CollectionClass = Adventure.CollectionClass;
  export import Collection = Adventure.Collection;
  export import Invalid = Adventure.Invalid;
  export import Stored = Adventure.Stored;
  export import Source = Adventure.Source;
  export import CreateData = Adventure.CreateData;
  export import InitializedData = Adventure.InitializedData;
  export import UpdateData = Adventure.UpdateData;
  export import Schema = Adventure.Schema;
  export import DatabaseOperation = Adventure.Database;
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

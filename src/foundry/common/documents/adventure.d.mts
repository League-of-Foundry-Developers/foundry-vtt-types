import type { AnyMutableObject } from "fvtt-types/utils";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { fields } from "../data/module.d.mts";
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
   * @param data    - Initial data from which to construct the `BaseAdventure`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseAdventure` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Adventure.implementation | `new Adventure.implementation(...)`} instead which will give you
   * a system specific implementation of `Adventure`.
   */
  constructor(...args: Adventure.ConstructorArgs);

  static override metadata: Adventure.Metadata;

  static override defineSchema(): BaseAdventure.Schema;

  /**
   * An array of the fields which provide imported content from the Adventure.
   */
  static get contentFields(): BaseAdventure.ContentFields;

  /**
   * Provide a thumbnail image path used to represent the Adventure document.
   */
  get thumbnail(): string;

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

  static " fvtt_types_internal_document_name_static": "Adventure";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: Adventure.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): Adventure.ImplementationClass;

  static get baseDocument(): typeof BaseAdventure;

  static get collectionName(): Adventure.ParentCollectionName;

  static get documentName(): Adventure.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): Adventure.Hierarchy;

  override parent: Adventure.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Adventure.Implementation | Adventure.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Adventure.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Adventure.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Adventure.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Adventure.Database.Update>,
  ): Promise<Adventure.Implementation[]>;

  static deleteDocuments(
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

  protected _preCreate(
    data: Adventure.CreateData,
    options: Adventure.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Adventure.CreateData, options: Adventure.Database.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Adventure.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Adventure.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Adventure.UpdateData,
    options: Adventure.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Adventure.UpdateData,
    options: Adventure.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Adventure.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Adventure.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.Database.Delete,
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
  protected static override _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  protected static _onCreateDocuments(
    documents: Adventure.Implementation[],
    context: Document.ModificationContext<Adventure.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Adventure.Implementation[],
    context: Document.ModificationContext<Adventure.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Adventure.Implementation[],
    context: Document.ModificationContext<Adventure.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<Adventure.Schema>;

  static get schema(): SchemaField<Adventure.Schema>;

  static validateJoint(data: Adventure.Source): void;

  // TODO: Actual override, not just template; audit
  // context: not null (destructured)
  static override fromSource(
    source: Adventure.CreateData,
    context?: Document.ConstructionContext<BaseAdventure.Parent>,
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
  export import PersistedData = Adventure.PersistedData;
  export import CreateData = Adventure.CreateData;
  export import InitializedData = Adventure.InitializedData;
  export import UpdateData = Adventure.UpdateData;
  export import Schema = Adventure.Schema;
  export import DatabaseOperation = Adventure.Database;
  export import Flags = Adventure.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseAdventure.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseAdventure.CreateData | `BaseAdventure.CreateData`}
   */
  type ConstructorData = BaseAdventure.CreateData;

  /**
   * A helper type to extract the return value for {@link BaseAdventure.contentFields | `BaseAdventure.contentFields`}
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

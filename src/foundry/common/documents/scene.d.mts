import type { AnyObject, AnyMutableObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Document definition for a Scene.
 * Defines the DataSchema and common behaviors for a Scene which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseScene extends Document<"Scene", BaseScene.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseScene`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseScene` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Scene.implementation | `new Scene.implementation(...)`} instead which will give you
   * a system specific implementation of `Scene`.
   */
  constructor(...args: Scene.ConstructorArgs);

  static override metadata: BaseScene.Metadata;

  static override defineSchema(): BaseScene.Schema;

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;

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

  static " fvtt_types_internal_document_name_static": "Scene";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: Scene.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): Scene.ImplementationClass;

  static get baseDocument(): typeof BaseScene;

  static get collectionName(): Scene.ParentCollectionName;

  static get documentName(): Scene.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): false;

  static get hierarchy(): Scene.Hierarchy;

  override parent: Scene.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Scene.Implementation | Scene.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Scene.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Scene.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Scene.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Scene.Database.Update>,
  ): Promise<Scene.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Scene.Database.Delete>,
  ): Promise<Scene.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Scene.CreateData | Scene.CreateData[],
    operation?: Scene.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Scene.Implementation, Temporary> | undefined>;

  override update(
    data: Scene.UpdateData | undefined,
    operation?: Scene.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Scene.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Scene.Database.GetOptions): Scene.Implementation | null;

  static override getCollectionName<CollectionName extends Scene.EmbeddedName>(
    name: CollectionName,
  ): Scene.CollectionNameOf<CollectionName> | null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Scene.Flags.Scope, Key extends Scene.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Scene.Name, Scope, Key>;

  override setFlag<
    Scope extends Scene.Flags.Scope,
    Key extends Scene.Flags.Key<Scope>,
    Value extends Document.GetFlag<Scene.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Scene.Flags.Scope, Key extends Scene.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: Scene.CreateData,
    options: Scene.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Scene.CreateData, options: Scene.Database.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Scene.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Scene.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Scene.Implementation[],
    operation: Scene.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Scene.UpdateData,
    options: Scene.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(changed: Scene.UpdateData, options: Scene.Database.OnUpdateOperation, userId: string): void;

  protected static _preUpdateOperation(
    documents: Scene.Implementation[],
    operation: Scene.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Scene.Implementation[],
    operation: Scene.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(options: Scene.Database.PreDeleteOptions, user: User.Implementation): Promise<boolean | void>;

  protected _onDelete(options: Scene.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Scene.Implementation[],
    operation: Scene.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Scene.Implementation[],
    operation: Scene.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): false;

  // These data field things have been ticketed but will probably go into backlog hell for a while.
  // We'll end up copy and pasting without modification for now I think. It makes it a tiny bit easier to update though.
  protected static _addDataFieldShims(data: AnyObject, shims: AnyObject, options?: Document.DataFieldShimOptions): void;

  protected static _addDataFieldMigration(
    data: AnyObject,
    oldKey: string,
    newKey: string,
    apply?: (data: AnyObject) => unknown,
  ): unknown;

  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  protected static _onCreateDocuments(
    documents: Scene.Implementation[],
    context: Document.ModificationContext<Scene.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Scene.Implementation[],
    context: Document.ModificationContext<Scene.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Scene.Implementation[],
    context: Document.ModificationContext<Scene.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<Scene.Schema>;

  static get schema(): SchemaField<Scene.Schema>;

  static validateJoint(data: Scene.Source): void;

  static override fromSource(
    source: Scene.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Scene.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Scene.Schema, DataModel.Any | null>;
}

export default BaseScene;

declare namespace BaseScene {
  export import Name = Scene.Name;
  export import ConstructorArgs = Scene.ConstructorArgs;
  export import Hierarchy = Scene.Hierarchy;
  export import Metadata = Scene.Metadata;
  export import Parent = Scene.Parent;
  export import Pack = Scene.Pack;
  export import Embedded = Scene.Embedded;
  export import EmbeddedName = Scene.EmbeddedName;
  export import EmbeddedCollectionName = Scene.EmbeddedCollectionName;
  export import ParentCollectionName = Scene.ParentCollectionName;
  export import Stored = Scene.Stored;
  export import Source = Scene.Source;
  export import PersistedData = Scene.PersistedData;
  export import CreateData = Scene.CreateData;
  export import InitializedData = Scene.InitializedData;
  export import UpdateData = Scene.UpdateData;
  export import Schema = Scene.Schema;
  export import DatabaseOperation = Scene.Database;
  export import Flags = Scene.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseScene.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseScene.CreateData | `BaseScene.CreateData`}
   */
  type ConstructorData = BaseScene.CreateData;
}

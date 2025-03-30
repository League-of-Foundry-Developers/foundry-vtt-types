import type { AnyMutableObject, InexactPartial } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.d.mts";
import type * as CONST from "../constants.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Macro Document.
 * Defines the DataSchema and common behaviors for a Macro which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseMacro<out _SubType extends BaseMacro.SubType = BaseMacro.SubType> extends Document<
  "Macro",
  BaseMacro.Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseMacro`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseMacro` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Macro.implementation | `new Macro.implementation(...)`} instead which will give you
   * a system specific implementation of `Macro`.
   */
  constructor(...args: Macro.ConstructorArgs);

  static override metadata: BaseMacro.Metadata;

  static override defineSchema(): BaseMacro.Schema;

  /**
   * The default icon used for newly created Macro documents.
   */
  static DEFAULT_ICON: "icons/svg/dice-target.svg";

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  static override canUserCreate(user: User.Implementation): boolean;

  override testUserPermission(
    user: User.Implementation,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

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

  static " fvtt_types_internal_document_name_static": "Macro";

  readonly parentCollection: Macro.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): Macro.ImplementationClass;

  static get baseDocument(): typeof BaseMacro;

  static get collectionName(): Macro.ParentCollectionName;

  static get documentName(): Macro.Name;

  static get TYPES(): BaseMacro.SubType[];

  static get hasTypeData(): true;

  static get hierarchy(): Macro.Hierarchy;

  override parent: BaseMacro.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Macro.Implementation | Macro.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Macro.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Macro.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Macro.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Macro.Database.Update>,
  ): Promise<Macro.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Macro.Database.Delete>,
  ): Promise<Macro.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Macro.CreateData | Macro.CreateData[],
    operation?: Macro.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Macro.Implementation, Temporary> | undefined>;

  override update(
    data: Macro.UpdateData | undefined,
    operation?: Macro.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Macro.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Macro.Database.GetOptions): Macro.Implementation | null;

  static override getCollectionName<CollectionName extends Macro.EmbeddedName>(
    name: CollectionName,
  ): Macro.CollectionNameOf<CollectionName> | null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Macro.Flags.Scope, Key extends Macro.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Macro.Name, Scope, Key>;

  override setFlag<
    Scope extends Macro.Flags.Scope,
    Key extends Macro.Flags.Key<Scope>,
    Value extends Document.GetFlag<Macro.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Macro.Flags.Scope, Key extends Macro.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: Macro.CreateData,
    options: Macro.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Macro.CreateData, options: Macro.Database.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Macro.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Macro.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Macro.Implementation[],
    operation: Macro.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Macro.UpdateData,
    options: Macro.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(changed: Macro.UpdateData, options: Macro.Database.OnUpdateOperation, userId: string): void;

  protected static _preUpdateOperation(
    documents: Macro.Implementation[],
    operation: Macro.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Macro.Implementation[],
    operation: Macro.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(options: Macro.Database.PreDeleteOptions, user: User.Implementation): Promise<boolean | void>;

  protected _onDelete(options: Macro.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Macro.Implementation[],
    operation: Macro.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Macro.Implementation[],
    operation: Macro.Database.Delete,
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

  protected static _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  protected static _onCreateDocuments(
    documents: Macro.Implementation[],
    context: Document.ModificationContext<Macro.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Macro.Implementation[],
    context: Document.ModificationContext<Macro.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Macro.Implementation[],
    context: Document.ModificationContext<Macro.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<Macro.Schema>;

  static get schema(): SchemaField<Macro.Schema>;

  static override validateJoint(data: Macro.Source): void;

  static override fromSource(
    source: Macro.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Macro.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Macro.Schema, DataModel.Any | null>;
}
export default BaseMacro;

declare namespace BaseMacro {
  export import SubType = Macro.SubType;
  export import Name = Macro.Name;
  export import ConstructorArgs = Macro.ConstructorArgs;
  export import Hierarchy = Macro.Hierarchy;
  export import Metadata = Macro.Metadata;
  export import Parent = Macro.Parent;
  export import Pack = Macro.Pack;
  export import Embedded = Macro.Embedded;
  export import EmbeddedName = Macro.EmbeddedName;
  export import EmbeddedCollectionName = Macro.EmbeddedCollectionName;
  export import ParentCollectionName = Macro.ParentCollectionName;
  export import Stored = Macro.Stored;
  export import Source = Macro.Source;
  export import PersistedData = Macro.PersistedData;
  export import CreateData = Macro.CreateData;
  export import InitializedData = Macro.InitializedData;
  export import UpdateData = Macro.UpdateData;
  export import Schema = Macro.Schema;
  export import DatabaseOperation = Macro.Database;
  export import Flags = Macro.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseMacro.SubType | `BaseMacro.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseMacro.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseMacro.CreateData | `BaseMacro.CreateData`}
   */
  type ConstructorData = BaseMacro.CreateData;
}

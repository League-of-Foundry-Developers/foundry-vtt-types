import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Combat Document.
 * Defines the DataSchema and common behaviors for a Combat which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseCombat<out SubType extends BaseCombat.SubType = BaseCombat.SubType> extends Document<
  "Combat",
  BaseCombat._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseCombat`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseCombat` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Combat.implementation | `new Combat.implementation(...)`} instead which will give you
   * a system specific implementation of `Combat`.
   */
  constructor(...args: Document.ConstructorParameters<BaseCombat.CreateData, BaseCombat.Parent>);

  static override metadata: BaseCombat.Metadata;

  static override defineSchema(): BaseCombat.Schema;

  /**
   * Is a user able to update an existing Combat?
   * @internal
   */
  static #canUpdate(user: User.Implementation, doc: BaseCombat, data: BaseCombat.UpdateData): boolean;

  /**
   * Can a certain User change the Combat round?
   * @param user - The user attempting to change the round
   * @returns Is the user allowed to change the round?
   */
  protected _canChangeRound(user: User.Implementation): boolean;

  /**
   * Can a certain User change the Combat turn?
   * @param user - The user attempting to change the turn
   * @returns Is the user allowed to change the turn?
   */
  protected _canChangeTurn(user: User.Implementation): boolean;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "Combat";

  static get implementation(): Combat.ImplementationClass;

  override system: Document.SystemFor<"Combat", SubType>;

  override parent: BaseCombat.Parent;

  static get TYPES(): BaseCombat.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Combat.Implementation | Combat.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Combat.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Combat.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Combat.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Combat.DatabaseOperation.Update>,
  ): Promise<Combat.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Combat.DatabaseOperation.Delete>,
  ): Promise<Combat.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: Combat.CreateData | Combat.CreateData[],
    operation?: Document.Database.CreateOperation<Combat.DatabaseOperation.Create<Temporary>>,
  ): Promise<Combat.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Combat.Implementation | null;

  protected _preCreate(
    data: Combat.CreateData,
    options: Combat.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: Combat.CreateData,
    options: Combat.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: Combat.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Combat.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Combat.Implementation[],
    operation: Combat.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Combat.UpdateData,
    options: Combat.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Combat.UpdateData,
    options: Combat.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Combat.Implementation[],
    operation: Combat.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Combat.Implementation[],
    operation: Combat.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Combat.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Combat.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Combat.Implementation[],
    operation: Combat.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Combat.Implementation[],
    operation: Combat.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Combat.Implementation[],
    context: Document.ModificationContext<Combat.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Combat.Implementation[],
    context: Document.ModificationContext<Combat.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Combat.Implementation[],
    context: Document.ModificationContext<Combat.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<Combat.Schema>;

  static get schema(): SchemaField<Combat.Schema>;

  static validateJoint(data: Combat.Source): void;

  static override fromSource(
    source: Combat.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Combat.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Combat.Schema, DataModel.Any | null>;
}

export default BaseCombat;

declare namespace BaseCombat {
  export import Metadata = Combat.Metadata;
  export import SubType = Combat.SubType;
  export import Parent = Combat.Parent;
  export import Stored = Combat.Stored;
  export import Source = Combat.Source;
  export import PersistedData = Combat.PersistedData;
  export import CreateData = Combat.CreateData;
  export import InitializedData = Combat.InitializedData;
  export import UpdateData = Combat.UpdateData;
  export import Schema = Combat.Schema;
  export import DatabaseOperation = Combat.DatabaseOperation;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends Combat.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseCombat.SubType | `BaseCombat.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseCombat.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseCombat.CreateData | `BaseCombat.CreateData`}
   */
  type ConstructorData = BaseCombat.CreateData;
}

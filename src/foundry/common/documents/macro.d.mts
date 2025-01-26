import type { AnyMutableObject, InexactPartial } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.d.mts";
import type * as CONST from "../constants.mts";
import type { SchemaField } from "../data/fields.d.mts";

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
   * @param data    - Initial data from which to construct the Macro
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseMacro.CreateData, context?: Document.ConstructionContext<BaseMacro.Parent>);

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
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " __fvtt_types_internal_document_name_static": "Macro";

  static get implementation(): Macro.ImplementationClass;

  override parent: BaseMacro.Parent;

  static get TYPES(): BaseMacro.SubType[];

  static createDocuments<Temporary extends boolean | undefined>(
    data: Array<Macro.Implementation | Macro.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Macro.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Macro.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Macro.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Macro.DatabaseOperation.Update>,
  ): Promise<Macro.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Macro.DatabaseOperation.Delete>,
  ): Promise<Macro.Implementation[]>;

  static create<Temporary extends boolean | undefined>(
    data: Macro.CreateData | Macro.CreateData[],
    operation?: Document.Database.CreateOperation<Macro.DatabaseOperation.Create<Temporary>>,
  ): Promise<Macro.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Macro.Implementation | null;

  protected _preCreate(
    data: Macro.CreateData,
    options: Macro.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Macro.CreateData, options: Macro.DatabaseOperation.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Macro.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Macro.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Macro.Implementation[],
    operation: Macro.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Macro.UpdateData,
    options: Macro.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Macro.UpdateData,
    options: Macro.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Macro.Implementation[],
    operation: Macro.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Macro.Implementation[],
    operation: Macro.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Macro.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Macro.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Macro.Implementation[],
    operation: Macro.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Macro.Implementation[],
    operation: Macro.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

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
  export import Metadata = Macro.Metadata;
  export import SubType = Macro.SubType;
  export import Parent = Macro.Parent;
  export import Stored = Macro.Stored;
  export import Source = Macro.Source;
  export import PersistedData = Macro.PersistedData;
  export import CreateData = Macro.CreateData;
  export import InitializedData = Macro.InitializedData;
  export import UpdateData = Macro.UpdateData;
  export import Schema = Macro.Schema;
  export import DatabaseOperation = Macro.DatabaseOperation;

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

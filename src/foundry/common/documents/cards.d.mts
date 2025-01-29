import type { AnyMutableObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Cards Document.
 * Defines the DataSchema and common behaviors for a Cards Document which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseCards<out SubType extends BaseCards.SubType = BaseCards.SubType> extends Document<
  "Cards",
  BaseCards._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the Cards
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseCards.CreateData, context?: Document.ConstructionContext<BaseCards.Parent>);

  static override metadata: BaseCards.Metadata;

  static override defineSchema(): BaseCards.Schema;

  /**
   * The default icon used for a cards stack that does not have a custom image set
   * @defaultValue `"icons/svg/card-hand.svg"`
   */
  static DEFAULT_ICON: string;

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " __fvtt_types_internal_document_name_static": "Cards";

  static get implementation(): Cards.ImplementationClass;

  override system: Document.SystemFor<"Cards", SubType>;

  override parent: BaseCards.Parent;

  static get TYPES(): BaseCards.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Cards.Implementation | Cards.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Cards.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Cards.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Cards.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Cards.DatabaseOperation.Update>,
  ): Promise<Cards.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Cards.DatabaseOperation.Delete>,
  ): Promise<Cards.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: Cards.CreateData | Cards.CreateData[],
    operation?: Document.Database.CreateOperation<Cards.DatabaseOperation.Create<Temporary>>,
  ): Promise<Cards.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Cards.Implementation | null;

  protected _preCreate(
    data: Cards.CreateData,
    options: Cards.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Cards.CreateData, options: Cards.DatabaseOperation.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Cards.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Cards.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Cards.Implementation[],
    operation: Cards.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Cards.UpdateData,
    options: Cards.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Cards.UpdateData,
    options: Cards.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Cards.Implementation[],
    operation: Cards.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Cards.Implementation[],
    operation: Cards.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Cards.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Cards.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Cards.Implementation[],
    operation: Cards.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Cards.Implementation[],
    operation: Cards.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Cards.Implementation[],
    context: Document.ModificationContext<Cards.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Cards.Implementation[],
    context: Document.ModificationContext<Cards.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Cards.Implementation[],
    context: Document.ModificationContext<Cards.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<Cards.Schema>;

  static get schema(): SchemaField<Cards.Schema>;

  static validateJoint(data: Cards.Source): void;

  static override fromSource(
    source: Cards.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Cards.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Cards.Schema, DataModel.Any | null>;
}

export default BaseCards;

declare namespace BaseCards {
  export import Metadata = Cards.Metadata;
  export import SubType = Cards.SubType;
  export import Parent = Cards.Parent;
  export import Stored = Cards.Stored;
  export import Source = Cards.Source;
  export import PersistedData = Cards.PersistedData;
  export import CreateData = Cards.CreateData;
  export import InitializedData = Cards.InitializedData;
  export import UpdateData = Cards.UpdateData;
  export import Schema = Cards.Schema;
  export import DatabaseOperation = Cards.DatabaseOperation;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends Cards.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseCards.SubType | `BaseCards.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseCards.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseCards.CreateData | `BaseCards.CreateData`}
   */
  type ConstructorData = BaseCards.CreateData;
}

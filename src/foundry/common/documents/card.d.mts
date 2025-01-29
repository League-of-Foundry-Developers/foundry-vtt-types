import type { InexactPartial } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Card Document.
 * Defines the DataSchema and common behaviors for a Card which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseCard<out SubType extends BaseCard.SubType = BaseCard.SubType> extends Document<
  "Card",
  BaseCard._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the Card
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseCard.CreateData, context?: Document.ConstructionContext<BaseCard.Parent>);

  static override metadata: BaseCard.Metadata;

  static override defineSchema(): BaseCard.Schema;

  /**
   * The default icon used for a Card face that does not have a custom image set
   * @defaultValue `"icons/svg/card-joker.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * Is a User able to create a new Card within this parent?
   */
  static #canCreate(user: User.Implementation, doc: BaseCard, data: BaseCard.CreateData): boolean;

  /**
   * Is a user able to update an existing Card?
   */
  static #canUpdate(user: User.Implementation, doc: BaseCard, data: BaseCard.UpdateData): boolean;

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

  static " __fvtt_types_internal_document_name_static": "Card";

  static get implementation(): Card.ImplementationClass;

  override system: Document.SystemFor<"Card", SubType>;

  override parent: BaseCard.Parent;

  static get TYPES(): BaseCard.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Card.Implementation | Card.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Card.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Card.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Card.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Card.DatabaseOperation.Update>,
  ): Promise<Card.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Card.DatabaseOperation.Delete>,
  ): Promise<Card.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: Card.CreateData | Card.CreateData[],
    operation?: Document.Database.CreateOperation<Card.DatabaseOperation.Create<Temporary>>,
  ): Promise<Card.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Card.Implementation | null;

  protected _preCreate(
    data: Card.CreateData,
    options: Card.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Card.CreateData, options: Card.DatabaseOperation.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Card.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Card.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Card.Implementation[],
    operation: Card.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Card.UpdateData,
    options: Card.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Card.UpdateData,
    options: Card.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Card.Implementation[],
    operation: Card.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Card.Implementation[],
    operation: Card.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Card.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Card.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Card.Implementation[],
    operation: Card.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Card.Implementation[],
    operation: Card.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Card.Implementation[],
    context: Document.ModificationContext<Card.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Card.Implementation[],
    context: Document.ModificationContext<Card.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Card.Implementation[],
    context: Document.ModificationContext<Card.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<Card.Schema>;

  static get schema(): SchemaField<Card.Schema>;

  static validateJoint(data: Card.Source): void;

  static override fromSource(
    source: Card.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Card.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Card.Schema, DataModel.Any | null>;
}

export default BaseCard;

declare namespace BaseCard {
  export import Metadata = Card.Metadata;
  export import SubType = Card.SubType;
  export import Parent = Card.Parent;
  export import Stored = Card.Stored;
  export import Source = Card.Source;
  export import PersistedData = Card.PersistedData;
  export import CreateData = Card.CreateData;
  export import InitializedData = Card.InitializedData;
  export import UpdateData = Card.UpdateData;
  export import Schema = Card.Schema;
  export import DatabaseOperation = Card.DatabaseOperation;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends Card.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseCard.SubType | `BaseCard.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseCard.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseCard.CreateData | `BaseCard.CreateData`}
   */
  type ConstructorData = BaseCard.CreateData;
}

import type { AnyObject, InexactPartial } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";

/**
 * The ActiveEffect Document.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseActiveEffect<
  out SubType extends BaseActiveEffect.SubType = BaseActiveEffect.SubType,
> extends Document<"ActiveEffect", BaseActiveEffect._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the ActiveEffect
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is causing a circular error.
  // constructor(data?: BaseActiveEffect.ConstructorData, context?: Document.ConstructionContext<BaseActiveEffect.Parent>);

  override canUserModify(
    user: User.ConfiguredInstance,
    action: "create" | "update" | "delete",
    data?: AnyObject,
  ): boolean;

  static override metadata: BaseActiveEffect.Metadata;

  static override defineSchema(): BaseActiveEffect.Schema;

  override testUserPermission(
    user: User.ConfiguredInstance,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

  /**
   * @privateRemarks _preCreate overridden but with no signature changes.
   * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
   */

  static override migrateData(source: AnyObject): AnyObject;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks Replaced by `name`
   */
  get label(): this["name"];

  set label(value);

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks Replaced by `img`
   */
  get icon(): this["img"];

  set icon(value);

  /**
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overrideable.
   */

  static " __fvtt_types_internal_document_name_static": "ActiveEffect";

  override system: Document.SystemFor<"ActiveEffect", SubType>;

  override parent: BaseActiveEffect.Parent;

  static get TYPES(): BaseActiveEffect.SubType[];

  static createDocuments<Temporary extends boolean | undefined>(
    data: Array<ActiveEffect.Implementation | ActiveEffect.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<ActiveEffect.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<ActiveEffect.Implementation, Temporary>>>;

  static updateDocuments(
    updates: ActiveEffect.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<ActiveEffect.DatabaseOperation.Update>,
  ): Promise<ActiveEffect.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<ActiveEffect.DatabaseOperation.Delete>,
  ): Promise<ActiveEffect.Implementation[]>;

  static create<Temporary extends boolean | undefined>(
    data: ActiveEffect.CreateData | ActiveEffect.CreateData[],
    operation?: Document.Database.CreateOperation<ActiveEffect.DatabaseOperation.Create<Temporary>>,
  ): Promise<ActiveEffect.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): ActiveEffect.Implementation | null;

  protected _preCreate(
    data: ActiveEffect.CreateData,
    options: ActiveEffect.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: ActiveEffect.CreateData, options: ActiveEffect.DatabaseOperation.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: ActiveEffect.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<ActiveEffect.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: ActiveEffect.Implementation[],
    operation: ActiveEffect.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: ActiveEffect.UpdateData,
    options: ActiveEffect.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: ActiveEffect.UpdateData,
    options: ActiveEffect.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: ActiveEffect.Implementation[],
    operation: ActiveEffect.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: ActiveEffect.Implementation[],
    operation: ActiveEffect.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: ActiveEffect.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: ActiveEffect.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: ActiveEffect.Implementation[],
    operation: ActiveEffect.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: ActiveEffect.Implementation[],
    operation: ActiveEffect.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: ActiveEffect.Implementation[],
    context: Document.ModificationContext<ActiveEffect.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: ActiveEffect.Implementation[],
    context: Document.ModificationContext<ActiveEffect.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: ActiveEffect.Implementation[],
    context: Document.ModificationContext<ActiveEffect.Parent>,
  ): Promise<void>;
}

export default BaseActiveEffect;

declare namespace BaseActiveEffect {
  export import Metadata = ActiveEffect.Metadata;
  export import SubType = ActiveEffect.SubType;
  export import Parent = ActiveEffect.Parent;
  export import Stored = ActiveEffect.Stored;
  export import Source = ActiveEffect.Source;
  export import PersistedData = ActiveEffect.PersistedData;
  export import CreateData = ActiveEffect.CreateData;
  export import InitializedData = ActiveEffect.InitializedData;
  export import UpdateData = ActiveEffect.UpdateData;
  export import Schema = ActiveEffect.Schema;
  export import DatabaseOperation = ActiveEffect.DatabaseOperation;
  export import CoreFlags = ActiveEffect.CoreFlags;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends ActiveEffect.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = fields.SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseActiveEffect.SubType | `BaseActiveEffect.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link fields.SchemaField | `SchemaField<BaseActiveEffect.Schema>`}
   */
  type SchemaField = fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseActiveEffect.CreateData | `BaseActiveEffect.CreateData`}
   */
  type ConstructorData = BaseActiveEffect.CreateData;
}

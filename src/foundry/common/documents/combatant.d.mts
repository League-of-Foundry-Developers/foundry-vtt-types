import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.d.mts";
import type { SchemaField } from "../data/fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Combatant Document.
 * Defines the DataSchema and common behaviors for a Combatant which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseCombatant<
  out SubType extends BaseCombatant.SubType = BaseCombatant.SubType,
> extends Document<"Combatant", BaseCombatant._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Combatant
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseCombatant.CreateData, context?: Document.ConstructionContext<BaseCombatant.Parent>);

  static override metadata: BaseCombatant.Metadata;

  static override defineSchema(): BaseCombatant.Schema;

  /**
   * Is a user able to update an existing Combatant?
   * @internal
   */
  static #canUpdate(user: User.Implementation, doc: BaseCombatant, data: BaseCombatant.UpdateData): boolean;

  /**
   * Is a user able to create this Combatant?
   * @internal
   */
  static #canCreate(user: User.Implementation, doc: BaseCombatant, data: BaseCombatant.CreateData): boolean;

  override getUserLevel(user?: User.Implementation): DOCUMENT_OWNERSHIP_LEVELS | null;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static "~ fvtt_types_internal_document_name_static": "Combatant";

  static get implementation(): Combatant.ImplementationClass;

  override system: Document.SystemFor<"Combatant", SubType>;

  override parent: BaseCombatant.Parent;

  static get TYPES(): BaseCombatant.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Combatant.Implementation | Combatant.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Combatant.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Combatant.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Combatant.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Combatant.DatabaseOperation.Update>,
  ): Promise<Combatant.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Combatant.DatabaseOperation.Delete>,
  ): Promise<Combatant.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: Combatant.CreateData | Combatant.CreateData[],
    operation?: Document.Database.CreateOperation<Combatant.DatabaseOperation.Create<Temporary>>,
  ): Promise<Combatant.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Combatant.Implementation | null;

  protected _preCreate(
    data: Combatant.CreateData,
    options: Combatant.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: Combatant.CreateData,
    options: Combatant.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: Combatant.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Combatant.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Combatant.UpdateData,
    options: Combatant.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Combatant.UpdateData,
    options: Combatant.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Combatant.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Combatant.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Combatant.Implementation[],
    context: Document.ModificationContext<Combatant.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Combatant.Implementation[],
    context: Document.ModificationContext<Combatant.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Combatant.Implementation[],
    context: Document.ModificationContext<Combatant.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<Combatant.Schema>;

  static get schema(): SchemaField<Combatant.Schema>;

  static validateJoint(data: Combatant.Source): void;

  static override fromSource(
    source: Combatant.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Combatant.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Combatant.Schema, DataModel.Any | null>;
}

export default BaseCombatant;

declare namespace BaseCombatant {
  export import Metadata = Combatant.Metadata;
  export import SubType = Combatant.SubType;
  export import Parent = Combatant.Parent;
  export import Stored = Combatant.Stored;
  export import Source = Combatant.Source;
  export import PersistedData = Combatant.PersistedData;
  export import CreateData = Combatant.CreateData;
  export import InitializedData = Combatant.InitializedData;
  export import UpdateData = Combatant.UpdateData;
  export import Schema = Combatant.Schema;
  export import DatabaseOperation = Combatant.DatabaseOperation;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends Combatant.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseCombatant.SubType | `BaseCombatant.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseCombatant.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseCombatant.CreateData | `BaseCombatant.CreateData`}
   */
  type ConstructorData = BaseCombatant.CreateData;
}

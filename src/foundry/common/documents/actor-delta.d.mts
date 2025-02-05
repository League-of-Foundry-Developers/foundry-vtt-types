import type { AnyMutableObject, AnyObject, InexactPartial } from "fvtt-types/utils";
import type Document from "../abstract/document.mts";
import type { fields } from "../data/module.d.mts";
import type { CONST, documents } from "../../client-esm/client.d.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type DataModel from "../abstract/data.d.mts";

/**
 * The ActorDelta Document.
 * Defines the DataSchema and common behaviors for an ActorDelta which are shared between both client and server.
 * ActorDeltas store a delta that can be applied to a particular Actor in order to produce a new Actor.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseActorDelta<
  // TODO(LukeAbby): Look into variance woes. This can't be marked covariant. This is caused by `IntentionalPartial<SystemFor<"Actor", SubType & ActorDelta.SubType>>`.
  SubType extends BaseActorDelta.SubType = BaseActorDelta.SubType,
> extends Document<"ActorDelta", BaseActorDelta._Schema, any> {
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseActorDelta.CreateData, context?: Document.ConstructionContext<BaseActorDelta.Parent>);

  static override metadata: BaseActorDelta.Metadata;

  static override defineSchema(): BaseActorDelta.Schema;

  override canUserModify(
    user: User.Internal.Implementation,
    action: "create" | "update" | "delete",
    data?: AnyObject,
  ): boolean;

  override testUserPermission(
    user: User.Internal.Implementation,
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
   * Retrieve the base actor's collection, if it exists.
   * @param collectionName - The collection name.
   */
  getBaseCollection(collectionName: string): Collection<Actor> | undefined;

  static applyDelta(
    delta: BaseActorDelta,
    baseActor: documents.BaseActor,
    context: unknown,
  ): Document.ConfiguredClassForName<"Actor"> | null;

  static migrateData(source: AnyMutableObject): AnyMutableObject;

  //TODO: Figure out if this override still applies
  toObject(source: true): this["_source"];
  toObject(source?: boolean): ReturnType<this["schema"]["toObject"]>;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "ActorDelta";

  override system: Document.SystemFor<"ActorDelta", SubType>;

  override parent: BaseActorDelta.Parent;

  static get TYPES(): BaseActorDelta.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<ActorDelta.Implementation | ActorDelta.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<ActorDelta.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<ActorDelta.Implementation, Temporary>>>;

  static updateDocuments(
    updates: ActorDelta.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<ActorDelta.DatabaseOperation.Update>,
  ): Promise<ActorDelta.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<ActorDelta.DatabaseOperation.Delete>,
  ): Promise<ActorDelta.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: ActorDelta.CreateData | ActorDelta.CreateData[],
    operation?: Document.Database.CreateOperation<ActorDelta.DatabaseOperation.Create<Temporary>>,
  ): Promise<ActorDelta.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): ActorDelta.Implementation | null;

  protected _preCreate(
    data: ActorDelta.CreateData,
    options: ActorDelta.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: ActorDelta.CreateData,
    options: ActorDelta.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: ActorDelta.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<ActorDelta.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: ActorDelta.Implementation[],
    operation: ActorDelta.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: ActorDelta.UpdateData,
    options: ActorDelta.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: ActorDelta.UpdateData,
    options: ActorDelta.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: ActorDelta.Implementation[],
    operation: ActorDelta.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: ActorDelta.Implementation[],
    operation: ActorDelta.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: ActorDelta.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: ActorDelta.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: ActorDelta.Implementation[],
    operation: ActorDelta.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: ActorDelta.Implementation[],
    operation: ActorDelta.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: ActorDelta.Implementation[],
    context: Document.ModificationContext<ActorDelta.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: ActorDelta.Implementation[],
    context: Document.ModificationContext<ActorDelta.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: ActorDelta.Implementation[],
    context: Document.ModificationContext<ActorDelta.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<ActorDelta.Schema>;

  static get schema(): SchemaField<ActorDelta.Schema>;

  static validateJoint(data: ActorDelta.Source): void;

  static override fromSource(
    source: ActorDelta.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<ActorDelta.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<ActorDelta.Schema, DataModel.Any | null>;
}

export default BaseActorDelta;

declare namespace BaseActorDelta {
  export import Metadata = ActorDelta.Metadata;
  export import SubType = ActorDelta.SubType;
  export import Parent = ActorDelta.Parent;
  export import Stored = ActorDelta.Stored;
  export import Source = ActorDelta.Source;
  export import PersistedData = ActorDelta.PersistedData;
  export import CreateData = ActorDelta.CreateData;
  export import InitializedData = ActorDelta.InitializedData;
  export import UpdateData = ActorDelta.UpdateData;
  export import Schema = ActorDelta.Schema;
  export import DatabaseOperation = ActorDelta.DatabaseOperation;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends ActorDelta.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = fields.SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseActorDelta.SubType | `BaseActorDelta.SubType`} */
  type TypeNames = Game.Model.TypeNames<"Actor">;

  /**
   * @deprecated {@link fields.SchemaField | `SchemaField<BaseActorDelta.Schema>`}
   */
  type SchemaField = fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseActorDelta.CreateData | `BaseActorDelta.CreateData`}
   */
  type ConstructorData = fields.SchemaField.CreateData<Schema>;
}

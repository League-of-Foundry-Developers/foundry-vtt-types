import type { AnyMutableObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Actor Document.
 * Defines the DataSchema and common behaviors for an Actor which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseActor<out SubType extends Actor.SubType = Actor.SubType> extends Document<
  "Actor",
  BaseActor._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseActor`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseActor` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Actor.implementation | `new Actor.implementation(...)`} instead which will give you
   * a system specific implementation of `Actor`.
   */
  constructor(...args: Document.ConstructorParameters<BaseActor.CreateData, BaseActor.Parent>);

  static override metadata: BaseActor.Metadata;

  static override defineSchema(): BaseActor.Schema;

  /**
   * The default icon used for newly created Actor documents.
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  static DEFAULT_ICON: string;

  /**
   * Determine default artwork based on the provided actor data
   * @param actorData - The source actor data
   */
  static getDefaultArtwork(actorData: BaseActor.CreateData): {
    img: string;
    texture: { src: string };
  };

  protected override _initializeSource(
    data: BaseActor.CreateData | this,
    options?: Omit<foundry.abstract.DataModel.DataValidationOptions, "parent">,
  ): BaseActor.Source;

  static override canUserCreate(user: User.Implementation): boolean;

  /**
   * @privateRemarks _preCreate and _preUpdate are overridden but with no signature changes.
   * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
   */

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "Actor";

  static get implementation(): Actor.ImplementationClass;

  override parent: Actor.Parent;

  override system: Document.SystemFor<"Actor", SubType>;

  static get TYPES(): BaseActor.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Actor.Implementation | Actor.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Actor.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Actor.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Actor.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Actor.DatabaseOperation.Update>,
  ): Promise<Actor.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Actor.DatabaseOperation.Delete>,
  ): Promise<Actor.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: Actor.CreateData | Actor.CreateData[],
    operation?: Document.Database.CreateOperation<Actor.DatabaseOperation.Create<Temporary>>,
  ): Promise<Actor.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOptions): Actor.Implementation | null;

  protected _preCreate(
    data: Actor.CreateData,
    options: Actor.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Actor.CreateData, options: Actor.DatabaseOperation.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Actor.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Actor.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Actor.Implementation[],
    operation: Actor.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Actor.UpdateData,
    options: Actor.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Actor.UpdateData,
    options: Actor.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Actor.Implementation[],
    operation: Actor.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Actor.Implementation[],
    operation: Actor.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Actor.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Actor.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Actor.Implementation[],
    operation: Actor.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Actor.Implementation[],
    operation: Actor.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Actor.Implementation[],
    context: Document.ModificationContext<Actor.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Actor.Implementation[],
    context: Document.ModificationContext<Actor.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Actor.Implementation[],
    context: Document.ModificationContext<Actor.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<Actor.Schema>;

  static get schema(): SchemaField<Actor.Schema>;

  static validateJoint(data: Actor.Source): void;

  static override fromSource(
    source: Actor.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Actor.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Actor.Schema, DataModel.Any | null>;

  #baseActor: true;
}

declare namespace BaseActor {
  export import Metadata = Actor.Metadata;
  export import SubType = Actor.SubType;
  export import Parent = Actor.Parent;
  export import Stored = Actor.Stored;
  export import Source = Actor.Source;
  export import PersistedData = Actor.PersistedData;
  export import CreateData = Actor.CreateData;
  export import InitializedData = Actor.InitializedData;
  export import UpdateData = Actor.UpdateData;
  export import Schema = Actor.Schema;
  export import DatabaseOperation = Actor.DatabaseOperation;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends Actor.Schema {
    // For performance reasons don't bother calculating the `system` field.
    // This is overridden anyways.
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  interface Properties extends SchemaField.InitializedData<Schema> {}

  /**
   * @deprecated {@link BaseActor.SubType | `BaseActor.SubType`}
   */
  type TypeNames = Game.Model.TypeNames<"Actor">;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseActor.Schema>`}
   */
  interface SchemaField extends foundry.data.fields.SchemaField<Schema> {}

  /**
   * @deprecated {@link BaseActor.CreateData | `BaseActor.CreateData`}
   */
  interface ConstructorData extends SchemaField.CreateData<Schema> {}
}

export default BaseActor;

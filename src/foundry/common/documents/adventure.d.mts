import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type { fields } from "../data/module.d.mts";

/**
 * The Adventure Document.
 * Defines the DataSchema and common behaviors for an Adventure which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseAdventure extends Document<"Adventure", BaseAdventure.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Actor
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseAdventure.ConstructorData, context?: Document.ConstructionContext<BaseAdventure.Parent>);

  static override metadata: Adventure.Metadata;

  static override defineSchema(): BaseAdventure.Schema;

  /**
   * An array of the fields which provide imported content from the Adventure.
   */
  static get contentFields(): BaseAdventure.ContentFields;

  /**
   * Provide a thumbnail image path used to represent the Adventure document.
   */
  get thumbnail(): string;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " __fvtt_types_internal_document_name_static": "Adventure";

  static get implementation(): Adventure.ImplementationClass;

  override parent: Adventure.Parent;

  static createDocuments<Temporary extends boolean | undefined>(
    data: Array<Adventure.Implementation | Adventure.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Adventure.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Adventure.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Adventure.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Adventure.DatabaseOperation.Update>,
  ): Promise<Adventure.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Adventure.DatabaseOperation.Delete>,
  ): Promise<Adventure.Implementation[]>;

  static create<Temporary extends boolean | undefined>(
    data: Adventure.CreateData | Adventure.CreateData[],
    operation?: Document.Database.CreateOperation<Adventure.DatabaseOperation.Create<Temporary>>,
  ): Promise<Adventure.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Adventure.Implementation | null;

  protected _preCreate(
    data: Adventure.CreateData,
    options: Adventure.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: Adventure.CreateData,
    options: Adventure.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: Adventure.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Adventure.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Adventure.UpdateData,
    options: Adventure.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Adventure.UpdateData,
    options: Adventure.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Adventure.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Adventure.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Adventure.Implementation[],
    operation: Adventure.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Adventure.Implementation[],
    context: Document.ModificationContext<Adventure.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Adventure.Implementation[],
    context: Document.ModificationContext<Adventure.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Adventure.Implementation[],
    context: Document.ModificationContext<Adventure.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<Adventure.Schema>;

  static get schema(): SchemaField<Adventure.Schema>;

  static validateJoint(data: Adventure.Source): void;

  static override fromSource(
    source: Adventure.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Adventure.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Adventure.Schema, DataModel.Any | null>;
}

export default BaseAdventure;

declare namespace BaseAdventure {
  export import Metadata = Adventure.Metadata;
  export import Parent = Adventure.Parent;
  export import Stored = Adventure.Stored;
  export import Source = Adventure.Source;
  export import PersistedData = Adventure.PersistedData;
  export import CreateData = Adventure.CreateData;
  export import InitializedData = Adventure.InitializedData;
  export import UpdateData = Adventure.UpdateData;
  export import Schema = Adventure.Schema;
  export import DatabaseOperation = Adventure.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseAdventure.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseAdventure.CreateData | `BaseAdventure.CreateData`}
   */
  type ConstructorData = BaseAdventure.CreateData;

  /**
   * A helper type to extract the return value for {@link BaseAdventure.contentFields}
   */
  type ContentFields = {
    [Key in keyof BaseAdventure.Schema as BaseAdventure.Schema[Key] extends fields.SetField.Any
      ? Key
      : never]: BaseAdventure.Schema[Key] extends fields.SetField<
      infer ElementType,
      infer _1,
      infer _2,
      infer _3,
      infer _4,
      infer _5,
      infer _6,
      infer _7
    >
      ? ElementType extends fields.EmbeddedDataField<infer ModelType, infer _8, infer _9, infer _10, infer _11>
        ? ModelType extends Document.AnyConstructor // TODO: This doesn't seem to quite work to ensure it's the configured class
          ? ModelType["implementation"]
          : ModelType
        : never
      : never;
  };
}

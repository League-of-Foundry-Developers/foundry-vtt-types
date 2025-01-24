import type { AnyObject, InexactPartial } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for a Drawing.
 * Defines the DataSchema and common behaviors for a Drawing which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseDrawing extends Document<"Drawing", BaseDrawing.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Drawing
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseDrawing.ConstructorData, context?: Document.ConstructionContext<BaseDrawing.Parent>);

  static override metadata: BaseDrawing.Metadata;

  static override defineSchema(): BaseDrawing.Schema;

  /**
   * Validate whether the drawing has some visible content (as required by validation).
   */
  static #validateVisibleContent(data: BaseDrawing.UpdateData): boolean;

  /**
   * Is a user able to update or delete an existing Drawing document??
   * @internal
   */
  static #canModify(user: User.ConfiguredInstance, doc: BaseDrawing, data: BaseDrawing.UpdateData): boolean;

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

  static override cleanData(source?: AnyObject, options?: foundry.data.fields.DataField.CleanOptions): AnyObject;

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " __fvtt_types_internal_document_name_static": "Drawing";

  static get implementation(): DrawingDocument.ImplementationClass;

  override parent: DrawingDocument.Parent;

  static createDocuments<Temporary extends boolean | undefined>(
    data: Array<DrawingDocument.Implementation | DrawingDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<DrawingDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<DrawingDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: DrawingDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<DrawingDocument.DatabaseOperation.Update>,
  ): Promise<DrawingDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<DrawingDocument.DatabaseOperation.Delete>,
  ): Promise<DrawingDocument.Implementation[]>;

  static create<Temporary extends boolean | undefined>(
    data: DrawingDocument.CreateData | DrawingDocument.CreateData[],
    operation?: Document.Database.CreateOperation<DrawingDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<DrawingDocument.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): DrawingDocument.Implementation | null;

  protected _preCreate(
    data: DrawingDocument.CreateData,
    options: DrawingDocument.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: DrawingDocument.CreateData,
    options: DrawingDocument.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: DrawingDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<DrawingDocument.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: DrawingDocument.Implementation[],
    operation: DrawingDocument.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: DrawingDocument.UpdateData,
    options: DrawingDocument.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: DrawingDocument.UpdateData,
    options: DrawingDocument.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: DrawingDocument.Implementation[],
    operation: DrawingDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: DrawingDocument.Implementation[],
    operation: DrawingDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: DrawingDocument.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: DrawingDocument.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: DrawingDocument.Implementation[],
    operation: DrawingDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: DrawingDocument.Implementation[],
    operation: DrawingDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: DrawingDocument.Implementation[],
    context: Document.ModificationContext<DrawingDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: DrawingDocument.Implementation[],
    context: Document.ModificationContext<DrawingDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: DrawingDocument.Implementation[],
    context: Document.ModificationContext<DrawingDocument.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<DrawingDocument.Schema>;

  static get schema(): SchemaField<DrawingDocument.Schema>;

  static validateJoint(data: DrawingDocument.Source): void;

  static override fromSource(
    source: DrawingDocument.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<DrawingDocument.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<DrawingDocument.Schema, DataModel.Any | null>;
}

export default BaseDrawing;

declare namespace BaseDrawing {
  export import Metadata = DrawingDocument.Metadata;
  export import Parent = DrawingDocument.Parent;
  export import Stored = DrawingDocument.Stored;
  export import Source = DrawingDocument.Source;
  export import PersistedData = DrawingDocument.PersistedData;
  export import CreateData = DrawingDocument.CreateData;
  export import InitializedData = DrawingDocument.InitializedData;
  export import UpdateData = DrawingDocument.UpdateData;
  export import Schema = DrawingDocument.Schema;
  export import DatabaseOperation = DrawingDocument.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseDrawing.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseDrawing.CreateData | `BaseDrawing.CreateData`}
   */
  type ConstructorData = BaseDrawing.CreateData;
}

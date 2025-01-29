import type { AnyObject, AnyMutableObject, InexactPartial } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for a Note.
 * Defines the DataSchema and common behaviors for a Note which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseNote extends Document<"Note", BaseNote.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Note
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseNote.ConstructorData, context?: Document.ConstructionContext<BaseNote.Parent>);

  static override metadata: BaseNote.Metadata;

  static override defineSchema(): BaseNote.Schema;

  /**
   * The default icon used for newly created Note documents.
   * @defaultValue `"icons/svg/book.svg"`
   */
  static DEFAULT_ICON: string;

  override testUserPermission(
    user: User.Implementation,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

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

  static " __fvtt_types_internal_document_name_static": "Note";

  static get implementation(): NoteDocument.ImplementationClass;

  override parent: NoteDocument.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<NoteDocument.Implementation | NoteDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<NoteDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<NoteDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: NoteDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<NoteDocument.DatabaseOperation.Update>,
  ): Promise<NoteDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<NoteDocument.DatabaseOperation.Delete>,
  ): Promise<NoteDocument.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: NoteDocument.CreateData | NoteDocument.CreateData[],
    operation?: Document.Database.CreateOperation<NoteDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<NoteDocument.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): NoteDocument.Implementation | null;

  protected _preCreate(
    data: NoteDocument.CreateData,
    options: NoteDocument.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: NoteDocument.CreateData,
    options: NoteDocument.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: NoteDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<NoteDocument.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: NoteDocument.UpdateData,
    options: NoteDocument.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: NoteDocument.UpdateData,
    options: NoteDocument.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: NoteDocument.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: NoteDocument.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: NoteDocument.Implementation[],
    operation: NoteDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: NoteDocument.Implementation[],
    context: Document.ModificationContext<NoteDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: NoteDocument.Implementation[],
    context: Document.ModificationContext<NoteDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: NoteDocument.Implementation[],
    context: Document.ModificationContext<NoteDocument.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<NoteDocument.Schema>;

  static get schema(): SchemaField<NoteDocument.Schema>;

  static validateJoint(data: NoteDocument.Source): void;

  static override fromSource(
    source: NoteDocument.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<NoteDocument.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<NoteDocument.Schema, DataModel.Any | null>;
}

export default BaseNote;

declare namespace BaseNote {
  export import Metadata = NoteDocument.Metadata;
  export import Parent = NoteDocument.Parent;
  export import Stored = NoteDocument.Stored;
  export import Source = NoteDocument.Source;
  export import PersistedData = NoteDocument.PersistedData;
  export import CreateData = NoteDocument.CreateData;
  export import InitializedData = NoteDocument.InitializedData;
  export import UpdateData = NoteDocument.UpdateData;
  export import Schema = NoteDocument.Schema;
  export import DatabaseOperation = NoteDocument.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseNote.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseNote.CreateData | `BaseNote.CreateData`}
   */
  type ConstructorData = BaseNote.CreateData;
}

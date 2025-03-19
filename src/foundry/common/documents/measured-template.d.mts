import type { AnyMutableObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for a MeasuredTemplate.
 * Defines the DataSchema and common behaviors for a MeasuredTemplate which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseMeasuredTemplate extends Document<"MeasuredTemplate", BaseMeasuredTemplate.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseMeasuredTemplate`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseMeasuredTemplate` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link MeasuredTemplateDocument.implementation | `new MeasuredTemplateDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `MeasuredTemplateDocument`.
   */
  constructor(...args: Document.ConstructorParameters<BaseMeasuredTemplate.CreateData, BaseMeasuredTemplate.Parent>);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "MeasuredTemplate",
   *   collection: "templates",
   *   label: "DOCUMENT.MeasuredTemplate",
   *   labelPlural: "DOCUMENT.MeasuredTemplates",
   *   isEmbedded: true,
   *   permissions: {
   *     create: this.#canCreate,
   *     update: this.#canUpdate
   *   },
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseMeasuredTemplate.Metadata;

  static override defineSchema(): BaseMeasuredTemplate.Schema;

  // options: not null (destructured)
  override testUserPermission(
    user: User.Internal.Implementation,
    permission: Document.TestableOwnershipLevel,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  /**
   * @remarks Migrates:
   * - `user` to `author`
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks Shims:
   * - `user` to `author` since v12, until v14
   */
  // options: not null (destructured)
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated since v12, until 14
   * @remarks "You are accessing `user` which has been migrated to `author`"
   */
  get user(): this["author"];
  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "MeasuredTemplate";

  static get implementation(): MeasuredTemplateDocument.ImplementationClass;

  override parent: MeasuredTemplateDocument.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<MeasuredTemplateDocument.Implementation | MeasuredTemplateDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<MeasuredTemplateDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<MeasuredTemplateDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: MeasuredTemplateDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<MeasuredTemplateDocument.DatabaseOperation.Update>,
  ): Promise<MeasuredTemplateDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<MeasuredTemplateDocument.DatabaseOperation.Delete>,
  ): Promise<MeasuredTemplateDocument.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: MeasuredTemplateDocument.CreateData | MeasuredTemplateDocument.CreateData[],
    operation?: Document.Database.CreateOperation<MeasuredTemplateDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<MeasuredTemplateDocument.Implementation | undefined>;

  static get(
    documentId: string,
    options?: Document.Database.GetOptions,
  ): MeasuredTemplateDocument.Implementation | null;

  protected _preCreate(
    data: MeasuredTemplateDocument.CreateData,
    options: MeasuredTemplateDocument.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: MeasuredTemplateDocument.CreateData,
    options: MeasuredTemplateDocument.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<MeasuredTemplateDocument.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: MeasuredTemplateDocument.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: MeasuredTemplateDocument.UpdateData,
    options: MeasuredTemplateDocument.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: MeasuredTemplateDocument.UpdateData,
    options: MeasuredTemplateDocument.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: MeasuredTemplateDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: MeasuredTemplateDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: MeasuredTemplateDocument.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: MeasuredTemplateDocument.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: MeasuredTemplateDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: MeasuredTemplateDocument.Implementation[],
    operation: MeasuredTemplateDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: MeasuredTemplateDocument.Implementation[],
    context: Document.ModificationContext<MeasuredTemplateDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: MeasuredTemplateDocument.Implementation[],
    context: Document.ModificationContext<MeasuredTemplateDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: MeasuredTemplateDocument.Implementation[],
    context: Document.ModificationContext<MeasuredTemplateDocument.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<MeasuredTemplateDocument.Schema>;

  static get schema(): SchemaField<MeasuredTemplateDocument.Schema>;

  static validateJoint(data: MeasuredTemplateDocument.Source): void;

  static override fromSource(
    source: MeasuredTemplateDocument.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<MeasuredTemplateDocument.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<MeasuredTemplateDocument.Schema, DataModel.Any | null>;
}

export default BaseMeasuredTemplate;

declare namespace BaseMeasuredTemplate {
  export import Metadata = MeasuredTemplateDocument.Metadata;
  export import Parent = MeasuredTemplateDocument.Parent;
  export import Stored = MeasuredTemplateDocument.Stored;
  export import Source = MeasuredTemplateDocument.Source;
  export import PersistedData = MeasuredTemplateDocument.PersistedData;
  export import CreateData = MeasuredTemplateDocument.CreateData;
  export import InitializedData = MeasuredTemplateDocument.InitializedData;
  export import UpdateData = MeasuredTemplateDocument.UpdateData;
  export import Schema = MeasuredTemplateDocument.Schema;
  export import DatabaseOperation = MeasuredTemplateDocument.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseMeasuredTemplate.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseMeasuredTemplate.CreateData | `BaseMeasuredTemplate.CreateData`}
   */
  type ConstructorData = BaseMeasuredTemplate.CreateData;
}

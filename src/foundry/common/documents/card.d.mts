import type { AnyMutableObject, InexactPartial } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * @param data    - Initial data from which to construct the `BaseCard`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseCard` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Card.implementation | `new Card.implementation(...)`} instead which will give you
   * a system specific implementation of `Card`.
   */
  constructor(...args: Card.ConstructorArgs);

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
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  /* Document overrides */

  static " fvtt_types_internal_document_name_static": "Card";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: Card.ParentCollectionName | null;

  readonly pack: string | null;

  static get implementation(): Card.ImplementationClass;

  static get baseDocument(): typeof BaseCard;

  static get collectionName(): Card.ParentCollectionName;

  static get documentName(): Card.Name;

  static get TYPES(): BaseCard.SubType[];

  static get hasTypeData(): true;

  static get hierarchy(): Card.Hierarchy;

  override system: Document.SystemFor<"Card", SubType>;

  override parent: BaseCard.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Card.Implementation | Card.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Card.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Card.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Card.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Card.Database.Update>,
  ): Promise<Card.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Card.Database.Delete>,
  ): Promise<Card.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Card.CreateData | Card.CreateData[],
    operation?: Card.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Card.Implementation, Temporary> | undefined>;

  override update(
    data: Card.UpdateData | undefined,
    operation?: Card.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Card.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Card.Database.GetOptions): Card.Implementation | null;

  static override getCollectionName<CollectionName extends Card.EmbeddedName>(
    name: CollectionName,
  ): Card.CollectionNameOf<CollectionName> | null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Card.Flags.Scope, Key extends Card.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Card.Name, Scope, Key>;

  override setFlag<
    Scope extends Card.Flags.Scope,
    Key extends Card.Flags.Key<Scope>,
    Value extends Document.GetFlag<Card.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Card.Flags.Scope, Key extends Card.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: Card.CreateData,
    options: Card.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Card.CreateData, options: Card.Database.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Card.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Card.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Card.Implementation[],
    operation: Card.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Card.UpdateData,
    options: Card.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(changed: Card.UpdateData, options: Card.Database.OnUpdateOperation, userId: string): void;

  protected static _preUpdateOperation(
    documents: Card.Implementation[],
    operation: Card.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Card.Implementation[],
    operation: Card.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(options: Card.Database.PreDeleteOptions, user: User.Implementation): Promise<boolean | void>;

  protected _onDelete(options: Card.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Card.Implementation[],
    operation: Card.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Card.Implementation[],
    operation: Card.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): true;

  // These data field things have been ticketed but will probably go into backlog hell for a while.
  // We'll end up copy and pasting without modification for now I think. It makes it a tiny bit easier to update though.
  // options: not null (parameter default only in _addDataFieldShim)
  protected static override _addDataFieldShims(
    data: AnyMutableObject,
    shims: Record<string, string>,
    options?: Document.DataFieldShimOptions,
  ): void;

  // options: not null (parameter default only)
  protected static override _addDataFieldShim(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    options?: Document.DataFieldShimOptions,
  ): void;

  protected static _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

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

  /* DataModel overrides */

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
  export import SubType = Card.SubType;
  export import Name = Card.Name;
  export import ConstructorArgs = Card.ConstructorArgs;
  export import Hierarchy = Card.Hierarchy;
  export import Metadata = Card.Metadata;
  export import Parent = Card.Parent;
  export import Pack = Card.Pack;
  export import Embedded = Card.Embedded;
  export import EmbeddedName = Card.EmbeddedName;
  export import EmbeddedCollectionName = Card.EmbeddedCollectionName;
  export import ParentCollectionName = Card.ParentCollectionName;
  export import Stored = Card.Stored;
  export import Source = Card.Source;
  export import PersistedData = Card.PersistedData;
  export import CreateData = Card.CreateData;
  export import InitializedData = Card.InitializedData;
  export import UpdateData = Card.UpdateData;
  export import Schema = Card.Schema;
  export import DatabaseOperation = Card.Database;
  export import Flags = Card.Flags;

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

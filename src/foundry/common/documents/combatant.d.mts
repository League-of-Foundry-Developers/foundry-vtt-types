import type { AnyMutableObject } from "fvtt-types/utils";
import type Document from "../abstract/document.mts";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.d.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * @param data    - Initial data from which to construct the `BaseCombatant`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseCombatant` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Combatant.implementation | `new Combatant.implementation(...)`} instead which will give you
   * a system specific implementation of `Combatant`.
   */
  constructor(...args: Combatant.ConstructorArgs);

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
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  /* Document overrides */

  static " fvtt_types_internal_document_name_static": "Combatant";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: Combatant.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): Combatant.ImplementationClass;

  static get baseDocument(): typeof BaseCombatant;

  static get collectionName(): Combatant.ParentCollectionName;

  static get documentName(): Combatant.Name;

  static get TYPES(): BaseCombatant.SubType[];

  static get hasTypeData(): true;

  static get hierarchy(): Combatant.Hierarchy;

  override system: Combatant.SystemOfType<SubType>;

  override parent: BaseCombatant.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Combatant.Implementation | Combatant.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Combatant.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Combatant.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Combatant.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Combatant.Database.Update>,
  ): Promise<Combatant.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Combatant.Database.Delete>,
  ): Promise<Combatant.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Combatant.CreateData | Combatant.CreateData[],
    operation?: Combatant.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Combatant.Implementation, Temporary> | undefined>;

  override update(
    data: Combatant.UpdateData | undefined,
    operation?: Combatant.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Combatant.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Combatant.Database.GetOptions): Combatant.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Combatant.Flags.Scope, Key extends Combatant.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Combatant.Name, Scope, Key>;

  override setFlag<
    Scope extends Combatant.Flags.Scope,
    Key extends Combatant.Flags.Key<Scope>,
    Value extends Document.GetFlag<Combatant.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Combatant.Flags.Scope, Key extends Combatant.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: Combatant.CreateData,
    options: Combatant.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Combatant.CreateData, options: Combatant.Database.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Combatant.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Combatant.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Combatant.UpdateData,
    options: Combatant.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Combatant.UpdateData,
    options: Combatant.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Combatant.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Combatant.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Combatant.Implementation[],
    operation: Combatant.Database.Delete,
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

  protected static override _addDataFieldMigration(
    data: AnyMutableObject,
  protected static override _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

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

  /* DataModel overrides */

  protected static _schema: SchemaField<Combatant.Schema>;

  static get schema(): SchemaField<Combatant.Schema>;

  static validateJoint(data: Combatant.Source): void;

  // context: not null (destructured)
  static override fromSource(
    source: Combatant.CreateData,
    context?: Document.ConstructionContext<BaseCombatant.Parent>,
  ): Combatant.Implementation;

  static override fromJSON(json: string): Combatant.Implementation;

  #baseCombatant: true;
}

export default BaseCombatant;

declare namespace BaseCombatant {
  export import Name = Combatant.Name;
  export import ConstructorArgs = Combatant.ConstructorArgs;
  export import Hierarchy = Combatant.Hierarchy;
  export import Metadata = Combatant.Metadata;
  export import SubType = Combatant.SubType;
  export import ConfiguredSubTypes = Combatant.ConfiguredSubTypes;
  export import Known = Combatant.Known;
  export import OfType = Combatant.OfType;
  export import SystemOfType = Combatant.SystemOfType;
  export import Parent = Combatant.Parent;
  export import Descendant = Combatant.Descendant;
  export import DescendantClass = Combatant.DescendantClass;
  export import Pack = Combatant.Pack;
  export import Embedded = Combatant.Embedded;
  export import ParentCollectionName = Combatant.ParentCollectionName;
  export import CollectionClass = Combatant.CollectionClass;
  export import Collection = Combatant.Collection;
  export import Invalid = Combatant.Invalid;
  export import Stored = Combatant.Stored;
  export import Source = Combatant.Source;
  export import PersistedData = Combatant.PersistedData;
  export import CreateData = Combatant.CreateData;
  export import InitializedData = Combatant.InitializedData;
  export import UpdateData = Combatant.UpdateData;
  export import Schema = Combatant.Schema;
  export import DatabaseOperation = Combatant.Database;
  export import Flags = Combatant.Flags;

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

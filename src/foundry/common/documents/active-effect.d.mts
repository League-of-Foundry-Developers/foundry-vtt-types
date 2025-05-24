import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * @param data    - Initial data from which to construct the `BaseActiveEffect`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseActiveEffect` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link ActiveEffect.implementation | `new ActiveEffect.implementation(...)`} instead which will give you
   * a system specific implementation of `ActiveEffect`.
   */
  constructor(...args: ActiveEffect.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "ActiveEffect",
   *   collection: "effects",
   *   hasTypeData: true,
   *   label: "DOCUMENT.ActiveEffect",
   *   labelPlural: "DOCUMENT.ActiveEffects",
   *   schemaVersion: "12.324"
   * });
   * ```
   */
  static override metadata: BaseActiveEffect.Metadata;

  static override defineSchema(): BaseActiveEffect.Schema;

  /**
   * @remarks If `this.isEmbedded`, uses `this.parent.canUserModify(user, "update")`, dropping `data` and forcing `action`,
   * otherwise `super`'s (with all arguments forwarded). Core's `Actor` implementation doesn't override this method, and while
   * core's `Item` does, it only mirrors this functionality, so without further extension all roads lead to {@link Document.canUserModify | `Document#canUserModify`}
   */
  // data: not null (parameter default only)
  override canUserModify<Action extends "create" | "update" | "delete">(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<ActiveEffect.Schema, Action>,
  ): boolean;

  /**
   * @remarks If `this.isEmbedded`, uses `this.parent.testUserPermission`, otherwise `super`'s. Core's `Actor` implementation
   * doesn't override this method, and `Item` only optionally forwards to `Actor`, so without further extension all roads
   * lead to {@link Document.testUserPermission | `Document#testUserPermission`}
   */
  // options: not null (destructured)
  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  // _preCreate overridden but with no signature changes.
  // For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.

  /**
   * @remarks
   * Migrations:
   * - `label` to `name` (since v11, no specified end)
   * - `icon` to `img` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `label` to `name` (since v11, until v13)
   * - `icon` to `img` (since v12, until v14)
   */
  // options: not null (destructured)
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

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

  static " fvtt_types_internal_document_name_static": "ActiveEffect";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: ActiveEffect.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): ActiveEffect.ImplementationClass;

  static override get baseDocument(): typeof BaseActiveEffect;

  static override get collectionName(): ActiveEffect.ParentCollectionName;

  static override get documentName(): ActiveEffect.Name;

  static override get TYPES(): BaseActiveEffect.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): ActiveEffect.Hierarchy;

  override system: ActiveEffect.SystemOfType<SubType>;

  override parent: BaseActiveEffect.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<ActiveEffect.Implementation | ActiveEffect.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<ActiveEffect.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<ActiveEffect.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: ActiveEffect.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<ActiveEffect.Database.Update>,
  ): Promise<ActiveEffect.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<ActiveEffect.Database.Delete>,
  ): Promise<ActiveEffect.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: ActiveEffect.CreateData | ActiveEffect.CreateData[],
    operation?: ActiveEffect.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<ActiveEffect.Implementation, Temporary> | undefined>;

  override update(
    data: ActiveEffect.UpdateData | undefined,
    operation?: ActiveEffect.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: ActiveEffect.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: ActiveEffect.Database.GetOptions,
  ): ActiveEffect.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends ActiveEffect.Flags.Scope, Key extends ActiveEffect.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<ActiveEffect.Name, Scope, Key>;

  override setFlag<
    Scope extends ActiveEffect.Flags.Scope,
    Key extends ActiveEffect.Flags.Key<Scope>,
    Value extends Document.GetFlag<ActiveEffect.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends ActiveEffect.Flags.Scope, Key extends ActiveEffect.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: ActiveEffect.CreateData,
    options: ActiveEffect.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: ActiveEffect.CreateData,
    options: ActiveEffect.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: ActiveEffect.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<ActiveEffect.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: ActiveEffect.Implementation[],
    operation: ActiveEffect.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: ActiveEffect.UpdateData,
    options: ActiveEffect.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: ActiveEffect.UpdateData,
    options: ActiveEffect.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: ActiveEffect.Implementation[],
    operation: ActiveEffect.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: ActiveEffect.Implementation[],
    operation: ActiveEffect.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: ActiveEffect.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: ActiveEffect.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: ActiveEffect.Implementation[],
    operation: ActiveEffect.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: ActiveEffect.Implementation[],
    operation: ActiveEffect.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static override get hasSystemData(): true;

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

  protected static override _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: ActiveEffect.Implementation[],
    context: Document.ModificationContext<ActiveEffect.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: ActiveEffect.Implementation[],
    context: Document.ModificationContext<ActiveEffect.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: ActiveEffect.Implementation[],
    context: Document.ModificationContext<ActiveEffect.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<ActiveEffect.Schema>;

  static override get schema(): SchemaField<ActiveEffect.Schema>;

  static override validateJoint(data: ActiveEffect.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: ActiveEffect.CreateData,
    context?: DataModel.FromSourceOptions,
  ): ActiveEffect.Implementation;

  static override fromJSON(json: string): ActiveEffect.Implementation;
}

export default BaseActiveEffect;

declare namespace BaseActiveEffect {
  export import Name = ActiveEffect.Name;
  export import ConstructorArgs = ActiveEffect.ConstructorArgs;
  export import Hierarchy = ActiveEffect.Hierarchy;
  export import Metadata = ActiveEffect.Metadata;
  export import SubType = ActiveEffect.SubType;
  export import ConfiguredSubTypes = ActiveEffect.ConfiguredSubTypes;
  export import Known = ActiveEffect.Known;
  export import OfType = ActiveEffect.OfType;
  export import SystemOfType = ActiveEffect.SystemOfType;
  export import Parent = ActiveEffect.Parent;
  export import Descendant = ActiveEffect.Descendant;
  export import DescendantClass = ActiveEffect.DescendantClass;
  export import Pack = ActiveEffect.Pack;
  export import Embedded = ActiveEffect.Embedded;
  export import ParentCollectionName = ActiveEffect.ParentCollectionName;
  export import CollectionClass = ActiveEffect.CollectionClass;
  export import Collection = ActiveEffect.Collection;
  export import Invalid = ActiveEffect.Invalid;
  export import Stored = ActiveEffect.Stored;
  export import Source = ActiveEffect.Source;
  export import PersistedData = ActiveEffect.PersistedData;
  export import CreateData = ActiveEffect.CreateData;
  export import InitializedData = ActiveEffect.InitializedData;
  export import UpdateData = ActiveEffect.UpdateData;
  export import Schema = ActiveEffect.Schema;
  export import DatabaseOperation = ActiveEffect.Database;
  export import Flags = ActiveEffect.Flags;
  export import CoreFlags = ActiveEffect.CoreFlags;
  export import DurationData = ActiveEffect.DurationData;
  export import Duration = ActiveEffect.Duration;
  export import EffectChangeData = ActiveEffect.EffectChangeData;
  export import ChangeData = ActiveEffect.ChangeData;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `ActiveEffect` a name.
    // The expression `ClientDocumentMixin(BaseActiveEffect)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends ClientDocumentMixin.Mix<typeof BaseActiveEffect> {}
    const ClientDocument: ClientDocument;
  }

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
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated Replaced with {@linkcode BaseActiveEffect.SubType} */
  type TypeNames = SubType;

  /**
   * @deprecated Replaced with {@link foundry.data.fields.SchemaField | `SchemaField<BaseActiveEffect.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated Replaced with {@linkcode BaseActiveEffect.CreateData}
   */
  type ConstructorData = BaseActiveEffect.CreateData;
}

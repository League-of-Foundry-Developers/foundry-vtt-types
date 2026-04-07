import type { AnyMutableObject } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

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
   * @remarks Constructing `BaseActiveEffect` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode ActiveEffect.implementation | new ActiveEffect.implementation(...)} instead which will give you
   * a system specific implementation of `ActiveEffect`.
   */
  constructor(data: BaseActiveEffect.CreateData, context?: BaseActiveEffect.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "ActiveEffect",
   *   collection: "effects",
   *   hasTypeData: true,
   *   label: "DOCUMENT.ActiveEffect",
   *   labelPlural: "DOCUMENT.ActiveEffects",
   *   schemaVersion: "13.341",
   *   permissions: {
   *     create: "OWNER",
   *     delete: "OWNER"
   *   }
   * });
   * ```
   */
  static override metadata: BaseActiveEffect.Metadata;

  static override defineSchema(): BaseActiveEffect.Schema;

  /** @defaultValue `["DOCUMENT", "EFFECT"]` */
  static override LOCALIZATION_PREFIXES: string[];

  protected override _preCreate(
    data: BaseActiveEffect.CreateData,
    options: BaseActiveEffect.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  /**
   * @remarks
   * Migrations:
   * - `icon` to `img` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `icon` to `img` (since v12, until v14)
   */
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

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

  type: SubType;

  /* Document overrides */

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: BaseActiveEffect.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): ActiveEffect.ImplementationClass;

  static override get baseDocument(): typeof BaseActiveEffect;

  static override get collectionName(): BaseActiveEffect.ParentCollectionName;

  static override get documentName(): BaseActiveEffect.Name;

  static override get TYPES(): BaseActiveEffect.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseActiveEffect.Hierarchy;

  override system: BaseActiveEffect.SystemOfType<SubType>;

  override parent: BaseActiveEffect.Parent;

  override " fvtt_types_internal_document_parent": BaseActiveEffect.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<ActiveEffect.Implementation | BaseActiveEffect.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseActiveEffect.Database.Create<Temporary>>,
  ): Promise<Array<BaseActiveEffect.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseActiveEffect.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseActiveEffect.Database.Update>,
  ): Promise<ActiveEffect.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseActiveEffect.Database.Delete>,
  ): Promise<ActiveEffect.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: BaseActiveEffect.CreateData | BaseActiveEffect.CreateData[],
    operation?: BaseActiveEffect.Database.CreateOperation<Temporary>,
  ): Promise<BaseActiveEffect.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseActiveEffect.UpdateData | undefined,
    operation?: BaseActiveEffect.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseActiveEffect.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: BaseActiveEffect.Database.GetOptions,
  ): ActiveEffect.Implementation | null;

  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseActiveEffect.Flags.Scope, Key extends BaseActiveEffect.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseActiveEffect.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseActiveEffect.Flags.Scope,
    Key extends BaseActiveEffect.Flags.Key<Scope>,
    Value extends BaseActiveEffect.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseActiveEffect.Flags.Scope, Key extends BaseActiveEffect.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _onCreate(
    data: BaseActiveEffect.CreateData,
    options: BaseActiveEffect.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: ActiveEffect.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseActiveEffect.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: ActiveEffect.Implementation[],
    operation: BaseActiveEffect.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseActiveEffect.UpdateData,
    options: BaseActiveEffect.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseActiveEffect.UpdateData,
    options: BaseActiveEffect.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: ActiveEffect.Implementation[],
    operation: BaseActiveEffect.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: ActiveEffect.Implementation[],
    operation: BaseActiveEffect.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseActiveEffect.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseActiveEffect.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: ActiveEffect.Implementation[],
    operation: BaseActiveEffect.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: ActiveEffect.Implementation[],
    operation: BaseActiveEffect.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation | Document._onCreateOperation}"
   */
  protected static override _onCreateDocuments(
    documents: ActiveEffect.Implementation[],
    context: Document.ModificationContext<BaseActiveEffect.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation | Document._onUpdateOperation}"
   */
  protected static override _onUpdateDocuments(
    documents: ActiveEffect.Implementation[],
    context: Document.ModificationContext<BaseActiveEffect.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation | Document._onDeleteOperation}"
   */
  protected static override _onDeleteDocuments(
    documents: ActiveEffect.Implementation[],
    context: Document.ModificationContext<BaseActiveEffect.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseActiveEffect.Schema>;

  static override get schema(): SchemaField<BaseActiveEffect.Schema>;

  static override validateJoint(data: BaseActiveEffect.Source): void;

  static override fromSource(
    source: BaseActiveEffect.CreateData,
    context?: DataModel.FromSourceOptions,
  ): ActiveEffect.Implementation;

  static override fromJSON(json: string): ActiveEffect.Implementation;
}

export default BaseActiveEffect;

declare namespace BaseActiveEffect {
  export import Name = ActiveEffect.Name;
  export import ConstructionContext = ActiveEffect.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = ActiveEffect.ConstructorArgs;
  export import Hierarchy = ActiveEffect.Hierarchy;
  export import Metadata = ActiveEffect.Metadata;
  export import SubType = ActiveEffect.SubType;
  export import ConfiguredSubType = ActiveEffect.ConfiguredSubType;
  export import Known = ActiveEffect.Known;
  export import OfType = ActiveEffect.OfType;
  export import SystemOfType = ActiveEffect.SystemOfType;
  export import Parent = ActiveEffect.Parent;
  export import Descendant = ActiveEffect.Descendant;
  export import DescendantClass = ActiveEffect.DescendantClass;
  export import Embedded = ActiveEffect.Embedded;
  export import ParentCollectionName = ActiveEffect.ParentCollectionName;
  export import CollectionClass = ActiveEffect.CollectionClass;
  export import Collection = ActiveEffect.Collection;
  export import Invalid = ActiveEffect.Invalid;
  export import Stored = ActiveEffect.Stored;
  export import Source = ActiveEffect.Source;
  export import CreateData = ActiveEffect.CreateData;
  export import CreateInput = ActiveEffect.CreateInput;
  export import CreateReturn = ActiveEffect.CreateReturn;
  export import InitializedData = ActiveEffect.InitializedData;
  export import UpdateData = ActiveEffect.UpdateData;
  export import UpdateInput = ActiveEffect.UpdateInput;
  export import Schema = ActiveEffect.Schema;
  export import Database = ActiveEffect.Database;
  export import TemporaryIf = ActiveEffect.TemporaryIf;
  export import Flags = ActiveEffect.Flags;
  export import CoreFlags = ActiveEffect.CoreFlags;
  export import DurationData = ActiveEffect.DurationData;
  export import Duration = ActiveEffect.Duration;
  export import ChangeData = ActiveEffect.ChangeData;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `ActiveEffect` a name.
    // The expression `ClientDocumentMixin(BaseActiveEffect)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseActiveEffect> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends ActiveEffect.Schema {
    system: any;
  }
}

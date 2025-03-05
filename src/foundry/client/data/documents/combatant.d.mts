import type { ConfiguredCombatant } from "../../../../configuration/index.d.mts";
import type { ValueOf } from "fvtt-types/utils";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseCombatant from "../../../common/documents/combatant.d.mts";

declare global {
  namespace Combatant {
    /**
     * The implementation of the Combatant document instance configured through `CONFIG.Combatant.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredCombatant | `fvtt-types/configuration/ConfiguredCombatant`} in fvtt-types.
     */
    type Implementation = Document.ImplementationInstanceFor<"Combatant">;

    /**
     * The implementation of the Combatant document configured through `CONFIG.Combatant.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Combatant">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Combatant"> {}

    type SubType = Game.Model.TypeNames<"Combatant">;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"Combatant">;
    type Known = Combatant.OfType<Combatant.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredCombatant<Type>, Combatant<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Combat.Implementation | null;

    /**
     * An instance of `Combatant` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

    /**
     * The data put in {@link DataModel._source | `DataModel._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link Combatant._source | `Combatant._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Combatant.create | `Combatant.create`}
     * and {@link Combatant | `new Combatant(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Combatant.name | `Combatant#name`}.
     *
     * This is data transformed from {@link Combatant.Source | `Combatant.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Combatant.update | `Combatant#update`}.
     * It is a distinct type from {@link Combatant.CreateData | `DeepPartial<Combatant.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Combatant | `Combatant`}. This is the source of truth for how an Combatant document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Combatant | `Combatant`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */

    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this Combatant embedded document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      type: fields.DocumentTypeField<typeof BaseCombatant, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

      system: fields.TypeDataField<typeof BaseCombatant>;

      /**
       * The _id of an Actor associated with this Combatant
       * @defaultValue `null`
       */
      actorId: fields.ForeignDocumentField<
        typeof documents.BaseActor,
        { label: "COMBAT.CombatantActor"; idOnly: true }
      >;

      /**
       * The _id of a Token associated with this Combatant
       * @defaultValue `null`
       */
      tokenId: fields.ForeignDocumentField<
        typeof documents.BaseToken,
        { label: "COMBAT.CombatantToken"; idOnly: true }
      >;

      /**
       * @defaultValue `null`
       */
      sceneId: fields.ForeignDocumentField<
        typeof documents.BaseScene,
        { label: "COMBAT.CombatantScene"; idOnly: true }
      >;

      /**
       * A customized name which replaces the name of the Token in the tracker
       * @defaultValue `""`
       */
      name: fields.StringField<{ label: "COMBAT.CombatantName"; textSearch: true }>;

      /**
       * A customized image which replaces the Token image in the tracker
       * @defaultValue `null`
       */
      img: fields.FilePathField<{ categories: "IMAGE"[]; label: "COMBAT.CombatantImage" }>;

      /**
       * The initiative score for the Combatant which determines its turn order
       * @defaultValue `null`
       */
      initiative: fields.NumberField<{ label: "COMBAT.CombatantInitiative" }>;

      /**
       * Is this Combatant currently hidden?
       * @defaultValue `false`
       */
      hidden: fields.BooleanField<{ label: "COMBAT.CombatantHidden" }>;

      /**
       * Has this Combatant been defeated?
       * @defaultValue `false`
       */
      defeated: fields.BooleanField<{ label: "COMBAT.CombatantDefeated" }>;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Combatant">;

      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for Combatants */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Combatant.Parent> {}
      /** Options passed along in Create operations for Combatants */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Combatant.CreateData, Combatant.Parent, Temporary> {
        combatTurn?: number;
      }
      /** Options passed along in Delete operations for Combatants */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Combatant.Parent> {
        combatTurn?: number;
      }
      /** Options passed along in Update operations for Combatants */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Combatant.UpdateData, Combatant.Parent> {
        combatTurn?: number;
      }

      /** Options for {@link Combatant.createDocuments | `Combatant.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Combatant._preCreateOperation | `Combatant._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Combatant._preCreate | `Combatant#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOptions<Create>;
      /** Options for {@link Combatant._onCreate | `Combatant#_onCreate`} */
      type OnCreateOperation = Document.Database.CreateOptions<Create>;

      /** Options for {@link Combatant.updateDocuments | `Combatant.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateDocumentsOperation<Update>;
      /** Options for {@link Combatant._preUpdateOperation | `Combatant._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Combatant._preUpdate | `Combatant#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOptions<Update>;
      /** Options for {@link Combatant._onUpdate | `Combatant#_onUpdate`} */
      type OnUpdateOperation = Document.Database.UpdateOptions<Update>;

      /** Options for {@link Combatant.deleteDocuments | `Combatant.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteDocumentsOperation<Delete>;
      /** Options for {@link Combatant._preDeleteOperation | `Combatant._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Combatant._preDelete | `Combatant#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Combatant._onDelete | `Combatant#_onDelete`} */
      type OnDeleteOperation = Document.Database.DeleteOptions<Delete>;
    }

    /**
     * @deprecated {@link Combatant.DatabaseOperation | `Combatant.DatabaseOperation`}
     */
    interface DatabaseOperations
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      extends Document.Database.Operations<
        Combatant,
        { combatTurn: number },
        { combatTurn: number },
        { combatTurn: number }
      > {}

    /**
     * @deprecated {@link Combatant.Types | `Combatant.SubType`}
     */
    type TypeNames = Combatant.SubType;

    /**
     * @deprecated {@link Combatant.CreateData | `Combatant.CreateData`}
     */
    interface ConstructorData extends Combatant.CreateData {}

    /**
     * @deprecated {@link Combatant.implementation | `Combatant.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Combatant.Implementation | `Combatant.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Combatant document which extends the common BaseCombatant model.
   *
   * @see {@link Combat | `Combat`}                    The Combat document which contains Combatant embedded documents
   * @see {@link CombatantConfig | `CombatantConfig`}        The Combatant configuration application
   */
  class Combatant<out SubType extends Combatant.SubType = Combatant.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseCombatant,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `Combatant`
     * @param context - Construction context options
     *
     * @deprecated Constructing `Combatant` directly is not advised. While `new Combatant(...)` would create a
     * temporary document it would not respect a system's subclass of `Combatant`, if any.
     *
     * You should use {@link Combatant.implementation | `new Combatant.implementation(...)`} instead which
     * will give you a system specific implementation of `Combatant`.
     */
    constructor(...args: Document.ConstructorParameters<Combatant.CreateData, Combatant.Parent>);

    /**
     * The token video source image (if any)
     */
    _videoSrc: string | null;

    /** The current value of the special tracked resource which pertains to this Combatant */
    resource: `${number}` | number | boolean | null;

    /**
     * A convenience alias of Combatant#parent which is more semantically intuitive
     */
    get combat(): Combat.Implementation | null;

    /** This is treated as a non-player combatant if it has no associated actor and no player users who can control it */
    get isNPC(): boolean;

    /**
     * Eschew `ClientDocument`'s redirection to `Combat#permission` in favor of special ownership determination.
     */
    override get permission(): ValueOf<typeof CONST.DOCUMENT_OWNERSHIP_LEVELS>;

    override get visible(): boolean;

    /** A reference to the Actor document which this Combatant represents, if any */
    get actor(): Actor.Implementation | null;

    /** A reference to the Token document which this Combatant represents, if any */
    get token(): TokenDocument.Implementation | null;

    /** An array of User documents who have ownership of this Document */
    get players(): User.Implementation[];

    /**
     * Has this combatant been marked as defeated?
     */
    get isDefeated(): boolean;

    override testUserPermission(
      user: User.Implementation,
      permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
      { exact }?: { exact?: boolean },
    ): boolean;

    /**
     * Get a Roll object which represents the initiative roll for this Combatant.
     * @param formula -  An explicit Roll formula to use for the combatant.
     * @returns The Roll instance to use for the combatant.
     */
    getInitiativeRoll(formula?: string): Roll;

    /**
     * Roll initiative for this particular combatant.
     * @param formula - A dice formula which overrides the default for this Combatant.
     * @returns The updated Combatant.
     */
    rollInitiative(formula: string): Promise<this | undefined>;

    override prepareDerivedData(): void;

    /**
     * Update the value of the tracked resource for this Combatant.
     */
    updateResource(): this["resource"];

    /**
     * Acquire the default dice formula which should be used to roll initiative for this combatant.
     * Modules or systems could choose to override or extend this to accommodate special situations.
     * @returns  The initiative formula to use for this combatant.
     */
    protected _getInitiativeFormula(): string;

    /**
     * @privateRemarks DatabaseLifecycle Events are overridden but with no signature changes.
     * These are already covered in BaseCombatant
     */

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(
      context: Document.DefaultNameContext<Combatant.SubType, NonNullable<Combatant.Parent>>,
    ): string;

    static override createDialog(
      data: Document.CreateDialogData<Combatant.CreateData>,
      context: Document.CreateDialogContext<Combatant.SubType, NonNullable<Combatant.Parent>>,
    ): Promise<Combatant.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<Combatant.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Combatant.Implementation | undefined>;

    static override fromImport(
      source: Combatant.Source,
      context?: Document.FromImportContext<Combatant.Parent>,
    ): Promise<Combatant.Implementation>;
  }
}

import type { InexactPartial } from "../../../../utils/index.d.mts";
import type { documents } from "../../../client-esm/client.d.mts";
import type { DatabaseGetOperation } from "../../../common/abstract/_types.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

declare global {
  namespace FogExploration {
    /**
     * The implementation of the FogExploration document instance configured through `CONFIG.FogExploration.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredFogExploration | `configuration/ConfiguredFogExploration`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"FogExploration">;

    /**
     * The implementation of the FogExploration document configured through `CONFIG.FogExploration.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"FogExploration">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"FogExploration"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `FogExploration` that comes from the database.
     */
    interface Stored extends Document.Stored<FogExploration.Implementation> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link FogExploration._source | `FogExploration._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link FogExploration.create | `FogExploration.create`}
     * and {@link FogExploration | `new FogExploration(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link FogExploration.name | `FogExploration#name`}.
     *
     * This is data transformed from {@link FogExploration.Source | `FogExploration.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link FogExploration.update | `FogExploration#update`}.
     * It is a distinct type from {@link FogExploration.CreateData | `DeepPartial<FogExploration.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link FogExploration | `FogExploration`}. This is the source of truth for how an FogExploration document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link FogExploration | `FogExploration`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this FogExploration document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The _id of the Scene document to which this fog applies
     * @defaultValue `canvas?.scene?.id`
     */
    scene: fields.ForeignDocumentField<typeof documents.BaseScene, { initial: () => string | undefined }>;

    /**
     * The _id of the User document to which this fog applies
     * @defaultValue `null`
     */
    user: fields.ForeignDocumentField<typeof documents.BaseUser, { initial: () => string }>;

    /**
     * The base64 image/jpeg of the explored fog polygon
     * @defaultValue `null`
     */
    explored: fields.FilePathField<{ categories: ["IMAGE"]; required: true; base64: true }>;

    /**
     * The object of scene positions which have been explored at a certain vision radius
     * @defaultValue `{}`
     */
    positions: fields.ObjectField;

    /**
     * The timestamp at which this fog exploration was last updated
     * @defaultValue `Date.now()`
     */
    timestamp: fields.NumberField<{ nullable: false; initial: ReturnType<typeof Date.now> }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"FogExploration">;

    _stats: fields.DocumentStatsField;
  }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for FogExplorations */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<FogExploration.Parent> {}
      /** Options passed along in Create operations for FogExplorations */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          FogExploration.CreateData,
          FogExploration.Parent,
          Temporary
        > {
        loadFog?: boolean;
      }
      /** Options passed along in Delete operations for FogExplorations */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<FogExploration.Parent> {
        loadFog?: boolean;
      }
      /** Options passed along in Update operations for FogExplorations */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<FogExploration.UpdateData, FogExploration.Parent> {
        loadFog?: boolean;
      }

      /** Options for {@link FogExploration.createDocuments} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link FogExploration._preCreateOperation} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link FogExploration#_preCreate} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link FogExploration#_onCreate} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link FogExploration.updateDocuments} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link FogExploration._preUpdateOperation} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link FogExploration#_preUpdate} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link FogExploration#_onUpdate} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link FogExploration.deleteDocuments} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link FogExploration._preDeleteOperation} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link FogExploration#_preDelete} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link FogExploration#_onDelete} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated - {@link FogExploration.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<FogExploration> {}

    /**
     * @deprecated {@link FogExploration.CreateData | `FogExploration.CreateData`}
     */
    interface ConstructorData extends FogExploration.CreateData {}

    /**
     * @deprecated {@link FogExploration.implementation | `FogExploration.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link FogExploration.Implementation | `FogExploration.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side FogExploration document which extends the common BaseFogExploration model.
   */
  class FogExploration extends ClientDocumentMixin(foundry.documents.BaseFogExploration) {
    static override metadata: FogExploration.Metadata;

    static get implementation(): FogExploration.ConfiguredClass;

    /**
     * Obtain the fog of war exploration progress for a specific Scene and User.
     * @param query      - Parameters for which FogExploration document is retrieved
     * @param options    - Additional options passed to DatabaseBackend#get.
     *                     (default: `{}`)
     * @returns
     */
    static load(
      query?: InexactPartial<{
        /** A certain Scene ID **/
        scene: string;
        /** A certain User ID **/
        user: string;
      }>,
      options?: InexactPartial<DatabaseGetOperation>,
    ): Promise<FogExploration | null>;

    /**
     * Transform the explored base64 data into a PIXI.Texture object
     */
    getTexture(): PIXI.Texture | null;

    /**
     * @privateRemarks _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */
  }

  namespace FogExploration {
    type Any = AnyFogExploration;
    type AnyConstructor = typeof AnyFogExploration;
  }
}

declare abstract class AnyFogExploration extends FogExploration {
  constructor(arg0: never, ...args: never[]);
}

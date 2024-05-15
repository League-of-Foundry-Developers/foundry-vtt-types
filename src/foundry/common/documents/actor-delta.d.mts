import type { ConfiguredDocumentClassForName } from "../../../types/helperTypes.d.mts";
import type { InexactPartial, Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type Document from "../abstract/document.mts";
import type { fields } from "../data/module.d.mts";
import type { CONST, documents } from "../module.d.mts";

declare global {
  type ActorDeltaData<TypeName extends documents.BaseActor.TypeNames = documents.BaseActor.TypeNames> =
    documents.BaseActor.Properties<TypeName>;
}
interface BaseActorDelta<TypeName extends documents.BaseActor.TypeNames = documents.BaseActor.TypeNames>
  extends BaseActorDelta.Properties<TypeName> {}
declare class BaseActorDelta<
  TypeName extends documents.BaseActor.TypeNames = documents.BaseActor.TypeNames,
> extends Document<documents.BaseActor.SchemaField<TypeName>, documents.BaseActor.Metadata> {
  constructor(data: BaseActorDelta.ConstructorData<TypeName>, context?: DocumentConstructionContext);

  override _source: BaseActorDelta.Source<TypeName>;

  static override metadata: Readonly<BaseActorDelta.Metadata>;

  static override defineSchema(): BaseActorDelta.Schema;

  override canUserModify(
    user: documents.BaseUser,
    action: "create" | "update" | "delete",
    data?: object | undefined,
  ): boolean;

  override testUserPermission(
    user: documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options: InexactPartial<{ exact: boolean }>,
  ): boolean;

  /**
   * Retrieve the base actor's collection, if it exists.
   * @param collectionName - The collection name.
   */
  getBaseCollection(collectionName: string): Collection<Actor> | undefined;

  static applyDelta(
    delta: BaseActorDelta,
    baseActor: documents.BaseActor,
    context: unknown,
  ): ConfiguredDocumentClassForName<"Actor"> | null;

  //TODO: Figure out if this override still applies
  toObject(source: true): this["_source"];
  toObject(source?: boolean | undefined): ReturnType<this["schema"]["toObject"]>;
}

export default BaseActorDelta;

declare namespace BaseActorDelta {
  type TypeNames = fields.TypeDataField.TypeNames<typeof documents.BaseActor>;
  type ConstructorData<TypeName extends TypeNames> = UpdateData<TypeName> &
    Required<Pick<UpdateData<TypeName>, "name" | "type">>;
  type UpdateData<TypeName extends TypeNames> = fields.SchemaField.InnerAssignmentType<Schema<TypeName>>;
  type Properties<TypeName extends TypeNames> = fields.SchemaField.InnerInitializedType<Schema<TypeName>>;
  type Source<TypeName extends TypeNames> = fields.SchemaField.InnerPersistedType<Schema<TypeName>>;

  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "ActorDelta";
      collection: "delta";
      label: "DOCUMENT.ActorDelta";
      labelPlural: "DOCUMENT.ActorDeltas";
      isEmbedded: true;
      embedded: {
        Item: "items";
        ActiveEffect: "effects";
      };
    }
  >;

  interface Schema<TypeName extends TypeNames = TypeNames> extends DataSchema {
    /**
     * The _id which uniquely identifies this ActorDelta document.
     */
    _id: fields.DocumentIdField;

    /**
     * The name override, if any.
     */
    name: fields.StringField<{ required: false; nullable: true; initial: null }>;

    /**
     * The type override, if any.
     */
    type: fields.StringField<{ required: false; nullable: true; initial: null }, TypeName, TypeName, TypeName>;

    /**
     * The image override, if any.
     */
    img: fields.FilePathField<{ categories: ["IMAGE"]; nullable: true; initial: null; required: false }>;

    /**
     * The system data model override.
     */
    system: fields.ObjectField;

    /**
     * An array of embedded item data overrides.
     */
    items: fields.EmbeddedCollectionDeltaField<typeof documents.BaseItem>;

    /**
     * An array of embedded active effect data overrides.
     */
    effects: fields.EmbeddedCollectionDeltaField<typeof documents.BaseActiveEffect>;

    /**
     * Ownership overrides.
     */
    ownership: fields.DocumentOwnershipField<{ required: false; nullable: true; initial: null }>;

    /**
     * An object of actor flag overrides.
     */
    flags: fields.ObjectField.FlagsField<"Actor">;
  }
}

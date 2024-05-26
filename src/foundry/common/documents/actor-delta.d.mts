import type { ConfiguredDocumentClassForName } from "../../../types/helperTypes.d.mts";
import type { InexactPartial, Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type Document from "../abstract/document.mts";
import type { fields } from "../data/module.d.mts";
import type { CONST, documents } from "../module.d.mts";

declare global {
  type ActorDeltaData = documents.BaseActorDelta.Properties;
}

/**
 * The Document definition for an ActorDelta.
 * Defines the DataSchema and common behaviors for an ActorDelta which are shared between both client and server.
 * ActorDeltas store a delta that can be applied to a particular Actor in order to produce a new Actor.
 */
interface BaseActorDelta extends BaseActorDelta.Properties {}
declare class BaseActorDelta extends Document<documents.BaseActorDelta.SchemaField, documents.BaseActorDelta.Metadata> {
  constructor(data: BaseActorDelta.ConstructorData, context?: DocumentConstructionContext);

  override _source: BaseActorDelta.Source;

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
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
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
  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = UpdateData & Required<Pick<UpdateData, "name" | "type">>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

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

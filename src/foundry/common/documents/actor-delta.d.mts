import type { ConfiguredDocumentClassForName } from "../../../types/helperTypes.d.mts";
import type { AnyObject, InexactPartial, Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type Document from "../abstract/document.mts";
import type { fields } from "../data/module.d.mts";
import type { CONST, documents } from "../../client-esm/client.d.mts";

declare global {
  type ActorDeltaData = documents.BaseActorDelta.Properties;
}

/**
 * The Document definition for an ActorDelta.
 * Defines the DataSchema and common behaviors for an ActorDelta which are shared between both client and server.
 * ActorDeltas store a delta that can be applied to a particular Actor in order to produce a new Actor.
 */
declare class BaseActorDelta extends Document<
  documents.BaseActorDelta.Schema,
  documents.BaseActorDelta.Metadata,
  TokenDocument.ConfiguredInstance | null
> {
  constructor(data?: BaseActorDelta.ConstructorData, context?: DocumentConstructionContext);

  override _source: BaseActorDelta.Source;

  static override metadata: Readonly<BaseActorDelta.Metadata>;

  static override defineSchema(): BaseActorDelta.Schema;

  override canUserModify(user: documents.BaseUser, action: "create" | "update" | "delete", data?: AnyObject): boolean;

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
  toObject(source?: boolean): ReturnType<this["schema"]["toObject"]>;
}

export default BaseActorDelta;

declare namespace BaseActorDelta {
  // Note that in places like CONFIG the only eligible type is "base"
  type TypeNames = fields.TypeDataField.TypeNames<typeof documents.BaseActor>;
  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
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
    items: fields.EmbeddedCollectionDeltaField<typeof documents.BaseItem, ActorDelta.ConfiguredInstance>;

    /**
     * An array of embedded active effect data overrides.
     */
    effects: fields.EmbeddedCollectionDeltaField<typeof documents.BaseActiveEffect, ActorDelta.ConfiguredInstance>;

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

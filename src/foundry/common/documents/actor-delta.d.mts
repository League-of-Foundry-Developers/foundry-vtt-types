import type { AnyObject, InexactPartial } from "../../../types/utils.d.mts";
import type Document from "../abstract/document.mts";
import type { fields } from "../data/module.d.mts";
import type { CONST, documents } from "../../client-esm/client.d.mts";

/**
 * The ActorDelta Document.
 * Defines the DataSchema and common behaviors for an ActorDelta which are shared between both client and server.
 * ActorDeltas store a delta that can be applied to a particular Actor in order to produce a new Actor.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseActorDelta extends Document<"ActorDelta", BaseActorDelta.Schema, any> {
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseActorDelta.ConstructorData, context?: Document.ConstructionContext<BaseActorDelta.Parent>);

  override parent: BaseActorDelta.Parent;

  override _source: BaseActorDelta.Source;

  static override metadata: BaseActorDelta.Metadata;

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
  ): Document.ConfiguredClassForName<"Actor"> | null;

  static migrateData(source: AnyObject): AnyObject;

  //TODO: Figure out if this override still applies
  toObject(source: true): this["_source"];
  toObject(source?: boolean): ReturnType<this["schema"]["toObject"]>;
}

export default BaseActorDelta;

declare namespace BaseActorDelta {
  type Parent = TokenDocument.ConfiguredInstance | null;

  // Note that in places like CONFIG the only eligible type is "base"
  type TypeNames = Game.Model.TypeNames<"Actor">;
  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  type Metadata = Document.MetadataFor<BaseActorDelta>;

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

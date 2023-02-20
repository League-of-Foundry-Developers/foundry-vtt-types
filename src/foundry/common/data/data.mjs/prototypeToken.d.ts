import type { DataModel } from "../../abstract/module.mjs";
import type * as documents from "../../documents/module.mjs";
import type * as fields from "../fields.mjs";

type TestUserPermParams = Parameters<documents.BaseActor["testUserPermission"]>;

/**
 * Extend the base TokenData to define a PrototypeToken which exists within a parent Actor.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PrototypeToken extends PrototypeToken.Properties {}
export class PrototypeToken extends DataModel<PrototypeToken.SchemaField, documents.BaseActor> {
  static override defineSchema(): PrototypeToken.Schema;

  /**
   * The Actor which owns this Prototype Token
   */
  get actor(): documents.BaseActor;

  override toObject(source: true): this["_source"] & {
    /** The _id of an Actor document which this Token represents */
    actorId: string | undefined;
  };
  override toObject(source?: boolean | undefined): ReturnType<this["schema"]["toObject"]> & {
    /** The _id of an Actor document which this Token represents */
    actorId: string | undefined;
  };

  static get database(): CONFIG["DatabaseBackend"];

  static override migrateData(source: object): object;

  static override shimData(data: object, { embedded }?: { embedded?: boolean } | undefined): object;

  /**
   * @see {@link abstract.Document.update}
   * @deprecated this is just a Document compatibility method
   */
  override update(changes: any, options: any): unknown;

  /**
   * @see {@link abstract.Document.getFlag}
   * @deprecated this is just a Document compatibility method
   */
  getFlag(...args: any): unknown;

  /**
   * @see {@link abstract.Document.setFlag}
   * @deprecated this is just a Document compatibility method
   */
  setFlag(...args: any): unknown;

  /**
   * @see {@link abstract.Document.unsetFlag}
   * @deprecated this is just a Document compatibility method
   */
  unsetFlag(...args: any): Promise<unknown>;

  /**
   * @see {@link abstract.Document.testUserPermission}
   * @deprecated this is just a Document compatibility method
   */
  testUserPermission(
    user: TestUserPermParams[0],
    permission: TestUserPermParams[1],
    { exact }?: TestUserPermParams[2]
  ): ReturnType<documents.BaseActor["testUserPermission"]>;

  /**
   * @see {@link documents.BaseActor.isOwner}
   * @deprecated this is just a Document compatibility method
   */
  get isOwner(): boolean;
}

declare namespace PrototypeToken {
  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema
    extends Omit<
      ReturnType<typeof documents.BaseToken["defineSchema"]>,
      "_id" | "actorId" | "actorData" | "x" | "y" | "elevation" | "effects" | "overlayEffect" | "hidden"
    > {
    /**
     * The name used to describe the Token
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: true }>;

    /**
     * Does the prototype token use a random wildcard image?
     * @defaultValue `false`
     */
    randomImg: fields.BooleanField;
  }
}

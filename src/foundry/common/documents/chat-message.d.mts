import type { AnyObject, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.mts";
import type * as documents from "./module.mts";

declare global {
  type ChatMessageData = BaseChatMessage.Properties;

  type ChatSpeakerData = BaseChatMessage.Properties["speaker"];
}

/**
 * The Document definition for a ChatMessage.
 * Defines the DataSchema and common behaviors for a ChatMessage which are shared between both client and server.
 */
declare class BaseChatMessage extends Document<BaseChatMessage.Schema, BaseChatMessage.Metadata> {
  /**
   * @param data    - Initial data from which to construct the ChatMessage
   * @param context - Construction context options
   */
  constructor(data?: BaseChatMessage.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseChatMessage.Metadata>;

  static override defineSchema(): BaseChatMessage.Schema;

  /**
   * Is a user able to create a new chat message?
   * @internal
   */
  static #canCreate(user: documents.BaseUser, doc: BaseChatMessage): boolean;

  /**
   * Is a user able to update an existing chat message?
   * @internal
   */
  static #canUpdate(user: documents.BaseUser, doc: BaseChatMessage, data: BaseChatMessage.UpdateData): boolean;

  /**
   * Is a user able to delete an existing chat message?
   * @internal
   */
  static #canDelete(user: documents.BaseUser, doc: BaseChatMessage): boolean;

  /**
   * Validate that Rolls belonging to the ChatMessage document are valid
   * @param rollJSON - The serialized Roll data
   */
  static #validateRoll(rollJSON: string): void;

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;
}
export default BaseChatMessage;

declare namespace BaseChatMessage {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "ChatMessage";
      collection: "messages";
      label: "DOCUMENT.ChatMessage";
      labelPlural: "DOCUMENT.ChatMessages";
      isPrimary: true;
      permissions: {
        create: (user: documents.BaseUser, doc: Document.Any) => boolean;
        update: (user: documents.BaseUser, doc: Document.Any, data: UpdateData) => boolean;
        delete: (user: documents.BaseUser, doc: Document.Any) => boolean;
      };
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this ChatMessage document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The message type from CONST.CHAT_MESSAGE_TYPES
     * @defaultValue `CONST.CHAT_MESSAGE_TYPES.OTHER`
     */
    type: fields.NumberField<{
      required: true;
      choices: CONST.CHAT_MESSAGE_TYPES[];
      initial: typeof CONST.CHAT_MESSAGE_TYPES.OTHER;
      validationError: "must be a value in CONST.CHAT_MESSAGE_TYPES";
    }>;

    /**
     * The _id of the User document who generated this message
     * @defaultValue `game?.user?.id`
     */
    user: fields.ForeignDocumentField<documents.BaseUser, { nullable: false; initial: () => string }>;

    /**
     * The timestamp at which point this message was generated
     * @defaultValue `Date.now()`
     */
    timestamp: fields.NumberField<{ required: true; nullable: false; initial: typeof Date.now }>;

    /**
     * An optional flavor text message which summarizes this message
     * @defaultValue `""`
     */
    flavor: fields.HTMLField;

    /**
     * The HTML content of this chat message
     * @defaultValue `""`
     */
    content: fields.HTMLField<{ textSearch: true }>;

    /**
     * A ChatSpeakerData object which describes the origin of the ChatMessage
     * @defaultValue see properties
     */
    speaker: fields.SchemaField<{
      /**
       * The _id of the Scene where this message was created
       * @defaultValue `null`
       */
      scene: fields.ForeignDocumentField<documents.BaseScene, { idOnly: true }>;

      /**
       * The _id of the Actor who generated this message
       * @defaultValue `null`
       */
      actor: fields.ForeignDocumentField<documents.BaseActor, { idOnly: true }>;

      /**
       * The _id of the Token who generated this message
       * @defaultValue `null`
       */
      token: fields.ForeignDocumentField<documents.BaseToken, { idOnly: true }>;

      /**
       * An overridden alias name used instead of the Actor or Token name
       * @defaultValue `""`
       */
      alias: fields.StringField;
    }>;

    /**
     * An array of User _id values to whom this message is privately whispered
     * @defaultValue `[]`
     */
    whisper: fields.ArrayField<fields.ForeignDocumentField<documents.BaseUser, { idOnly: true }>>;

    /**
     * Is this message sent blindly where the creating User cannot see it?
     * @defaultValue `false`
     */
    blind: fields.BooleanField;

    /**
     * Serialized content of any Roll instances attached to the ChatMessage
     * @defaultValue `[]`
     */
    rolls: fields.ArrayField<
      fields.JSONField<
        { validate: (rollJson: string) => void },
        fields.JSONField.AssignmentType<{ validate: (rollJson: string) => void }>,
        Roll // TODO: If initialization fails can this possibly be not-roll?
      >
    >;

    /**
     * The URL of an audio file which plays when this message is received
     * @defaultValue `null`
     */
    sound: fields.FilePathField<{ categories: ["AUDIO"] }>;

    /**
     * Is this message styled as an emote?
     * @defaultValue `false`
     */
    emote: fields.BooleanField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"ChatMessage">;
  }
}

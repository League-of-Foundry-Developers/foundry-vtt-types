import type { AnyObject, InexactPartial } from "fvtt-types/utils";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The ChatMessage Document.
 * Defines the DataSchema and common behaviors for a ChatMessage which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseChatMessage extends Document<"ChatMessage", BaseChatMessage.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the ChatMessage
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseChatMessage.ConstructorData, context?: Document.ConstructionContext<BaseChatMessage.Parent>);

  override parent: BaseChatMessage.Parent;

  static override metadata: BaseChatMessage.Metadata;

  static override defineSchema(): BaseChatMessage.Schema;

  /**
   * Is a user able to create a new chat message?
   * @internal
   */
  // static #canCreate(user: User, doc: BaseChatMessage): boolean;

  // /**
  //  * Is a user able to update an existing chat message?
  //  * @internal
  //  */
  // static #canUpdate(user: User, doc: BaseChatMessage, data: BaseChatMessage.UpdateData): boolean;

  /**
   * Validate that Rolls belonging to the ChatMessage document are valid
   * @param rollJSON - The serialized Roll data
   */
  static #validateRoll(rollJSON: string): void;

  override testUserPermission(
    user: User,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{ exact: boolean }>,
  ): boolean;

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

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks Replaced by `author`
   */
  get user(): this["author"];
}

export default BaseChatMessage;

declare namespace BaseChatMessage {
  type Parent = null;

  type TypeNames = Game.Model.TypeNames<"ChatMessage">;

  type Metadata = Document.MetadataFor<BaseChatMessage>;

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

    type: fields.DocumentTypeField<typeof BaseChatMessage, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

    system: fields.TypeDataField<typeof BaseChatMessage>;

    /**
     * The message type from CONST.CHAT_MESSAGE_STYLES
     * @defaultValue `CONST.CHAT_MESSAGE_STYLES.OTHER`
     */
    style: fields.NumberField<{
      required: true;
      choices: CONST.CHAT_MESSAGE_STYLES[];
      initial: typeof CONST.CHAT_MESSAGE_STYLES.OTHER;
      validationError: "must be a value in CONST.CHAT_MESSAGE_TYPES";
    }>;

    /**
     * The _id of the User document who generated this message
     * @defaultValue `game?.user?.id`
     */
    author: fields.ForeignDocumentField<typeof documents.BaseUser, { nullable: false; initial: () => string }>;

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
      scene: fields.ForeignDocumentField<typeof documents.BaseScene, { idOnly: true }>;

      /**
       * The _id of the Actor who generated this message
       * @defaultValue `null`
       */
      actor: fields.ForeignDocumentField<typeof documents.BaseActor, { idOnly: true }>;

      /**
       * The _id of the Token who generated this message
       * @defaultValue `null`
       */
      token: fields.ForeignDocumentField<typeof documents.BaseToken, { idOnly: true }>;

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
    whisper: fields.ArrayField<fields.ForeignDocumentField<typeof documents.BaseUser, { idOnly: true }>>;

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

    _stats: fields.DocumentStatsField;
  }
}

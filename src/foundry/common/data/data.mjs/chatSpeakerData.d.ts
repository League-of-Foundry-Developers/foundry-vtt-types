import { ConfiguredDocumentClass, FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import { BaseActor, BaseChatMessage, BaseScene } from "../../documents.mjs";
import * as fields from "../fields.mjs";
import { ForeignDocumentField } from "../fields.mjs";

interface ChatSpeakerDataSchema extends DocumentSchema {
  scene: ForeignDocumentField<{ type: typeof BaseScene; required: false }>;
  actor: ForeignDocumentField<{ type: typeof BaseActor; required: false }>;
  token: FieldReturnType<fields.DocumentId, { required: false }>;
  alias: fields.StringField;
}

interface ChatSpeakerDataProperties {
  /**
   * The _id of the Scene where this message was created
   * @defaultValue `null`
   */
  scene: string | null;

  /**
   * The _id of the Actor who generated this message
   * @defaultValue `null`
   */
  actor: string | null;

  /**
   * The _id of the Token who generated this message
   * @defaultValue `null`
   */
  token: string | null;

  /**
   * An overridden alias name used instead of the Actor or Token name
   */
  alias: string | undefined;
}

interface ChatSpeakerDataConstructorData {
  /**
   * The _id of the Scene where this message was created
   * @defaultValue `null`
   */
  scene?: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseScene>> | string | null | undefined;

  /**
   * The _id of the Actor who generated this message
   * @defaultValue `null`
   */
  actor?: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseActor>> | string | null | undefined;

  /**
   * The _id of the Token who generated this message
   * @defaultValue `null`
   */
  token?: string | null | undefined;

  /**
   * An overridden alias name used instead of the Actor or Token name
   */
  alias?: string | null | undefined;
}

type ChatSpeakerDataSource = PropertiesToSource<ChatSpeakerDataProperties>;

/**
 * An embedded data object which defines the properties of a light source animation
 */
export class ChatSpeakerData extends DocumentData<
  ChatSpeakerDataSchema,
  ChatSpeakerDataProperties,
  ChatSpeakerDataSource,
  ChatSpeakerDataConstructorData,
  BaseChatMessage
> {
  static override defineSchema(): ChatSpeakerDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChatSpeakerData extends ChatSpeakerDataProperties {}

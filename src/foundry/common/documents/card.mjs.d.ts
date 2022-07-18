import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import { DataModel, DataSchema } from '../abstract/data.mjs';
import { ConfiguredDocumentClass } from '../../../types/helperTypes.js';
import { FlagsField } from '../data/flagsField';

export interface BaseCardFaceSchema<
  NameLabel extends string = string,
  TextLabel extends string = string,
  ImgLabel extends string = string
> extends DataSchema {
  /** A name for this card face */
  name: fields.StringField<{ label: NameLabel }>;

  /** Displayed text that belongs to this face */
  text: fields.HTMLField<{ label: TextLabel }>;

  /** A displayed image or video file which depicts the face */
  img: fields.FilePathField<{
    categories: ['IMAGE', 'VIDEO'];
    initial: () => typeof BaseCard.DEFAULT_ICON;
    label: ImgLabel;
  }>;
}

export interface BaseCardSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this Card document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The text name of this card
   */
  name: fields.StringField<{ required: true; blank: false; label: 'CARD.Name' }>;

  /**
   * A text description of this card which applies to all faces
   */
  description: fields.HTMLField<{ label: 'CARD.Description' }>;

  /**
   * A category of card (for example, a suit) to which this card belongs
   */
  type: fields.StringField<{
    required: true;
    label: 'CARD.Type';
    choices: () => typeof BaseCard.TYPES;
    initial: typeof BaseCard.TYPES[0];
  }>;

  /**
   * Game system data which is defined by the system template.json model
   */
  system: fields.SystemDataField<typeof BaseCard, {}>;

  /**
   * An optional suit designation which is used by default sorting
   */
  suit: fields.StringField<{ label: 'CARD.Suit' }>;

  /**
   * An optional numeric value of the card which is used by default sorting
   */
  value: fields.NumberField<{ label: 'CARD.Value' }>;

  /**
   * An object of face data which describes the back of this card
   */
  back: fields.SchemaField<BaseCardFaceSchema<'CARD.BackName', 'CARD.BackText', 'CARD.BackImage'>, {}>;

  /**
   * An array of face data which represent displayable faces of this card
   */
  faces: fields.ArrayField<
    fields.SchemaField<BaseCardFaceSchema<'CARD.FaceName', 'CARD.FaceText', 'CARD.FaceImage'>, {}>,
    {}
  >;

  /**
   * The index of the currently displayed face, or null if the card is face-down
   */
  face: fields.NumberField<{ required: true; initial: null; integer: true; min: 0; label: 'CARD.Face' }>;

  /**
   * Whether this card is currently drawn from its source deck
   */
  drawn: fields.BooleanField<{ label: 'CARD.Drawn' }>;

  /**
   * The document ID of the origin deck to which this card belongs
   */
  origin: fields.ForeignDocumentField<typeof documents.BaseCards, {}>;

  /**
   * The visible width of this card
   */
  width: fields.NumberField<{ integer: true; positive: true; label: 'Width' }>;

  /**
   * The visible height of this card
   */
  height: fields.NumberField<{ integer: true; positive: true; label: 'Height' }>;

  /**
   * The angle of rotation of this card
   */
  rotation: fields.AngleField<{ label: 'Rotation' }>;

  /**
   * The sort order of this card relative to others in the same stack
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Card', {}>;
}

type CanUpdate = (
  user: documents.BaseUser,
  doc: BaseCard,
  data: DeepPartial<DataModel.SchemaToSource<BaseCard['schema']>>
) => boolean;

type CanCreate = (
  user: documents.BaseUser,
  doc: BaseCard,
  data: DataModel.SchemaToSource<BaseCard['schema']>
) => boolean;

type BaseCardMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Card';
    collection: 'cards';
    label: 'DOCUMENT.Card';
    labelPlural: 'DOCUMENT.Cards';
    permissions: {
      create: CanCreate;
      update: CanUpdate;
    };
  }
>;

type BaseCardShims = {
  /**
   * Rename data to system
   * @deprecated since v10
   */
  data: BaseCard['system'];
};

/**
 * The Document definition for a Card.
 * Defines the DataSchema and common behaviors for a Card which are shared between both client and server.
 */
declare class BaseCard extends Document<
  BaseCardSchema,
  InstanceType<ConfiguredDocumentClass<typeof Cards>>,
  BaseCardMetadata,
  BaseCardShims
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseCardMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseCardSchema;

  /**
   * The default icon used for a Card face that does not have a custom image set
   *
   * (initialized: `'icons/svg/card-joker.svg'`)
   */
  static DEFAULT_ICON: string;

  /**
   * The allowed set of Card types which may exist
   *
   * (initialized: `game.documentTypes?.Card || [CONST.BASE_DOCUMENT_TYPE]`)
   */
  static get TYPES(): string[];

  /**
   * Is a User able to create a new Card within this parent?
   */
  static #canCreate: CanCreate;

  /**
   * Is a user able to update an existing Card?
   */
  static #canUpdate: CanUpdate;

  /* -------------------------------------------- */
  /*  Model Methods                               */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  override testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseCard;

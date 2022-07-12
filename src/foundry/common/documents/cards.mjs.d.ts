import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import * as documents from './module.mjs';
import { DocumentStatsSchema } from '../data/data.mjs';
import { DataModel, DataSchema } from '../abstract/data.mjs';
import { FlagsField } from '../data/flagsField';

interface BaseCardsSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this stack of Cards document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The text name of this stack
   */
  name: fields.StringField<{ required: true; blank: false; label: 'CARDS.Name' }>;

  /**
   * The type of this stack, in BaseCards.metadata.types
   */
  type: fields.StringField<{
    required: true;
    label: 'CARDS.Type';
    choices: () => typeof BaseCards.TYPES;
    initial: () => typeof BaseCards.TYPES[0];
    validationError: 'The Cards type must be in the array of types supported by the game system';
  }>;

  /**
   * A text description of this stack
   */
  description: fields.HTMLField<{ label: 'CARDS.Description' }>;

  /**
   * An image or video which is used to represent the stack of cards
   */
  img: fields.FilePathField<{
    categories: ['IMAGE', 'VIDEO'];
    initial: () => typeof BaseCards.DEFAULT_ICON;
    label: 'CARDS.Image';
  }>;

  /**
   * Game system data which is defined by the system template.json model
   */
  system: fields.SystemDataField<typeof BaseCards, {}>;

  // TODO circularly references on Cards
  /**
   * A collection of Card documents which currently belong to this stack
   */
  //   cards: fields.EmbeddedCollectionField<typeof documents.BaseCard, {}>;

  /**
   * The visible width of this stack
   */
  width: fields.NumberField<{ integer: true; positive: true; label: 'Width' }>;

  /**
   * The visible height of this stack
   */
  height: fields.NumberField<{ integer: true; positive: true; label: 'Height' }>;

  /**
   * The angle of rotation of this stack
   */
  rotation: fields.AngleField<{ label: 'Rotation' }>;

  /**
   * Whether or not to publicly display the number of cards in this stack
   */
  displayCount: fields.BooleanField<{}>;

  /**
   * The _id of a Folder which contains this document
   */
  folder: fields.ForeignDocumentField<typeof documents.BaseFolder, {}>;

  /**
   * The sort order of this stack relative to others in its parent collection
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object which configures ownership of this Cards
   */
  ownership: fields.DocumentOwnershipField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Cards', {}>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
}

type BaseCardsMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Cards';
    collection: 'cards';
    compendiumIndexFields: ['_id', 'name', 'img', 'type', 'sort'];
    embedded: { Card: 'cards' };
    label: 'DOCUMENT.Cards';
    labelPlural: 'DOCUMENT.CardsPlural';
    coreTypes: ['deck', 'hand', 'pile'];

    /** BaseCards.metadata.types is deprecated since v10 in favour of BaseCards.TYPES. */
    types: typeof BaseCards.TYPES;
  }
>;

type BaseCardsShims = {
  /**
   * Rename data to system
   * @deprecated since v10
   */
  data: BaseCards['system'];

  /**
   * Rename permission to ownership
   * @deprecated since v10
   */
  permission: BaseCards['ownership'];
};

/**
 * The Document definition for Cards.
 * Defines the DataSchema and common behaviors for Cards which are shared between both client and server.
 */
declare class BaseCards extends Document<BaseCardsSchema, null, BaseCardsMetadata, BaseCardsShims> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseCardsMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseCardsSchema;

  /**
   * The default icon used for a cards stack that does not have a custom image set
   *
   * (initialized: `'icons/svg/card-hand.svg'`)
   */
  static DEFAULT_ICON: string;

  /**
   * The allowed set of CardsData types which may exist
   *
   * (initialized: `game.documentTypes?.Cards || []`)
   */
  static get TYPES(): string[];

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseCards;

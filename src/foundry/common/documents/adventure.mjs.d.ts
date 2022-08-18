import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import type { DataSchema } from '../abstract/data.mjs';
import type { DocumentStatsSchema } from '../data/data.mjs.js';
import { FlagsField } from '../data/flagsField';

interface BaseAdventureSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this Adventure document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The human-readable name of the Adventure
   */
  name: fields.StringField<{ required: true; blank: false; label: 'ADVENTURE.Name'; hint: 'ADVENTURE.NameHint' }>;

  /**
   * The file path for the primary image of the adventure
   */
  img: fields.FilePathField<{ categories: ['IMAGE']; label: 'ADVENTURE.Image'; hint: 'ADVENTURE.ImageHint' }>;

  caption: fields.HTMLField<{ label: 'ADVENTURE.Caption'; hint: 'ADVENTURE.CaptionHint' }>;

  /**
   * An HTML text description for the adventure
   */
  description: fields.HTMLField<{ label: 'ADVENTURE.Description'; hint: 'ADVENTURE.DescriptionHint' }>;

  /**
   * An array of Actor documents which are included in the adventure
   */
  //   actors: fields.SetField<fields.EmbeddedDataField<typeof documents.BaseActor, {}>, {}>;

  /**
   * An array of Combat documents which are included in the adventure
   */
  combats: fields.SetField<fields.EmbeddedDataField<typeof documents.BaseCombat, {}>, {}>;

  /**
   * An array of Item documents which are included in the adventure
   */
  items: fields.SetField<fields.EmbeddedDataField<typeof documents.BaseItem, {}>, {}>;

  /**
   * An array of Scene documents which are included in the adventure
   */
  scenes: fields.SetField<fields.EmbeddedDataField<typeof documents.BaseScene, {}>, {}>;

  /**
   * An array of JournalEntry documents which are included in the adventure
   */
  journal: fields.SetField<fields.EmbeddedDataField<typeof documents.BaseJournalEntry, {}>, {}>;

  /**
   *  An array of RollTable documents which are included in the adventure
   */
  tables: fields.SetField<fields.EmbeddedDataField<typeof documents.BaseRollTable, {}>, {}>;

  /**
   * An array of Macro documents which are included in the adventure
   */
  macros: fields.SetField<fields.EmbeddedDataField<typeof documents.BaseMacro, {}>, {}>;

  /**
   * An array of Cards documents which are included in the adventure
   */
  cards: fields.SetField<fields.EmbeddedDataField<typeof documents.BaseCards, {}>, {}>;

  /**
   * An array of Playlist documents which are included in the adventure
   */
  playlists: fields.SetField<fields.EmbeddedDataField<typeof documents.BasePlaylist, {}>, {}>;

  /**
   * An array of Folder documents which are included in the adventure
   */
  folders: fields.SetField<fields.EmbeddedDataField<typeof documents.BaseFolder, {}>, {}>;

  /**
   * The sort order of this adventure relative to its siblings
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object of optional key/value flags
   * (default: `{}`)
   */
  flags: FlagsField<'Adventure', {}>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
}

type BaseAdventureMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Adventure';
    collection: 'adventures';
    label: 'DOCUMENT.Adventure';
    labelPlural: 'DOCUMENT.Adventures';
    isPrimary: false;
    isEmbedded: false;
  }
>;

/**
 * The Document definition for an Adventure.
 * Defines the DataSchema and common behaviors for an Adventure which are shared between both client and server.
 */
declare class BaseAdventure extends Document<BaseAdventureSchema, null, BaseAdventureMetadata> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseAdventureMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseAdventureSchema;

  /**
   * An array of the fields which provide imported content from the Adventure.
   */
  static get contentFields(): Record<string, AnyDocument>;

  /**
   * Provide a thumbnail image path used to represent the Adventure document.
   */
  get thumbnail(): this['img'];

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static migrateData(data: Record<string, unknown>): Record<string, unknown>;
}

export default BaseAdventure;

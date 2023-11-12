import Document, { DocumentMetadata, DocumentModificationOptions } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import * as documents from './module.mjs';
import DataModel, { DataSchema } from '../abstract/data.mjs';
import type { FlagsField } from '../data/flagsField.js';

interface BaseFogExplorationSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this FogExploration document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The _id of the Scene document to which this fog applies
   */
  scene: fields.ForeignDocumentField<typeof documents.BaseScene, { initial: () => string }>;

  /**
   * The _id of the User document to which this fog applies
   */
  //   user: fields.ForeignDocumentField<
  //     typeof documents.BaseUser,
  //     { initial: () => OptionalChaining<OptionalChaining<typeof game, 'user'>, 'id'> }
  //   >;

  /**
   * The base64 image/jpeg of the explored fog polygon
   */
  explored: fields.FilePathField<{ categories: ['IMAGE']; required: true; base64: true }>;

  /**
   * The object of scene positions which have been explored at a certain vision radius
   */
  positions: fields.ObjectField<{}>;

  /**
   * The timestamp at which this fog exploration was last updated
   */
  timestamp: fields.NumberField<{ nullable: false; initial: typeof Date.now }>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'FogExploration', {}>;
}

type CanModify = (user: documents.BaseUser, doc: BaseFogExploration) => boolean;

type BaseFogExplorationMetadata = Merge<
  DocumentMetadata,
  {
    name: 'FogExploration';
    collection: 'fog';
    label: 'DOCUMENT.FogExploration';
    labelPlural: 'DOCUMENT.FogExplorations';
    isPrimary: true;
    permissions: {
      create: 'PLAYER';
      update: CanModify;
      delete: CanModify;
    };
  }
>;

/**
 * The Document definition for FogExploration.
 * Defines the DataSchema and common behaviors for FogExploration which are shared between both client and server.
 */
declare class BaseFogExploration extends Document<BaseFogExplorationSchema, null, BaseFogExplorationMetadata> {
  /* ---------------------------------------- */
  /*  Model Configuration                     */
  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseFogExplorationMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseFogExplorationSchema;

  /**
   * Test whether a User can modify a FogExploration document.
   */
  static #canModify: CanModify;

  /* ---------------------------------------- */
  /*  Database Event Handlers                 */
  /* ---------------------------------------- */

  /** {@inheritdoc} */
  //   protected override _preUpdate(
  //     changed: DeepPartial<DataModel.SchemaToSource<this['schema']>>,
  //     options: DocumentModificationOptions,
  //     user: documents.BaseUser
  //   ): Promise<void>;
}

export default BaseFogExploration;

import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import { DocumentStatsSchema } from '../data/data.mjs';
import type { DataSchema } from '../abstract/data.mjs.js';

interface BaseSettingSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this Setting document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The setting key, a composite of \{scope\}.\{name\}
   */
  key: fields.StringField<{
    required: true;
    nullable: false;
    blank: false;
    validate: (k: string) => typeof k extends `${string}.${string}` ? true : false;
    validationError: 'must have the format {scope}.{field}';
  }>;

  /**
   * The setting value, which is serialized to JSON
   */
  value: fields.JSONField<{ required: true; nullable: false }>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
}

type BaseSettingMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Setting';
    collection: 'settings';
    label: 'DOCUMENT.Setting';
    labelPlural: 'DOCUMENT.Settings';
    permissions: {
      create: 'SETTINGS_MODIFY';
      update: 'SETTINGS_MODIFY';
      delete: 'SETTINGS_MODIFY';
    };
  }
>;

/**
 * The Document definition for a Setting.
 * Defines the DataSchema and common behaviors for a Setting which are shared between both client and server.
 */
declare class BaseSetting extends Document<BaseSettingSchema, null, BaseSettingMetadata> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseSettingMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseSettingSchema;
}

export default BaseSetting;

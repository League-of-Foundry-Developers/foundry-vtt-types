import BasePackage from './base-package.mjs';
import * as fields from '../data/fields.mjs';

declare namespace BaseSystem {
  export interface Schema extends BasePackage.Schema {
    /** A web URL or local file path which provides a default background banner for worlds which are created using this system */
    background: fields.StringField<{}>;

    /** A default initiative formula used for this system */
    initiative: fields.StringField<{}>;

    /** A default distance measurement to use for Scenes in this system */
    gridDistance: fields.NumberField<{}>;

    /** A default unit of measure to use for distance measurement in this system */
    gridUnits: fields.StringField<{}>;

    /** An Actor data attribute path to use for Token primary resource bars */
    primaryTokenAttribute: fields.StringField<{}>;

    /** An Actor data attribute path to use for Token secondary resource bars */
    secondaryTokenAttribute: fields.StringField<{}>;
  }
}

/**
 * The data schema used to define System manifest files.
 * Extends the basic PackageData schema with some additional system-specific fields.
 */
declare class BaseSystem extends BasePackage<BaseSystem.Schema, 'system'> {
  /** {@inheritDoc} */
  static override defineSchema(): BaseSystem.Schema;

  /** {@inheritdoc} */
  static type: ValueOf<typeof CONST.PACKAGE_TYPES>;

  /**
   * An alias for the document types available in the currently active World.
   */
  get documentTypes(): GetKey<typeof game, 'documentTypes'>;

  /**
   * An alias for the raw template JSON loaded from the game System.
   */
  get template(): GetKey<typeof game, 'template'>;

  /**
   * An alias for the structured data model organized by document class and type.
   */
  get model(): GetKey<typeof game, 'model'>;
}

export default BaseSystem;

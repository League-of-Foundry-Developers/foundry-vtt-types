import type BasePackage from './base-package.mjs';
import * as fields from '../data/fields.mjs';

declare namespace BaseWorld {
  export interface Schema extends BasePackage.Schema {
    /** The game system name which this world relies upon */
    system: fields.StringField<{ required: true; blank: false }>;

    /** A web URL or local file path which provides a background banner image */
    background: fields.StringField<{ required: false; blank: false; initial: undefined }>;

    /** The version of the core software for which this world has been migrated */
    coreVersion: fields.StringField<{ required: true; blank: false }>;

    /** The version of the game system for which this world has been migrated */
    systemVersion: fields.StringField<{ required: true; blank: false; initial: '0' }>;

    /** An ISO datetime string when the next game session is scheduled to occur */
    nextSession: fields.StringField<{ blank: false; nullable: true; initial: null }>;

    /** Should user access keys be reset as part of the next launch? */
    resetKeys: fields.BooleanField<{ required: false; initial: undefined }>;

    /** Should the world launch in safe mode? */
    safeMode: fields.BooleanField<{ required: false; initial: undefined }>;
  }
}

/**
 * The data schema used to define World manifest files.
 * Extends the basic PackageData schema with some additional world-specific fields.
 */
declare class BaseWorld extends BasePackage<BaseWorld.Schema, 'world'> {
  /** {@inheritDoc} */
  static override defineSchema(): BaseWorld.Schema;

  /** @override */
  static type: ValueOf<typeof CONST.PACKAGE_TYPES>;
}

export default BaseWorld;

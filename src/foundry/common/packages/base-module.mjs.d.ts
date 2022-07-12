import BasePackage from './base-package.mjs';
import * as fields from '../data/fields.mjs';

declare namespace BaseModule {
  export interface Schema extends BasePackage.Schema {
    /** Does this module provide a translation for the core software? */
    coreTranslation: fields.BooleanField<{}>;

    /** A library module provides no user-facing functionality and is solely for use by other modules. Loaded before any system or module scripts. */
    library: fields.BooleanField<{}>;
  }
}

/**
 * The data schema used to define Module manifest files.
 * Extends the basic PackageData schema with some additional module-specific fields.
 */
declare class BaseModule extends BasePackage<BaseModule.Schema, 'module'> {
  /** {@inheritDoc} */
  static override defineSchema(): BaseModule.Schema;

  /** @override */
  static type: ValueOf<typeof CONST.PACKAGE_TYPES>;
}

export default BaseModule;

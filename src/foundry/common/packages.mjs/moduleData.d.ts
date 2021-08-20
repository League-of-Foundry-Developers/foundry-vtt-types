import * as fields from '../data/fields.mjs';
import { PackageData, PackageDataConstructorData, PackageDataProperties, PackageDataSchema } from './packageData';

interface ModuleDataSchema extends PackageDataSchema {
  coreTranslation: typeof fields.BOOLEAN_FIELD;
  minimumSystemVersion: typeof fields.STRING_FIELD;
  library: typeof fields.BOOLEAN_FIELD;
}

interface ModuleDataProperties extends PackageDataProperties {
  /**
   * Does this module provide a translation for the core software?
   */
  coreTranslation: boolean;

  /** A minimum version number of the game system that this module requires */
  minimumSystemVersion?: string;

  /**
   * A library module provides no user-facing functionality and is solely for
   * use by other modules. Loaded before any system or module scripts.
   * @defaultValue `false`
   */
  library: boolean;
}

interface ModuleDataConstructorData extends PackageDataConstructorData {
  /**
   * Does this module provide a translation for the core software?
   */
  coreTranslation?: boolean | null;

  /** A minimum version number of the game system that this module requires */
  minimumSystemVersion?: string | null;

  /**
   * A library module provides no user-facing functionality and is solely for
   * use by other modules. Loaded before any system or module scripts.
   * @defaultValue `false`
   */
  library?: boolean | null;
}

/**
 * The data schema used to define Module manifest files.
 * Extends the basic PackageData schema with some additional module-specific fields.
 */
export declare class ModuleData extends PackageData<ModuleDataSchema, ModuleDataProperties, ModuleDataConstructorData> {
  static defineSchema(): ModuleDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface ModuleData extends ModuleDataProperties {}

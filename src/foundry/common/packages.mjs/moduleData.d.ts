import * as fields from '../data/fields.mjs';
import { PackageData, PackageDataConstructorData, PackageDataProperties, PackageDataSchema } from './packageData';

interface ModuleDataSchema extends PackageDataSchema {
  coreTranslation: typeof fields.BOOLEAN_FIELD;
  minimumSystemVersion: typeof fields.STRING_FIELD;
}

interface ModuleDataProperties extends PackageDataProperties {
  coreTranslation: boolean;

  /** A minimum version number of the game system that this module requires */
  minimumSystemVersion?: string;
}

interface ModuleDataConstructorData extends PackageDataConstructorData {
  coreTranslation?: boolean | null;

  /** A minimum version number of the game system that this module requires */
  minimumSystemVersion?: string | null;
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

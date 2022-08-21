import * as fields from "../data/fields.mjs";
import { PackageData, PackageDataConstructorData, PackageDataProperties, PackageDataSchema } from "./packageData";

interface ModuleDataSchema extends PackageDataSchema {
  coreTranslation: fields.BooleanField;
  minimumSystemVersion: fields.StringField;
  library: fields.BooleanField;
}

interface ModuleDataProperties extends PackageDataProperties {
  /**
   * Does this module provide a translation for the core software?
   * @defaultValue `false`
   */
  coreTranslation: boolean;

  /** A minimum version number of the game system that this module requires */
  minimumSystemVersion: string | undefined;

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
   * @defaultValue `false`
   */
  coreTranslation?: boolean | null | undefined;

  /** A minimum version number of the game system that this module requires */
  minimumSystemVersion?: string | null | undefined;

  /**
   * A library module provides no user-facing functionality and is solely for
   * use by other modules. Loaded before any system or module scripts.
   * @defaultValue `false`
   */
  library?: boolean | null | undefined;
}

/**
 * The data schema used to define Module manifest files.
 * Extends the basic PackageData schema with some additional module-specific fields.
 */
export class ModuleData extends PackageData<ModuleDataSchema, ModuleDataProperties, ModuleDataConstructorData> {
  static override defineSchema(): ModuleDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModuleData extends ModuleDataProperties {}

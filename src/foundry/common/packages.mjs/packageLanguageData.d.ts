import { FieldReturnType, PropertiesToSource } from '../../../types/helperTypes';
import { DocumentData } from '../abstract/module.mjs';
import * as fields from '../data/fields.mjs';

interface PackageLanguageDataSchema extends DocumentSchema {
  lang: FieldReturnType<
    typeof fields.REQUIRED_STRING,
    {
      validate: (lang: string) => boolean;
      validationError: 'Invalid language code provided which is not supported by Intl.getCanonicalLocales';
    }
  >;
  name: typeof fields.STRING_FIELD;
  path: typeof fields.STRING_FIELD;
  system: typeof fields.STRING_FIELD;
  module: typeof fields.STRING_FIELD;
}

interface PackageLanguageDataProperties {
  /** A string language code which is validated by Intl.getCanonicalLocales */
  lang: string;

  /** The human-readable language name */
  name: string | undefined;

  /** The relative path to included JSON translation strings */
  path: string | undefined;

  /** Only apply this set of translations when a specific system is being used */
  system: string | undefined;

  module: string | undefined;
}

interface PackageLanguageDataConstructorData {
  /** A string language code which is validated by Intl.getCanonicalLocales */
  lang: string;

  /** The human-readable language name */
  name?: string | null | undefined;

  /** The relative path to included JSON translation strings */
  path?: string | null | undefined;

  /** Only apply this set of translations when a specific system is being used */
  system?: string | null | undefined;

  module?: string | null | undefined;
}

/**
 * An inner data object which represents a single language specification provided by a package in the languages array.
 */
export declare class PackageLanguageData extends DocumentData<
  PackageLanguageDataSchema,
  PackageLanguageDataProperties,
  PropertiesToSource<PackageLanguageDataProperties>,
  PackageLanguageDataConstructorData
> {
  static defineSchema(): PackageLanguageDataSchema;

  /** @override */
  protected _initialize(): void;

  /**
   * Validate that a language code is supported as a canonical locale
   * @param lang - The candidate language to validate
   * @returns Is it valid?
   */
  static validateLocale(lang: string): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface PackageLanguageData extends PackageLanguageDataProperties {}

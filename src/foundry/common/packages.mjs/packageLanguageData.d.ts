import { FieldReturnType, PropertiesToSource } from "../../../types/helperTypes";
import { DocumentData } from "../abstract/module.mjs";
import * as fields from "../data/fields.mjs";

interface PackageLanguageDataSchema extends DocumentSchema {
  lang: FieldReturnType<
    fields.RequiredString,
    {
      validate: (lang: string) => boolean;
      validationError: "Invalid language code provided which is not supported by Intl.getCanonicalLocales";
    }
  >;
  name: fields.StringField;
  path: fields.RequiredString;
  system: fields.StringField;
  module: fields.StringField;
}

interface PackageLanguageDataProperties {
  /** A string language code which is validated by Intl.getCanonicalLocales */
  lang: string;

  /** The human-readable language name */
  name: string | undefined;

  /** The relative path to included JSON translation strings */
  path: string;

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
  path: string;

  /** Only apply this set of translations when a specific system is being used */
  system?: string | null | undefined;

  module?: string | null | undefined;
}

type PackageLanguageDataSource = PropertiesToSource<PackageLanguageDataProperties>;

/**
 * An inner data object which represents a single language specification provided by a package in the languages array.
 */
export class PackageLanguageData extends DocumentData<
  PackageLanguageDataSchema,
  PackageLanguageDataProperties,
  PackageLanguageDataSource,
  PackageLanguageDataConstructorData
> {
  static override defineSchema(): PackageLanguageDataSchema;

  protected override _initialize(): void;

  /**
   * Validate that a language code is supported as a canonical locale
   * @param lang - The candidate language to validate
   * @returns Is it valid?
   */
  static validateLocale(lang: string): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PackageLanguageData extends PackageLanguageDataProperties {}

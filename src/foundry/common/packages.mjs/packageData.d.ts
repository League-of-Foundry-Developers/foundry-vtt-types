import { FieldReturnType, PropertiesToSource } from "../../../types/helperTypes";
import { DocumentData } from "../abstract/module.mjs";
import type { PACKAGE_AVAILABILITY_CODES } from "../constants.mjs";
import * as fields from "../data/fields.mjs";
import { PackageAuthorData, PackageAuthorDataConstructorData } from "./packageAuthorData";
import { PackageCompendiumData, PackageCompendiumDataConstructorData } from "./packageCompendiumData";
import { PackageDependencyData, PackageDependencyDataConstructorData } from "./packageDependencyData";
import { PackageLanguageData, PackageLanguageDataConstructorData } from "./packageLanguageData";

/**
 * A helper field used for string arrays
 */
declare const STRING_ARRAY_FIELD: StringArrayField;
/**
 * Property type: `string[]`
 * Constructor type: `string[] | null | undefined`
 * Default `[]`
 */
type StringArrayField = DocumentField<string[]> & {
  type: [typeof String];
  required: true;
  default: [];
  clean: (v: unknown) => string[];
};

/**
 * A helper field used for arrays of package include objects
 */
declare const INCLUDE_ARRAY_FIELD: <T extends ConstructorOf<DocumentData<any, any>>>(
  type: T
) => IncludeArrayFieldReturnType<T>;
/**
 * Property type: `T[]`
 * Constructor type: `T[] | null | undefined`
 * Default `[]`
 */
type IncludeArrayFieldReturnType<T extends ConstructorOf<DocumentData<any, any>>> = DocumentField<
  Array<InstanceType<T>>
> & {
  type: [T];
  required: true;
  default: [];
  clean: (v: unknown) => InstanceType<T>["_source"][];
};

interface PackageDataSchema extends DocumentSchema {
  name: fields.RequiredString;
  title: fields.RequiredString;
  description: fields.BlankString;
  author: fields.StringField;
  authors: IncludeArrayFieldReturnType<typeof PackageAuthorData>;
  url: fields.StringField;
  license: fields.StringField;
  readme: fields.StringField;
  bugs: fields.StringField;
  changelog: fields.StringField;
  flags: fields.ObjectField;
  version: FieldReturnType<fields.RequiredString, { default: "1.0.0" }>;
  minimumCoreVersion: fields.StringField;
  compatibleCoreVersion: fields.StringField;
  scripts: StringArrayField;
  esmodules: StringArrayField;
  styles: StringArrayField;
  languages: IncludeArrayFieldReturnType<typeof PackageLanguageData>;
  packs: IncludeArrayFieldReturnType<typeof PackageCompendiumData>;
  system: StringArrayField;
  dependencies: IncludeArrayFieldReturnType<typeof PackageDependencyData>;
  socket: FieldReturnType<fields.BooleanField, { default: false }>;
  manifest: fields.StringField;
  download: fields.StringField;
  protected: FieldReturnType<fields.BooleanField, { default: false }>;
}

interface PackageDataProperties {
  /** The canonical package name, should be lower-case with no spaces or special characters */
  name: string;

  /** The human-readable package title, containing spaces and special characters */
  title: string;

  /**
   * An optional package description, may contain HTML
   * @defaultValue `""`
   */
  description: string;

  /** A singular package author; this is an old field staged for later deprecation, please use authors */
  author: string | undefined;

  /**
   * An array of author objects who are co-authors of this package. Preferred to the singular author field.
   * @defaultValue `[]`
   */
  authors: PackageAuthorData[];

  /** A web url where more details about the package may be found */
  url: string | undefined;

  /** A web url or relative file path where license details may be found */
  license: string | undefined;

  /** A web url or relative file path where readme instructions may be found */
  readme: string | undefined;

  /** A web url where bug reports may be submitted and tracked */
  bugs: string | undefined;

  /** A web url where notes detailing package updates are available */
  changelog: string | undefined;

  /** @defaultValue `{}` */
  flags: Record<string, unknown>;

  /**
   * The current package version
   * @defaultValue `"1.0.0"`
   */
  version: string;

  /** A minimum version of the core Foundry software which is required to use this package */
  minimumCoreVersion: string | undefined;

  /** A maximum version of the core Foundry software beyond which compatibility is not guaranteed */
  compatibleCoreVersion: string | undefined;

  /**
   * An array of urls or relative file paths for JavaScript files which should be included
   * @defaultValue `[]`
   */
  scripts: string[];

  /**
   * An array of urls or relative file paths for ESModule files which should be included
   * @defaultValue `[]`
   */
  esmodules: string[];

  /**
   * An array of urls or relative file paths for CSS stylesheet files which should be included
   * @defaultValue `[]`
   */
  styles: string[];

  /**
   * An array of language data objects which are included by this package
   * @defaultValue `[]`
   */
  languages: PackageLanguageData[];

  /**
   * An array of compendium packs which are included by this package
   * @defaultValue `[]`
   */
  packs: PackageCompendiumData[];

  /**
   * An array of game system names which this module supports
   * @defaultValue `[]`
   */
  system: string[];

  /**
   * An array of dependency objects which define required dependencies for using this package
   * @defaultValue `[]`
   */
  dependencies: PackageDependencyData[];

  /**
   * Whether to require a package-specific socket namespace for this package
   * @defaultValue `false`
   */
  socket: boolean;

  /** A publicly accessible web URL which provides the latest available package manifest file. Required in order to support module updates. */
  manifest: string | undefined;

  /** A publicly accessible web URL where the source files for this package may be downloaded. Required in order to support module installation. */
  download: string | undefined;

  /**
   * Whether this package uses the protected content access system.
   * @defaultValue `false`
   */
  protected: boolean;
}

interface PackageDataConstructorData {
  /** The canonical package name, should be lower-case with no spaces or special characters */
  name: string;

  /** The human-readable package title, containing spaces and special characters */
  title: string;

  /**
   * An optional package description, may contain HTML
   * @defaultValue `""`
   */
  description?: string | null | undefined;

  /** A singular package author; this is an old field staged for later deprecation, please use authors */
  author?: string | null | undefined;

  /**
   * An array of author objects who are co-authors of this package. Preferred to the singular author field.
   * @defaultValue `[]`
   */
  authors?: PackageAuthorDataConstructorData[] | null | undefined;

  /** A web url where more details about the package may be found */
  url?: string | null | undefined;

  /** A web url or relative file path where license details may be found */
  license?: string | null | undefined;

  /** A web url or relative file path where readme instructions may be found */
  readme?: string | null | undefined;

  /** A web url where bug reports may be submitted and tracked */
  bugs?: string | null | undefined;

  /** A web url where notes detailing package updates are available */
  changelog?: string | null | undefined;

  /** @defaultValue `{}` */
  flags?: Record<string, unknown> | null | undefined;

  /**
   * The current package version
   * @defaultValue `"1.0.0"`
   */
  version?: string | null | undefined;

  /** A minimum version of the core Foundry software which is required to use this package */
  minimumCoreVersion?: string | null | undefined;

  /** A maximum version of the core Foundry software beyond which compatibility is not guaranteed */
  compatibleCoreVersion?: string | null | undefined;

  /**
   * An array of urls or relative file paths for JavaScript files which should be included
   * @defaultValue `[]`
   */
  scripts?: string[] | null | undefined;

  /**
   * An array of urls or relative file paths for ESModule files which should be included
   * @defaultValue `[]`
   */
  esmodules?: string[] | null | undefined;

  /**
   * An array of urls or relative file paths for CSS stylesheet files which should be included
   * @defaultValue `[]`
   */
  styles?: string[] | null | undefined;

  /**
   * An array of language data objects which are included by this package
   * @defaultValue `[]`
   */
  languages?: PackageLanguageDataConstructorData[] | null | undefined;

  /**
   * An array of compendium packs which are included by this package
   * @defaultValue `[]`
   */
  packs?: PackageCompendiumDataConstructorData[] | null | undefined;

  /**
   * An array of game system names which this module supports
   * @defaultValue `[]`
   */
  system?: string[] | null | undefined;

  /**
   * An array of dependency objects which define required dependencies for using this package
   * @defaultValue `[]`
   */
  dependencies?: PackageDependencyDataConstructorData[] | null | undefined;

  /**
   * Whether to require a package-specific socket namespace for this package
   * @defaultValue `false`
   */
  socket?: boolean | null | undefined;

  /** A publicly accessible web URL which provides the latest available package manifest file. Required in order to support module updates. */
  manifest?: string | null | undefined;

  /** A publicly accessible web URL where the source files for this package may be downloaded. Required in order to support module installation. */
  download?: string | null | undefined;

  /**
   * Whether this package uses the protected content access system.
   * @defaultValue `false`
   */
  protected?: boolean | null | undefined;
}
/**
 * The data schema used to define a Package manifest.
 * Specific types of packages extend this schema with additional fields.
 */
export class PackageData<
  Schema extends Omit<PackageDataSchema, "system">,
  Properties extends Omit<PackageDataProperties, "system">,
  ConstructorData extends Omit<PackageDataConstructorData, "system">
> extends DocumentData<Schema, Properties, PropertiesToSource<Properties>, ConstructorData> {
  static override defineSchema(): Omit<PackageDataSchema, "system">;

  override _initializeSource(data: ConstructorData): PropertiesToSource<Properties>;

  /**
   * Determine the availability a package based on the version numbers of its dependencies.
   */
  static checkAvailability(
    minimumCoreVersion: number | string | null | undefined,
    compatibleCoreVersion: number | string | null | undefined
  ): PACKAGE_AVAILABILITY_CODES;
}

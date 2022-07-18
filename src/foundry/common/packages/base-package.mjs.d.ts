import DataModel, { DataSchema } from '../abstract/data.mjs';
import * as fields from '../data/fields.mjs';
import { COMPENDIUM_DOCUMENT_TYPES, PACKAGE_AVAILABILITY_CODES, PACKAGE_TYPES } from '../constants.mjs';
import { CONST } from '../module.mjs';
import { CompatibilitySchema } from '../data/data.mjs';
import type { FlagsField } from '../data/flagsField.js';

/* -------------------------------------------- */

/**
 * A field for denoting a related System
 */
export declare const RelatedSystemSchema: fields.SchemaField<
  {
    id: fields.StringField<{ required: true; blank: false }>;
    manifest: fields.StringField<{ required: false; blank: false; initial: undefined }>;
    compatibility: typeof CompatibilitySchema;
    reason: fields.StringField<{ required: false; blank: false; initial: undefined }>;
  },
  {}
>;

/* -------------------------------------------- */

/**
 * A field for denoting a related Package
 */
export declare const RelatedPackageSchema: fields.SchemaField<
  {
    id: fields.StringField<{ required: true; blank: false }>;
    type: fields.StringField<{ choices: typeof PACKAGE_TYPES; initial: 'module' }>;
    manifest: fields.StringField<{ required: false; blank: false; initial: undefined }>;
    compatibility: typeof CompatibilitySchema;
    reason: fields.StringField<{ required: false; blank: false; initial: undefined }>;
  },
  {}
>;

declare namespace BasePackage {
  type OptionalString = { required: false; blank: false; initial: undefined };

  export interface Schema extends DataSchema {
    // Package metadata
    id: fields.StringField<{ required: true; blank: false }>;
    title: fields.StringField<{ required: true; blank: false }>;
    description: fields.StringField<{ required: true }>;
    authors: fields.SetField<
      fields.SchemaField<
        {
          name: fields.StringField<{ required: true; blank: false }>;
          email: fields.StringField<OptionalString>;
          url: fields.StringField<OptionalString>;
          discord: fields.StringField<OptionalString>;
        },
        {}
      >,
      {}
    >;
    url: fields.StringField<OptionalString>;
    license: fields.StringField<OptionalString>;
    readme: fields.StringField<OptionalString>;
    bugs: fields.StringField<OptionalString>;
    changelog: fields.StringField<OptionalString>;
    flags: FlagsField<ValueOf<typeof CONST.PACKAGE_TYPES> | 'package', {}>;

    // Package versioning
    version: fields.StringField<{ required: true; blank: false; initial: '0.0.0' }>;
    compatibility: typeof CompatibilitySchema;

    // Included content
    scripts: fields.SetField<fields.StringField<{ required: true; blank: false }>, {}>;
    esmodules: fields.SetField<fields.StringField<{ required: true; blank: false }>, {}>;
    styles: fields.SetField<fields.StringField<{ required: true; blank: false }>, {}>;
    languages: fields.SetField<
      fields.SchemaField<
        {
          lang: fields.StringField<{
            required: true;
            blank: false;
            validate: typeof Intl.getCanonicalLocales;
            validationError: 'must be supported by the Intl.getCanonicalLocales function';
          }>;
          name: fields.StringField<{}>;
          path: fields.StringField<{ required: true; blank: false }>;
          system: fields.StringField<OptionalString>;
          module: fields.StringField<OptionalString>;
        },
        {}
      >,
      {}
    >;
    packs: fields.SetField<
      fields.SchemaField<
        {
          name: fields.StringField<{
            required: true;
            blank: false;
            validate: <N extends string>(n: N) => N extends `${string}.${string}` ? false : true;
            validationError: 'may not contain periods';
          }>;
          label: fields.StringField<{ required: true; blank: false }>;
          path: fields.StringField<{ required: true; blank: false }>;
          private: fields.BooleanField<{}>;
          type: fields.StringField<{
            required: true;
            blank: false;
            choices: typeof COMPENDIUM_DOCUMENT_TYPES;
            validationError: 'must be a value in CONST.COMPENDIUM_DOCUMENT_TYPES';
          }>;
          system: fields.StringField<OptionalString>;
        },
        {}
      >,
      {}
    >;

    // Package relationships
    relationships: fields.SchemaField<
      {
        systems: fields.SetField<typeof RelatedSystemSchema, {}>;
        requires: fields.SetField<typeof RelatedPackageSchema, {}>;
      },
      {}
    >;
    socket: fields.BooleanField<{}>;

    // Package downloading
    manifest: fields.StringField<{}>;
    download: fields.StringField<{ required: false; blank: false; initial: undefined }>;
    protected: fields.BooleanField<{}>;
  }

  type MigrateOptions = {
    since: number;
    until: number;
  };
}

/**
 * The data schema used to define a Package manifest.
 * Specific types of packages extend this schema with additional fields.
 */
declare class BasePackage<
  Schema extends BasePackage.Schema = BasePackage.Schema,
  Type extends ValueOf<typeof CONST.PACKAGE_TYPES> | 'package' = 'package'
> extends DataModel<null, Schema> {
  /**
   * @param data    - Source data for the package
   * @param options - Options which affect DataModel construction
   *                  (default: `{}`)
   */
  constructor(data: DataModel.SchemaToSourceInput<Schema>, options?: DataModel.ConstructorOptions);

  //   /**
  //    * An availability code in PACKAGE_AVAILABILITY_CODES which defines whether this package can be used.
  //    */
  //   availability: NullishCoalesce<this['availability'], typeof PACKAGE_AVAILABILITY_CODES.UNKNOWN>;

  //   /**
  //    * A flag which defines whether this package is unavailable to be used.
  //    */
  //   unavailable: NullishCoalesce<
  //     this['unavailable'],
  //     this['availability'] extends typeof PACKAGE_AVAILABILITY_CODES.UNKNOWN | typeof PACKAGE_AVAILABILITY_CODES.AVAILABLE
  //       ? false
  //       : true
  //   >;

  //   /**
  //    * A flag which tracks whether this package is currently locked.
  //    */
  //   locked: NullishCoalesce<this['locked'], false>;

  //   /**
  //    * A flag which tracks whether this package is a free Exclusive pack
  //    */
  //   exclusive: NullishCoalesce<this['exclusive'], false>;

  //   /**
  //    * A flag which tracks whether this package is owned, if it is protected.
  //    */
  //   owned: NullishCoalesce<this['owned'], false>;

  //   /**
  //    * A set of Tags that indicate what kind of Package this is, provided by the Website
  //    */
  //   tags: NullishCoalesce<this['tags'], []>;

  /**
   * Define the package type in CONST.PACKAGE_TYPES that this class represents.
   * Each BasePackage subclass must define this attribute.
   * @virtual
   */
  static type: ValueOf<typeof CONST.PACKAGE_TYPES>;

  /**
   * The type of this package instance. A value in CONST.PACKAGE_TYPES.
   */
  get type(): Type;

  /**
   * The canonical identifier for this package
   * @deprecated BasePackage#name is deprecated in favor of id.
   */
  get name(): string;

  /**
   * The named collection to which this package type belongs
   */
  static get collection(): `${ValueOf<typeof CONST.PACKAGE_TYPES>}s`;

  /** @deprecated BasePackage#data is deprecated in favor of referencing schema fields directly on the BasePackage instance. */
  get data(): this;

  /** {@inheritDoc} */
  static override defineSchema(): BasePackage.Schema;

  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* -------------------------------------------- */

  static #migrateNameToId(data: Record<string, unknown>, options: BasePackage.MigrateOptions): void;

  /* -------------------------------------------- */

  static #migrateCompendiumEntityToType(data: Record<string, unknown>, options: BasePackage.MigrateOptions): void;

  /* -------------------------------------------- */

  static #migrateAuthorToAuthors(data: Record<string, unknown>, options: BasePackage.MigrateOptions): void;

  /* -------------------------------------------- */

  static #migrateDependenciesNameToId(data: Record<string, unknown>, options: BasePackage.MigrateOptions): void;

  /* -------------------------------------------- */

  static #migrateToRelationships(data: Record<string, unknown>, options: BasePackage.MigrateOptions): void;

  /* -------------------------------------------- */

  static #migrateStringAuthors(data: Record<string, unknown>, options: BasePackage.MigrateOptions): void;

  /* -------------------------------------------- */

  static #migrateCompatibility(data: Record<string, unknown>, options: BasePackage.MigrateOptions): void;

  /* -------------------------------------------- */

  /** {@inheritdoc} */
  protected override _initializeSource(
    data: DataModel.SchemaToSourceInput<this['schema']>,
    options?: object
  ): DataModel.SchemaToSource<this['schema']>;
}

export default BasePackage;

import type { DataModel } from "#common/abstract/_module.d.mts";
import type { fields } from "#client/data/_module.d.mts";

declare namespace ServerSettings {
  interface Schema extends fields.DataSchema {
    /** The server administrator password (obscured) */
    adminPassword: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /** The relative path (to Config) of an AWS configuration file  */
    awsConfig: fields.StringField<{ blank: false; nullable: true; initial: null }>;

    /** Whether to compress static files? True by default  */
    compressStatic: fields.BooleanField<{ initial: true }>;

    compressSocket: fields.BooleanField<{ initial: true }>;

    cssTheme: fields.StringField<{ blank: false; choices: typeof CONST.CSS_THEMES; initial: "dark" }>;

    /** The absolute path of the user data directory (obscured) */
    dataPath: fields.StringField;

    deleteNEDB: fields.BooleanField;

    /** Whether the application should automatically start in fullscreen mode?  */
    fullscreen: fields.BooleanField<{ initial: false }>;

    /** A custom hostname applied to internet invitation addresses and URLs */
    hostname: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    hotReload: fields.BooleanField<{ initial: false }>;

    /** The default language for the application */
    language: fields.StringField<{ required: true; blank: false; initial: "en.core" }>;

    /** A custom hostname applied to local invitation addresses */
    localHostname: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /** A custom salt used for hashing user passwords (obscured) */
    passwordSalt: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /** The port on which the server is listening */
    port: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      min: 0;
      initial: 30000;
      validate: (value: unknown) => void; // ServerSettings.#validatePort
    }>;

    /**The Internet Protocol version to use, either 4 or 6. */
    protocol: fields.NumberField<{ integer: true; choices: [4, 6]; nullable: true }>;

    /** An external-facing proxied port used for invitation addresses and URLs */
    proxyPort: fields.NumberField<{ required: true; nullable: true; integer: true; initial: null }>;

    /** Is the application running in SSL mode at a reverse-proxy level? */
    proxySSL: fields.BooleanField<{ initial: false }>;

    /** A URL path part which prefixes normal application routing */
    routePrefix: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /** The relative path (to Config) of a used SSL certificate */
    sslCert: fields.StringField<{ blank: false; nullable: true; initial: null }>;

    /** The relative path (to Config) of a used SSL key */
    sslKey: fields.StringField<{ blank: false; nullable: true; initial: null }>;

    telemetry: fields.BooleanField<{ required: false; initial: undefined }>;

    /** The current application update channel */
    updateChannel: fields.StringField<{
      required: true;
      choices: typeof CONST.SOFTWARE_UPDATE_CHANNELS;
      initial: "stable";
    }>;

    /** Is UPNP activated? */
    upnp: fields.BooleanField<{ initial: true }>;

    /** The duration in seconds of a UPNP lease, if UPNP is active  */
    upnpLeaseDuration: fields.NumberField;

    /** A default world name which starts automatically on launch */
    world: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    noBackups: fields.BooleanField<{ required: false }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * A data model definition which describes the application configuration options.
 * These options are persisted in the user data Config folder in the options.json file.
 * The server-side software extends this class and provides additional validations.
 */
declare class ServerSettings extends DataModel<ServerSettings.Schema> {
  static override defineSchema(): ServerSettings.Schema;

  /** @defaultValue `["SERVER_SETTINGS"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * @remarks
   * Migrations:
   * - pre-v9 `updateChannel`s to their updated names
   * - `awsConfig === true` to `""` (since v11)
   * - `cssTheme` converted from `"foundry"` to `"dark"` (since v13)
   */
  static override migrateData(source: object): object;

  /**
   * Validate a port assignment.
   * @param port - The requested port
   * @throws An error if the requested port is invalid
   * @deprecated This was made hard private in v13. This warning will be removed in v14.
   */
  static _validatePort(port: never): never;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<ServerSettings.Schema>;

  static override get schema(): fields.SchemaField<ServerSettings.Schema>;

  static override validateJoint(data: ServerSettings.Source): void;

  static override fromSource(source: ServerSettings.CreateData, context?: DataModel.FromSourceOptions): ServerSettings;

  static override fromJSON(json: string): ServerSettings;
}

declare namespace ReleaseData {
  interface Schema extends fields.DataSchema {
    /** The major generation of the Release */
    generation: fields.NumberField<{ required: true; nullable: false; integer: true; min: 1 }>;

    /** The maximum available generation of the software. */
    maxGeneration: fields.NumberField<{
      required: false;
      nullable: false;
      integer: true;
      min: 1;
      initial: () => number;
    }>;

    /** The maximum available stable generation of the software. */
    maxStableGeneration: fields.NumberField<{
      required: false;
      nullable: false;
      integer: true;
      min: 1;
      initial: () => number;
    }>;

    /** The channel the Release belongs to, such as "stable" */
    channel: fields.StringField<{ choices: typeof CONST.SOFTWARE_UPDATE_CHANNELS; blank: false }>;

    /** An optional appended string display for the Release */
    suffix: fields.StringField;

    /** The internal build number for the Release */
    build: fields.NumberField<{ required: true; nullable: false; integer: true }>;

    /** When the Release was released */
    time: fields.NumberField<{ nullable: false; initial: typeof Date.now }>;

    /** The minimum required Node.js major version */
    node_version: fields.NumberField<{ required: true; nullable: false; integer: true; min: 10 }>;

    /** Release notes for the update version */
    notes: fields.StringField;

    /** A temporary download URL where this version may be obtained */
    download: fields.StringField;

    /** Supplementary data that accompanies this release. */
    flags: fields.ObjectField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/** A data object which represents the details of this Release of Foundry VTT */
declare class ReleaseData extends DataModel<ReleaseData.Schema> {
  static override defineSchema(): ReleaseData.Schema;

  /** A formatted string for shortened display, such as "Version 9" */
  get shortDisplay(): string;

  /** A formatted string for general display, such as "V9 Prototype 1" or "Version 9" */
  get display(): string;

  /** A formatted string for Version compatibility checking, such as "9.150" */
  get version(): `${string}.${string}`;

  /** Whether this generation requires manual installation.  */
  get requiresManualInstall(): boolean;

  override toString(): this["shortDisplay"];

  /**
   * Is this `ReleaseData` object newer than some other version?
   * @param other - Some other version to compare against
   * @returns Is this `ReleaseData` a newer version?
   */
  isNewer(other: string | ReleaseData): boolean;

  /**
   * Is this `ReleaseData` object a newer generation than some other version?
   * @param other - Some other version to compare against
   * @returns Is this `ReleaseData` a newer generation?
   */
  isGenerationalChange(other: string | ReleaseData): boolean;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<ReleaseData.Schema>;

  static override get schema(): fields.SchemaField<ReleaseData.Schema>;

  static override validateJoint(data: ReleaseData.Source): void;

  static override fromSource(source: ReleaseData.CreateData, context?: DataModel.FromSourceOptions): ReleaseData;

  static override fromJSON(json: string): ReleaseData;
}

export { ServerSettings, ReleaseData };

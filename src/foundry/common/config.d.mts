import type { DataModel } from "./abstract/data.mjs";
import type * as fields from "./data/fields.mjs";
import type { SOFTWARE_UPDATE_CHANNELS } from "./constants.d.mts";

declare namespace ApplicationConfiguration {
  interface Schema extends DataSchema {
    /**
     * The server administrator password (obscured)
     */
    adminPassword: fields.StringField<{
      required: true;
      blank: false;
      nullable: true;
      initial: null;
      label: "SETUP.AdminPasswordLabel";
      hint: "SETUP.AdminPasswordHint";
    }>;

    /**
     * The relative path (to Config) of an AWS configuration file
     */
    awsConfig: fields.StringField<{
      label: "SETUP.AWSLabel";
      hint: "SETUP.AWSHint";
      blank: false;
      nullable: true;
      initial: null;
    }>;

    /**
     * Whether to compress static files? True by default
     */
    compressStatic: fields.BooleanField<{
      initial: true;
      label: "SETUP.CompressStaticLabel";
      hint: "SETUP.CompressStaticHint";
    }>;

    compressSocket: fields.BooleanField<{
      initial: true;
      label: "SETUP.CompressSocketLabel";
      hint: "SETUP.CompressSocketHint";
    }>;

    cssTheme: fields.StringField<{
      blank: false;
      choices: typeof foundry.CONST.CSS_THEMES;
      initial: "foundry";
      label: "SETUP.CSSTheme";
      hint: "SETUP.CSSThemeHint";
    }>;

    /**
     * The absolute path of the user data directory (obscured)
     */
    dataPath: fields.StringField<{ label: "SETUP.DataPathLabel"; hint: "SETUP.DataPathHint" }>;

    deleteNEDB: fields.BooleanField<{ label: "SETUP.DeleteNEDBLabel"; hint: "SETUP.DeleteNEDBHint" }>;

    /**
     * Whether the application should automatically start in fullscreen mode?
     */
    fullscreen: fields.BooleanField<{ initial: false }>;

    /**
     * A custom hostname applied to internet invitation addresses and URLs
     */
    hostname: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    hotReload: fields.BooleanField<{ initial: false; label: "SETUP.HotReloadLabel"; hint: "SETUP.HotReloadHint" }>;

    /**
     * The default language for the application
     */
    language: fields.StringField<{
      required: true;
      blank: false;
      initial: "en.core";
      label: "SETUP.DefaultLanguageLabel";
      hint: "SETUP.DefaultLanguageHint";
    }>;

    /**
     * A custom hostname applied to local invitation addresses
     */
    localHostname: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /**
     * A custom salt used for hashing user passwords (obscured)
     */
    passwordSalt: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /**
     * The port on which the server is listening
     */
    port: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      initial: 30000;
      validate: typeof ApplicationConfiguration._validatePort;
      label: "SETUP.PortLabel";
      hint: "SETUP.PortHint";
    }>;

    /**
     * The Internet Protocol version to use, either 4 or 6.
     */
    protocol: fields.NumberField<{ integer: true; choices: [4, 6]; nullable: true }>;

    /**
     * An external-facing proxied port used for invitation addresses and URLs
     */
    proxyPort: fields.NumberField<{ required: true; nullable: true; integer: true; initial: null }>;

    /**
     * Is the application running in SSL mode at a reverse-proxy level?
     */
    proxySSL: fields.BooleanField<{ initial: false }>;

    /**
     * A URL path part which prefixes normal application routing
     */
    routePrefix: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /**
     * The relative path (to Config) of a used SSL certificate
     */
    sslCert: fields.StringField<{
      label: "SETUP.SSLCertLabel";
      hint: "SETUP.SSLCertHint";
      blank: false;
      nullable: true;
      initial: null;
    }>;

    /**
     * The relative path (to Config) of a used SSL key
     */
    sslKey: fields.StringField<{ label: "SETUP.SSLKeyLabel"; blank: false; nullable: true; initial: null }>;

    telemetry: fields.BooleanField<{
      required: false;
      initial: undefined;
      label: "SETUP.Telemetry";
      hint: "SETUP.TelemetryHint";
    }>;

    /**
     * The current application update channel
     */
    updateChannel: fields.StringField<{
      required: true;
      choices: typeof foundry.CONST.SOFTWARE_UPDATE_CHANNELS;
      initial: "stable";
    }>;

    /**
     * Is UPNP activated?
     */
    upnp: fields.BooleanField<{ initial: true }>;

    /**
     * The duration in seconds of a UPNP lease, if UPNP is active
     */
    upnpLeaseDuration: fields.NumberField;

    /**
     * A default world name which starts automatically on launch
     */
    world: fields.StringField<{
      required: true;
      blank: false;
      nullable: true;
      initial: null;
      label: "SETUP.WorldLabel";
      hint: "SETUP.WorldHint";
    }>;

    noBackups: fields.BooleanField<{ required: false }>;
  }
}

/**
 * A data model definition which describes the application configuration options.
 * These options are persisted in the user data Config folder in the options.json file.
 * The server-side software extends this class and provides additional validations and
 * @remarks yes the description really does cut off
 */
declare class ApplicationConfiguration extends DataModel<ApplicationConfiguration.Schema> {
  static defineSchema(): ApplicationConfiguration.Schema;

  static override migrateData(source: object): object;

  /**
   * Validate a port assignment.
   * @param port - The requested port
   * @throws An error if the requested port is invalid
   * @throws `The application port must be an integer, either 80, 443, or between 1024 and 65535`
   */
  static _validatePort(port: number): void;
}

declare namespace ReleaseData {
  interface Schema extends DataSchema {
    /**
     * The major generation of the Release
     */
    generation: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      min: 1;
    }>;

    /**
     * The maximum available generation of the software.
     */
    maxGeneration: fields.NumberField<{
      required: false;
      nullable: false;
      integer: true;
      min: 1;
      // initial: () => fields.SchemaField.InnerInitializedType<Schema["generation"]>;
    }>;

    /**
     * The maximum available stable generation of the software.
     */
    maxStableGeneration: fields.NumberField<{
      required: false;
      nullable: false;
      integer: true;
      min: 1;
      // initial: () => fields.SchemaField.InitializedType<Schema["generation"]>;
    }>;
    channel: fields.StringField<{ choices: typeof SOFTWARE_UPDATE_CHANNELS; blank: false }>;

    /**
     * An optional appended string display for the Release
     */
    suffix: fields.StringField;

    /**
     * The internal build number for the Release
     */
    build: fields.NumberField<{ required: true; nullable: false; integer: true }>;

    /**
     * When the Release was released
     */
    time: fields.NumberField<{ nullable: false; initial: typeof Date.now }>;

    /**
     * The minimum required Node.js major version
     */
    node_version: fields.NumberField<{ required: true; nullable: false; integer: true; min: 10 }>;

    /**
     * Release notes for the update version
     */
    notes: fields.StringField;

    /**
     * A temporary download URL where this version may be obtained
     */
    download: fields.StringField;
  }
}

/** A data object which represents the details of this Release of Foundry VTT */
declare class ReleaseData extends DataModel<ReleaseData.Schema> {
  static defineSchema(): ReleaseData.Schema;

  /** A formatted string for shortened display, such as "Version 9" */
  get shortDisplay(): string;

  /** A formatted string for general display, such as "V9 Prototype 1" or "Version 9" */
  get display(): string;

  /** A formatted string for Version compatibility checking, such as "9.150" */
  get version(): string;

  override toString(): this["shortDisplay"];

  /**
   * Is this ReleaseData object newer than some other version?
   * @param other - Some other version to compare against
   * @returns Is this ReleaseData a newer version?
   */
  isNewer(other: string | ReleaseData): boolean;

  /**
   * Is this ReleaseData object a newer generation than some other version?
   * @param other - Some other version to compare against
   * @returns Is this ReleaseData a newer generation?
   */
  isGenerationalChange(other: string | ReleaseData): boolean;
}

export { ApplicationConfiguration, ReleaseData };

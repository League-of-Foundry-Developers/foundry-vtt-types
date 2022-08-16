import { SOFTWARE_UPDATE_CHANNELS } from '../constants.mjs';
import type { DataModel, DataSchema } from '../abstract/data.mjs';
import * as fields from '../data/fields.mjs';

export type ValidatePort = (port: number) => void;

interface ApplicationConfigurationSchema extends DataSchema {
  /**
   * The server administrator password (obscured)
   */
  adminPassword: fields.StringField<{
    required: true;
    blank: false;
    nullable: true;
    initial: null;
    label: 'SETUP.AdminPasswordLabel';
    hint: 'SETUP.AdminPasswordHint';
  }>;

  /**
   * The relative path (to Config) of an AWS configuration file
   */
  awsConfig: fields.StringField<{ label: 'SETUP.AWSLabel'; hint: 'SETUP.AWSHint' }>;

  /**
   * Whether to compress static files? True by default
   */
  compressStatic: fields.BooleanField<{
    initial: true;
    label: 'SETUP.CompressStaticLabel';
    hint: 'SETUP.CompressStaticHint';
  }>;

  /**
   * The absolute path of the user data directory (obscured)
   */
  dataPath: fields.StringField<{ label: 'SETUP.DataPathLabel'; hint: 'SETUP.DataPathHint' }>;

  /**
   * Whether the application should automatically start in fullscreen mode?
   */
  fullscreen: fields.BooleanField<{ initial: false }>;

  /**
   * A custom hostname applied to internet invitation addresses and URLs
   */
  hostname: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

  /**
   * The default language for the application
   */
  language: fields.StringField<{
    required: true;
    blank: false;
    initial: 'en.core';
    label: 'SETUP.DefaultLanguageLabel';
    hint: 'SETUP.DefaultLanguageHint';
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
    validate: ValidatePort;
    label: 'SETUP.PortLabel';
    hint: 'SETUP.PortHint';
  }>;

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
  sslCert: fields.StringField<{ label: 'SETUP.SSLCertLabel'; hint: 'SETUP.SSLCertHint' }>;

  /**
   * The relative path (to Config) of a used SSL key
   */
  sslKey: fields.StringField<{ label: 'SETUP.SSLKeyLabel' }>;

  /**
   * The current application update channel
   */
  updateChannel: fields.StringField<{ required: true; choices: typeof SOFTWARE_UPDATE_CHANNELS; initial: 'stable' }>;

  /**
   * Is UPNP activated?
   */
  upnp: fields.BooleanField<{ initial: true }>;

  /**
   * The duration in seconds of a UPNP lease, if UPNP is active
   */
  upnpLeaseDuration: fields.NumberField<{}>;

  /**
   * A default world name which starts automatically on launch
   */
  world: fields.StringField<{
    required: true;
    blank: false;
    nullable: true;
    initial: null;
    label: 'SETUP.WorldLabel';
    hint: 'SETUP.WorldHint';
  }>;
}

/**
 * A data model definition which describes the application configuration options.
 * These options are persisted in the user data Config folder in the options.json file.
 * The server-side software extends this class and provides additional validations and
 */
declare class ApplicationConfiguration extends DataModel<null, ApplicationConfigurationSchema> {
  static override defineSchema(): ApplicationConfigurationSchema;

  /* ----------------------------------------- */

  /** @override */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ----------------------------------------- */

  /**
   * Validate a port assignment.
   * @param port - The requested port
   * @throws - An error if the requested port is invalid
   */
  private static _validatePort: ValidatePort;
}

export { ApplicationConfiguration };

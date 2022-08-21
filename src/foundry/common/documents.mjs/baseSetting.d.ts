import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";

type SettingMetadata = Merge<
  DocumentMetadata,
  {
    name: "Setting";
    collection: "settings";
    label: "DOCUMENT.Setting";
    labelPlural: "DOCUMENT.Settings";
    isPrimary: true;
    permissions: {
      create: "SETTINGS_MODIFY";
      update: "SETTINGS_MODIFY";
      delete: "SETTINGS_MODIFY";
    };
  }
>;

/**
 * The base Setting model definition which defines common behavior of an Setting document between both client and server.
 */
export declare class BaseSetting extends Document<data.SettingData, null, SettingMetadata> {
  static override get schema(): typeof data.SettingData;

  static override get metadata(): SettingMetadata;

  /**
   * A convenience reference to the key which identifies this game setting.
   */
  get key(): string;

  /**
   * The parsed value of the saved setting
   */
  get value(): unknown;
}

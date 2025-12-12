import type { fields } from "#client/data/_module.d.mts";

/**
 * A configuration class managing the Combat Turn Markers.
 * @remarks TODO: Stub
 */
declare class CombatConfiguration {
  constructor();

  static #private: true;
}

declare namespace CombatConfiguration {
  interface TurnMarkerSchema extends fields.DataSchema {
    enabled: fields.BooleanField<{ required: true; initial: true }>;
    animation: fields.StringField<{ initial: "spin" }>;
    src: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"]; blank: true; initial: "" }>;
    disposition: fields.BooleanField;
  }

  interface ConfigSettingSchema extends fields.DataSchema {
    resource: fields.StringField<{ required: true; blank: true; initial: "" }>;
    skipDefeated: fields.BooleanField<{ required: true; initial: false }>;
    turnMarker: fields.SchemaField<TurnMarkerSchema>;
  }

  interface SettingData extends fields.SchemaField.InitializedData<ConfigSettingSchema> {}

  /** Default combat tracker settings used in Foundry VTT. */
  interface Data {
    /**
     * A resource identifier for the tracker.
     */
    resource: string;

    /**
     * Whether to skip defeated tokens during combat.
     */
    skipDefeated: boolean;

    /**
     * Turn marker configuration.
     */
    turnMarker: TurnMarker;
  }

  interface TurnMarker {
    /**
     * Whether the turn marker is enabled.
     */
    enabled: boolean;

    /**
     * The file path for the turn marker icon.
     */
    path: string;

    /**
     * The identifier for the default turn marker animation.
     */
    animation: string;

    /**
     * Tint the turn marker according to token disposition.
     */
    disposition: string;
  }
}

export default CombatConfiguration;

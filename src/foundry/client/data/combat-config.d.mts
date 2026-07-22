import type { Identity } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type TurnMarkerData from "#client/canvas/placeables/tokens/turn-marker-data.d.mts";

/**
 * A configuration class managing the Combat Turn Markers.
 */
declare class CombatConfiguration {
  constructor();

  /**
   * The configuration setting used to record Combat preferences
   * @defaultValue `"combatTrackerConfig"`
   */
  static CONFIG_SETTING: "combatTrackerConfig";

  /**
   * The data model schema used to structure and validate the stored setting.
   */
  static get schema(): fields.SchemaField<CombatConfiguration.ConfigSettingSchema>;

  /**
   * Register the token ring config and initialize it
   * @remarks Calls the {@linkcode AllHooks.initializeCombatConfiguration | initializeCombatConfiguration} hook.
   */
  static initialize(): void;

  /**
   * Register game settings used by the Combat Tracker
   */
  static registerSettings(): void;

  /**
   * Get turn marker settings.
   */
  get turnMarker(): CombatConfiguration.TurnMarker;

  /**
   * Get tracked resource setting.
   */
  get resource(): string;

  /**
   * Get skip defeated setting.
   */
  get skipDefeated(): boolean;

  /**
   * Get current turn marker animation.
   * @remarks Can be `null` if {@linkcode CombatConfiguration.useTurnMarkerAnimation | #useTurnMarkerAnimation} was
   * last called with an unregistered animation id.
   */
  get currentTurnMarkerAnimation(): TurnMarkerData.AnimationData | null;

  /**
   * Add a new turn marker animation.
   * @param id     - The id of the turn marker animation.
   * @param config - The configuration object for the turn marker animation.
   */
  addTurnMarkerAnimation(id: string, config: TurnMarkerData.AnimationData): void;

  /**
   * Get a turn marker animation by id.
   * @param id - The id of the turn marker configuration.
   * @returns The turn marker configuration object.
   */
  getTurnMarkerAnimation(id: string): TurnMarkerData.AnimationData | undefined;

  /**
   * Use a turn marker animation.
   * @param animationId - The id of the turn marker animation to use.
   * @returns True if the animation was successfully set, false otherwise.
   */
  useTurnMarkerAnimation(animationId: string): boolean;

  /**
   * Get all animations and labels as an array of choices suitable for a select element.
   */
  get turnMarkerAnimations(): { value: string; label: string }[];

  #CombatConfiguration: true;
}

declare namespace CombatConfiguration {
  interface Any extends AnyCombatConfiguration {}
  interface AnyConstructor extends Identity<typeof AnyCombatConfiguration> {}

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

  /**
   * Default combat tracker settings used in Foundry VTT.
   * @remarks Foundry's own JSDoc `@typedef` for this (`CombatConfigurationData`) claims `turnMarker.path: string` and
   * `turnMarker.disposition: string`, but the actual registered schema (see {@linkcode TurnMarkerSchema}) has neither
   * a `path` field (it's {@linkcode TurnMarkerSchema.src | src}) nor a string `disposition` (it's a
   * {@linkcode foundry.data.fields.BooleanField | BooleanField}). This interface matches the schema.
   */
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
    src: string;

    /**
     * The identifier for the default turn marker animation.
     */
    animation: string;

    /**
     * Tint the turn marker according to token disposition.
     */
    disposition: boolean;
  }
}

declare abstract class AnyCombatConfiguration extends CombatConfiguration {
  constructor(...args: never);
}

export default CombatConfiguration;

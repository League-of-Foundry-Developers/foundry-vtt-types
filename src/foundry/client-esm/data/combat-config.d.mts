/**
 * A configuration class managing the Combat Turn Markers.
 */
declare class CombatConfiguration {
  constructor();

  static #private: true;
}

declare namespace CombatConfiguration {
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
    turnMarker: {
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
    };
  }
}

export default CombatConfiguration;

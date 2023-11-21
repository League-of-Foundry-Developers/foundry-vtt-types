export {};

// TODO: Define Color in common/utils/color.mjs
type Color = Number;
declare global {
  /**
   * A singleton class dedicated to manage the color spaces associated with the scene and the canvas.
   */
  class CanvasColorManager {
    /**
     * Colors exposed by the manager.
     */
    colors: {
      darkness?: Color;
      halfdark?: Color;
      /** @defaultValue `0x909090` */
      background?: Color;
      dim?: Color;
      bright?: Color;
      ambientBrightest?: Color;
      ambientDaylight?: Color;
      ambientDarkness?: Color;
      sceneBackground?: Color;
      /** @defaultValue `0x000000` */
      fogExplored?: Color;
      /** @defaultValue `0x000000` */
      fogUnexplored?: Color;
    };

    /**
     * Weights used by the manager to compute colors.
     */
    weights: {
      dark?: number;
      halfdark?: number;
      dim?: number;
      bright?: number;
    };

    /**
     * Fallback colors.
     */
    static #fallbackColors: {
      darknessColor: 0x242448;
      daylightColor: 0xeeeeee;
      brightestColor: 0xffffff;
      backgroundColor: 0x909090;
      fogUnexplored: 0x000000;
      fogExplored: 0x000000;
    };

    /* -------------------------------------------- */

    /**
     * Returns the darkness penalty for the actual scene configuration.
     */
    get darknessPenalty(): number;

    /* -------------------------------------------- */

    /**
     * Get the darkness level of this scene.
     */
    get darknessLevel(): number;

    /* -------------------------------------------- */

    /**
     * Initialize color space pertaining to a specific scene.
     * @param backgroundColor     - The background canvas color
     * @param brightestColor      - The brightest ambient color
     * @param darknessColor       - The color of darkness
     * @param darknessLevel       - A preview darkness level
     * @param daylightColor       - The ambient daylight color
     * @param fogExploredColor    - The color applied to explored areas
     * @param fogUnexploredColor  - The color applied to unexplored areas
     */
    initialize({
      backgroundColor,
      brightestColor,
      darknessColor,
      darknessLevel,
      daylightColor,
      fogExploredColor,
      fogUnexploredColor,
    }?: {
      backgroundColor: Color | number | string;
      brightestColor: Color | number | string;
      darknessColor: Color | number | string;
      darknessLevel: number;
      daylightColor: Color | number | string;
      fogExploredColor: number;
      fogUnexploredColor: number;
    }): void;
  }
}

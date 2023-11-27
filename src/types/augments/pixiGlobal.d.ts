import * as PIXI from "pixi.js";

/**
 * Added with the update of PIXI to 7.2.4
 * Necessary to maintain handling of PIXI in the global namespace
 */
export = PIXI;
export as namespace PIXI;

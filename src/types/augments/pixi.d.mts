export * from "pixi.js";
import * as pixiParticles from "@pixi/particle-emitter";
import * as graphicsSmooth from "@pixi/graphics-smooth";

/**
 * Foundry exports PIXI into the global namespace
 */
export as namespace PIXI;

declare global {
  namespace PIXI {
    export import smooth = graphicsSmooth;
    export import particles = pixiParticles;
  }
}

declare module "pixi.js" {
  export const LegacyGraphics: typeof PIXI.Graphics;
  export type LegacyGraphics = PIXI.Graphics;
  export interface Graphics extends PIXI.smooth.SmoothGraphics {}

  export enum UPDATE_PRIORITY {
    /**
     * @remarks Foundry defined custom ticker priority
     * Handled in Canvas##activateTicker
     */
    OBJECTS = 23,

    /**
     * @remarks Foundry defined custom ticker priority
     * Handled in Canvas##activateTicker
     */
    PERCEPTION = 2,
  }
}

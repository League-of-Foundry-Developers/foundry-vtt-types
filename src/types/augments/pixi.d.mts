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

    export const LegacyGraphics: typeof PIXI.Graphics;
    export type LegacyGraphics = PIXI.Graphics;
    export class Graphics extends PIXI.smooth.SmoothGraphics {}

    enum UPDATE_PRIORITY {
      /**
       * Highest priority used for interaction events in {@link PIXI.EventSystem}
       * @defaultValue 50
       */
      INTERACTION = 50,
      /**
       * High priority updating, used by {@link PIXI.AnimatedSprite}
       * @defaultValue 25
       */
      HIGH = 25,

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

      /**
       * defaultValue priority for ticker events, see {@link PIXI.Ticker#add}.
       * @defaultValue 0
       */
      NORMAL = 0,
      /**
       * Low priority used for {@link PIXI.Application} rendering.
       * @defaultValue -25
       */
      LOW = -25,
      /**
       * Lowest priority used for {@link PIXI.BasePrepare} utility.
       * @defaultValue -50
       */
      UTILITY = -50,
    }
  }
}

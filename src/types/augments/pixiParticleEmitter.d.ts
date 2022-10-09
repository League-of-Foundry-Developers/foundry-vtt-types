import * as pixiParticles from "@pixi/particle-emitter";

declare global {
  namespace PIXI {
    export import particles = pixiParticles; // eslint-disable-line @typescript-eslint/no-unused-vars
  }
}

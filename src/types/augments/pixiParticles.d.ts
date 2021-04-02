import * as pixiParticles from 'pixi-particles';

declare global {
  namespace PIXI {
    export import particles = pixiParticles; // eslint-disable-line @typescript-eslint/no-unused-vars
  }
}

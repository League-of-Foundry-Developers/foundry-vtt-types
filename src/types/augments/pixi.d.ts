import * as PIXI from 'pixi.js';

export = PIXI;
export as namespace PIXI;

declare global {
  namespace PIXI {
    namespace filters {
      type AlphaFilter = InstanceType<typeof PIXI.filters.AlphaFilter>;
      type BlurFilter = InstanceType<typeof PIXI.filters.BlurFilter>;
      type BlurFilterPass = InstanceType<typeof PIXI.filters.BlurFilterPass>;
      type ColorMatrixFilter = InstanceType<typeof PIXI.filters.ColorMatrixFilter>;
      type DisplacementFilter = InstanceType<typeof PIXI.filters.DisplacementFilter>;
      type FXAAFilter = InstanceType<typeof PIXI.filters.FXAAFilter>;
      type NoiseFilter = InstanceType<typeof PIXI.filters.NoiseFilter>;
    }
  }
}

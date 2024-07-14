import type BaseLightSource from "./base-light-source.d.mts";
import { type PointEffectSourceMixin_BaseEffectSource_Interface } from "./point-effect-source.mts";

declare const PointEffectSourceMixin_BaseEffectSource: PointEffectSourceMixin_BaseEffectSource_Interface;

/**
 * A specialized subclass of the BaseEffectSource which describes a movement-based source.
 */
export default class PointMovementSource<
  SourceData extends BaseLightSource.LightSourceData,
  SourceShape extends PIXI.Polygon,
> extends PointEffectSourceMixin_BaseEffectSource<SourceData, SourceShape> {
  /** @defaultValue `"move"` */
  static override sourceType: string;
}

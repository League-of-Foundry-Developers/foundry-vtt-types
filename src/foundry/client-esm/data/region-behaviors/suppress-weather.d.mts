import type RegionBehaviorType from "./base.d.mts";

declare namespace SuppressWeatherRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {}
}

/** The data model for a behavior that allows to suppress weather effects within the Region */
declare class SuppressWeatherRegionBehaviorType extends RegionBehaviorType<SuppressWeatherRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.suppressWeather", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  #suppressWeatherRegionBehaviorType: true;
}

export default SuppressWeatherRegionBehaviorType;

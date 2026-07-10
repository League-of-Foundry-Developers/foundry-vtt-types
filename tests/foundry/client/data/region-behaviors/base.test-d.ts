import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;
import fields = foundry.data.fields;

interface Schema extends fields.DataSchema {
  count: fields.NumberField;
}

export class RegionBehaviorSubType extends RegionBehaviorType<Schema> {}

declare global {
  interface DataModelConfig {
    RegionBehavior: {
      subType: typeof RegionBehaviorSubType;
    };
  }
}

CONFIG.RegionBehavior.dataModels.subType = RegionBehaviorSubType;

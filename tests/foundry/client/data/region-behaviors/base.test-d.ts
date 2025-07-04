import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;
import fields = foundry.data.fields;

interface Schema extends fields.DataSchema {
  count: fields.NumberField;
}

class RegionBehaviorSubType extends RegionBehaviorType<Schema> {}

CONFIG.RegionBehavior.dataModels["subType"] = RegionBehaviorSubType;

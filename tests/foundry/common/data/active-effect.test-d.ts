import { expectTypeOf } from "vitest";
import ActiveEffectTypeDataModel = foundry.data.ActiveEffectTypeDataModel;

declare const model: ActiveEffectTypeDataModel;

expectTypeOf(ActiveEffectTypeDataModel.defineSchema()).toEqualTypeOf<ActiveEffectTypeDataModel.Schema>();

expectTypeOf(model.changes).toEqualTypeOf<
  foundry.data.fields.SchemaField.InitializedData<ActiveEffectTypeDataModel.ChangeSchema>[]
>();

const change = model.changes[0]!;
expectTypeOf(change.key).toBeString();
expectTypeOf(change.type).toBeString();
expectTypeOf(change.value).toEqualTypeOf<unknown>();
expectTypeOf(change.phase).toBeString();
expectTypeOf(change.priority).toEqualTypeOf<number | null | undefined>();

// Foundry registers this model for the `base` subtype, so `system.changes` is available without any
// `DataModelConfig` declaration merging on the consumer's part.
declare const baseEffect: ActiveEffect.OfType<"base">;
expectTypeOf(baseEffect.system).toEqualTypeOf<ActiveEffectTypeDataModel>();
expectTypeOf(baseEffect.system.changes).toEqualTypeOf<typeof model.changes>();

// ...and it is what `CONFIG.ActiveEffect.dataModels.base` is typed as.
expectTypeOf(CONFIG.ActiveEffect.dataModels.base).toEqualTypeOf<typeof ActiveEffectTypeDataModel>();

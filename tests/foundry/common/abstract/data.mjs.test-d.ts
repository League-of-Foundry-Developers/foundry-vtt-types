import { expectTypeOf } from "vitest";
import type {
  EffectChangeData,
  EffectChangeDataProperties,
} from "../../../../src/foundry/common/data/data.mjs/effectChangeData.mts";

// @ts-expect-error - ActorData requires data.
new foundry.data.ActorData();

// @ts-expect-error - ActorData requires a `name` and `type`.
new foundry.data.ActorData({});

const activeEffectData = new foundry.data.ActiveEffectData();
expectTypeOf(activeEffectData.toJSON().changes).toEqualTypeOf<EffectChangeDataProperties[]>();
expectTypeOf(activeEffectData.toObject().changes).toEqualTypeOf<EffectChangeDataProperties[]>();
expectTypeOf(activeEffectData.toObject(true).changes).toEqualTypeOf<EffectChangeDataProperties[]>();
expectTypeOf(activeEffectData.toObject(false).changes).toEqualTypeOf<EffectChangeData[]>();

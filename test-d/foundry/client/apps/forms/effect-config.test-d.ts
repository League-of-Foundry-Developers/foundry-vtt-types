import type { ActiveEffectData } from '../../../../../src/foundry/common/data/data.mjs';

import { expectError, expectType } from 'tsd';

expectError<ActiveEffectConfig>(new ActiveEffectConfig());
expectError<ActiveEffectConfig>(new ActiveEffectConfig(undefined, { width: 100 }));
expectError(new ActiveEffectConfig(new foundry.documents.BaseActiveEffect()));

const config = new ActiveEffectConfig(new ActiveEffect());
expectType<ActiveEffect>(config.object);
expectType<foundry.data.ActiveEffectData>((await config.getData()).effect);
expectType<foundry.data.ActiveEffectData>((await config.getData()).data);
expectType<boolean>((await config.getData()).isActorEffect);
expectType<boolean>((await config.getData()).isItemEffect);
expectType<string>((await config.getData()).submitText);
expectType<Record<number, string>>((await config.getData()).modes);
expectType<DocumentSheetOptions>(config.options);

const withCustomOptions = new ActiveEffectConfig<DocumentSheetOptions & { custom: true }>(new ActiveEffect());
expectType<DocumentSheetOptions & { custom: true }>(withCustomOptions.options);

const withCustomData = new ActiveEffectConfig<DocumentSheetOptions, { object: ActiveEffectData }>(new ActiveEffect());
expectType<Promise<{ object: ActiveEffectData }> | { object: ActiveEffectData }>(withCustomData.getData());

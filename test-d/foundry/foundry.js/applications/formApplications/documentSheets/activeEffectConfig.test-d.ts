import { expectError, expectType } from 'tsd';
import { ActiveEffectData } from '../../../../../../src/foundry/common/data/data.mjs';

expectType<ActiveEffectConfig>(new ActiveEffectConfig(new ActiveEffect()));
expectType<ActiveEffectConfig>(new ActiveEffectConfig());
expectType<ActiveEffectConfig>(new ActiveEffectConfig(undefined, { width: 100 }));
expectError(new ActiveEffectConfig(new foundry.documents.BaseActiveEffect()));

const config = new ActiveEffectConfig();
expectType<ActiveEffect>(config.object);
expectType<foundry.data.ActiveEffectData>((await config.getData()).effect);
expectType<foundry.data.ActiveEffectData>((await config.getData()).data);
expectType<boolean>((await config.getData()).isActorEffect);
expectType<boolean>((await config.getData()).isItemEffect);
expectType<string>((await config.getData()).submitText);
expectType<Record<'CUSTOM' | 'MULTIPLY' | 'ADD' | 'DOWNGRADE' | 'UPGRADE' | 'OVERRIDE', string>>(
  (await config.getData()).modes
);
expectType<DocumentSheet.Options>(config.options);

const withCustomOptions = new ActiveEffectConfig<DocumentSheet.Options & { custom: true }>(new ActiveEffect());
expectType<DocumentSheet.Options & { custom: true }>(withCustomOptions.options);

const withCustomData = new ActiveEffectConfig<DocumentSheet.Options, { object: ActiveEffectData }>();
expectType<Promise<{ object: ActiveEffectData }> | { object: ActiveEffectData }>(withCustomData.getData());

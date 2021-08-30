import { expectError, expectType } from 'tsd';

const eff = new ActiveEffect({});

expectType<string | undefined>(eff.getFlag('core', 'statusId'));
expectType<boolean | undefined>(eff.getFlag('core', 'overlay'));
expectError(eff.setFlag('core', 'statusId', 0));
expectError(eff.setFlag('core', 'overlay', 0));

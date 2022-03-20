import { expectType } from 'tsd';

expectType<Promise<Response>>(foundry.utils.fetchWithTimeout('/'));
expectType<Promise<unknown>>(foundry.utils.fetchJsonWithTimeout('/'));

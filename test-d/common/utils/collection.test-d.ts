import { expectType } from 'tsd';
import '../../../index';

const c = new Collection<string>();

expectType<string | undefined>(c.get(''));
expectType<string | undefined>(c.get('', { strict: false }));
expectType<string>(c.get('', { strict: true }));

expectType<string | undefined>(c.getName(''));
expectType<string | undefined>(c.getName('', { strict: false }));
expectType<string>(c.getName('', { strict: true }));

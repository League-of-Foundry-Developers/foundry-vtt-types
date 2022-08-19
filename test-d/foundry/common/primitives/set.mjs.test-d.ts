import { expectType } from 'tsd';
import '../../index';

expectType<Set<string>>(new Set<number | string>().filter((value): value is string => typeof value === 'string'));
expectType<Set<'a'>>(new Set<'a' | 'b'>().filter((value): value is 'a' => value === 'a'));

expectType<number | undefined>(new Set<number>().find((value) => value > 5));
expectType<number | undefined>(new Set<number | string>().find((value): value is number => typeof value === 'number'));
expectType<'a' | undefined>(new Set<'a' | 'b'>().find((value): value is 'a' => value === 'a'));

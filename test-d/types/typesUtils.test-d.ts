import '../../types/typesUtils';
import { expectType } from 'tsd';

const membersBecomeOptional: DeepPartial<{ a: string }> = {};
expectType<{ a?: string }>(membersBecomeOptional);

const nestedMembersBecomeOptional: DeepPartial<{ a: { b: string } }> = { a: {} };
expectType<{ a?: { b?: string } }>(nestedMembersBecomeOptional);

const expanded_1: Expanded<{ foo: string }> = { foo: '' };
expectType<{ foo: string }>(expanded_1);
const expanded_2: Expanded<{ 'foo.bar': string }> = { foo: { bar: '' } };
expectType<{ foo: { bar: string } }>(expanded_2);
const expanded_3: Expanded<{ 'foo.bar': string[] }> = { foo: { bar: [''] } };
expectType<{ foo: { bar: string[] } }>(expanded_3);
const expanded_4: Expanded<{ foo: { 'bar.baz': string } }> = { foo: { bar: { baz: '' } } };
expectType<{ foo: { bar: { baz: string } } }>(expanded_4);

import { expectType } from 'tsd';
import '../../index';

const membersBecomeOptional: DeepPartial<{ a: string }> = {};
expectType<{ a?: string }>(membersBecomeOptional);

const nestedMembersBecomeOptional: DeepPartial<{ a: { b: string } }> = { a: {} };
expectType<{ a?: { b?: string } }>(nestedMembersBecomeOptional);

const expanded1: Expanded<{ foo: string }> = { foo: '' };
expectType<{ foo: string }>(expanded1);
const expanded2: Expanded<{ 'foo.bar': string }> = { foo: { bar: '' } };
expectType<{ foo: { bar: string } }>(expanded2);
const expanded3: Expanded<{ 'foo.bar': string[] }> = { foo: { bar: [''] } };
expectType<{ foo: { bar: string[] } }>(expanded3);
const expanded4: Expanded<{ foo: { 'bar.baz': string } }> = { foo: { bar: { baz: '' } } };
expectType<{ foo: { bar: { baz: string } } }>(expanded4);
const expanded5: Expanded<{ 'foo.bar': string; 'baz.qux': string }> = { foo: { bar: '' }, baz: { qux: '' } };
expectType<{ foo: { bar: string }; baz: { qux: string } }>(expanded5);
const expanded6: Expanded<{ 'foo.bar': string; baz: { qux: string } }> = { foo: { bar: '' }, baz: { qux: '' } };
expectType<{ foo: { bar: string }; baz: { qux: string } }>(expanded6);
const expanded7: Expanded<{ 'foo.bar': string | number }> = { foo: { bar: 0 } };
expectType<{ foo: { bar: string | number } }>(expanded7);
const expanded8: Expanded<{ foo: { bar: string } | { baz: number } }> = { foo: { bar: '' } };
expectType<{ foo: { bar: string } | { baz: number } }>(expanded8);
const expanded9: Expanded<{ 'foo.bar'?: string }> = {};
expectType<{ foo?: { bar: string | undefined } | undefined }>(expanded9);

declare const titlecaseEmpty: Titlecase<''>;
expectType<''>(titlecaseEmpty);
declare const titlecaseBlank: Titlecase<' '>;
expectType<' '>(titlecaseBlank);
declare const titlecaseNumber: Titlecase<'42'>;
expectType<'42'>(titlecaseNumber);
declare const titlecaseFromLower: Titlecase<'foobar'>;
expectType<'Foobar'>(titlecaseFromLower);
declare const titlecaseFromUpper: Titlecase<'FOOBAR'>;
expectType<'Foobar'>(titlecaseFromUpper);
declare const titlecaseWithSpace: Titlecase<'foo bar'>;
expectType<'Foo Bar'>(titlecaseWithSpace);
declare const titlecaseWithSpaces: Titlecase<'foo  bar'>;
expectType<'Foo  Bar'>(titlecaseWithSpaces);
declare const titlecaseWithThreeWords: Titlecase<'foo bar baz'>;
expectType<'Foo Bar Baz'>(titlecaseWithThreeWords);

type NumberPromise = Promise<number>;
const promisedTypeOfNumProm: PromisedType<NumberPromise> = 0;
expectType<number>(promisedTypeOfNumProm);

const promisedTypeOfNumber: PromisedType<number> = 0;
expectType<number>(promisedTypeOfNumber);

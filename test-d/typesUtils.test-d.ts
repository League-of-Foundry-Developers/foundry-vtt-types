import '../types/typesUtils';
import { expectType } from 'tsd';

const membersBecomeOptional: DeepPartial<{ a: string }> = {};
expectType<{ a?: string }>(membersBecomeOptional);

const nestedMembersBecomeOptional: DeepPartial<{ a: { b: string } }> = { a: {} };
expectType<{ a?: { b?: string } }>(nestedMembersBecomeOptional);

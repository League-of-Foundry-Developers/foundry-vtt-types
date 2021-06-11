import { expectAssignable, expectType } from 'tsd';
import { ConfiguredDocumentClass } from '../../../../src/types/helperTypes';

const user = new User({ name: 'Test' });

expectType<boolean>(user.active);
expectAssignable<Set<Token>>(user.targets);
expectType<string | null>(user.id);
expectType<string | null>(user.viewedScene);
expectType<string>(user.avatar);
expectType<ConfiguredDocumentClass<typeof Actor> | undefined>(user.character);
expectAssignable<Record<string, boolean>>(user.permissions);

expectType<string | null>(user.data._id);
expectType<string | null>(user.data.character);
expectType<string | undefined>(user.data.avatar);

// TODO: Modify to ConfiguredDocumentSheet<typeof User> | null once data can be grabbed from CONFIG
expectType<FormApplication | null>(user.sheet);

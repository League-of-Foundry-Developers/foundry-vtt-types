import type { ConfiguredDocumentClass } from "../../../../../src/types/helperTypes";

import { expectAssignable, expectType } from "tsd";

const user = new User({ name: "Test" });

expectType<boolean>(user.active);
expectType<UserTargets>(user.targets);
expectType<string | null>(user.id);
expectType<string | null>(user.viewedScene);
expectType<string>(user.avatar);
expectType<StoredDocument<InstanceType<ConfiguredDocumentClass<typeof Actor>>> | undefined>(user.character);
expectType<StoredDocument<Actor> | undefined>(user.character);
expectAssignable<Partial<Record<string, boolean>>>(user.permissions);
expectType<Array<Macro | null>>(user.getHotbarMacros().map((each) => each.macro));
expectType<Array<InstanceType<ConfiguredDocumentClass<typeof Macro>> | null>>(
  user.getHotbarMacros().map((each) => each.macro),
);

user.assignHotbarMacro(new Macro(), 1);

expectType<string | null>(user.data._id);
expectType<string | null>(user.data.character);
expectType<string | null | undefined>(user.data.avatar);

// TODO: Modify to ConfiguredDocumentSheet<typeof User> | null once data can be grabbed from CONFIG
expectType<FormApplication | null>(user.sheet);

expectType<string | undefined>(user.charname);
expectType<string | undefined>(user.color);
expectType<string | undefined>(user.border);

import { expectTypeOf } from "vitest";

class TestBaseToken extends foundry.documents.BaseToken {}

new TestBaseToken();

const myToken = new TestBaseToken({ name: "foo" });

expectTypeOf(myToken.bar1.attribute).toEqualTypeOf<string | null>();
expectTypeOf(myToken.parent!.active).toEqualTypeOf<boolean>();

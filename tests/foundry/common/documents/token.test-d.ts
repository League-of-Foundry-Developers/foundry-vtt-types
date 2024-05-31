import { expectTypeOf } from "vitest";

new foundry.documents.BaseToken();

const myToken = new foundry.documents.BaseToken({ name: "foo" });

expectTypeOf(myToken.bar1.attribute).toEqualTypeOf<string | null>();
expectTypeOf(myToken.parent!.active).toEqualTypeOf<boolean>();

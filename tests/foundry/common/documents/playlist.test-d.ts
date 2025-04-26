import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBasePlaylist extends foundry.documents.BasePlaylist {}

// @ts-expect-error name is a required field
new TestBasePlaylist();

// @ts-expect-error name is a required field
new TestBasePlaylist({});

const myPlaylist = new TestBasePlaylist({ name: "foo" });

expectTypeOf(myPlaylist.description).toEqualTypeOf<string | undefined>();

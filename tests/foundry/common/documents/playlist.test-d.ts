import { expectTypeOf } from "vitest";

// @ts-expect-error name is a required field
new foundry.documents.BasePlaylist();
// @ts-expect-error name is a required field
new foundry.documents.BasePlaylist({});

const myPlaylist = new foundry.documents.BasePlaylist({ name: "foo" });

expectTypeOf(myPlaylist.description).toEqualTypeOf<string | undefined>();

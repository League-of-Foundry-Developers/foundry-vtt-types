import { expectTypeOf } from "vitest";

// @ts-expect-error name is a required field
new foundry.documents.BasePlaylistSound();
// @ts-expect-error name is a required field
new foundry.documents.BasePlaylistSound({});

const myPlaylistSound = new foundry.documents.BasePlaylistSound({ name: "foo" });

expectTypeOf(myPlaylistSound.description).toEqualTypeOf<string | undefined>();

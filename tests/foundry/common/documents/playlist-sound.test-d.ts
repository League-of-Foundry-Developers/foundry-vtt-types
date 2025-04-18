import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBasePlaylistSound extends foundry.documents.BasePlaylistSound {}

// @ts-expect-error name is a required field
new TestBasePlaylistSound();

// @ts-expect-error name is a required field
new TestBasePlaylistSound({});

const myPlaylistSound = new TestBasePlaylistSound({ name: "foo" });

expectTypeOf(myPlaylistSound.description).toEqualTypeOf<string | undefined>();

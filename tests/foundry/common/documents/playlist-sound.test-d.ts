import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBasePlaylistSound extends foundry.documents.BasePlaylistSound {
  get compendium() {
    return this.inCompendium
      ? (game.packs!.get(this.pack!) as foundry.documents.collections.CompendiumCollection.ForDocument<"PlaylistSound">)
      : null;
  }
}

// @ts-expect-error name is a required field
new TestBasePlaylistSound();

// @ts-expect-error name is a required field
new TestBasePlaylistSound({});

const myPlaylistSound = new TestBasePlaylistSound({ name: "foo" });

expectTypeOf(myPlaylistSound.description).toEqualTypeOf<string | undefined>();

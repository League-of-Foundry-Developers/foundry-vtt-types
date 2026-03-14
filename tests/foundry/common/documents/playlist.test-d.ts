import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBasePlaylist extends foundry.documents.BasePlaylist {
  get compendium(): foundry.documents.collections.CompendiumCollection.ForDocument<"Playlist"> | null {
    const pack = this.inCompendium ? (game.packs!.get(this.pack ?? "") ?? null) : null;
    if (!pack) return null;
    return pack as foundry.documents.collections.CompendiumCollection.ForDocument<"Playlist">;
  }
}

// @ts-expect-error name is a required field
new TestBasePlaylist();

// @ts-expect-error name is a required field
new TestBasePlaylist({});

const myPlaylist = new TestBasePlaylist({ name: "foo" });

expectTypeOf(myPlaylist.description).toEqualTypeOf<string | undefined>();

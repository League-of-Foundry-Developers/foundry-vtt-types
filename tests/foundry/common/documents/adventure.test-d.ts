import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseAdventure extends foundry.documents.BaseAdventure {
  get compendium(): foundry.documents.collections.CompendiumCollection.ForDocument<"Adventure"> | null {
    const pack = this.inCompendium ? (game.packs!.get(this.pack ?? "") ?? null) : null;
    if (!pack) return null;
    return pack as foundry.documents.collections.CompendiumCollection.ForDocument<"Adventure">;
  }
}

// @ts-expect-error name is a required field
new TestBaseAdventure();

// @ts-expect-error name is a required field
new TestBaseAdventure({});

const myAdventure = new TestBaseAdventure({ name: "foo" });

expectTypeOf(myAdventure.img).toEqualTypeOf<string | null>();
expectTypeOf(myAdventure.macros.first()!.command).toEqualTypeOf<string>();

// Static Methods

expectTypeOf(TestBaseAdventure.contentFields.actors).toEqualTypeOf<Actor.ImplementationClass>();

import { expectTypeOf } from "vitest";

// @ts-expect-error name is a required field
new foundry.documents.BaseAdventure();
// @ts-expect-error name is a required field
new foundry.documents.BaseAdventure({});

const myAdventure = new foundry.documents.BaseAdventure({ name: "foo" });

expectTypeOf(myAdventure.img).toEqualTypeOf<string | null>();
expectTypeOf(myAdventure.macros.first()!.command).toEqualTypeOf<string>();

// Static Methods

expectTypeOf(foundry.documents.BaseAdventure.contentFields.actors).toEqualTypeOf<Actor>();

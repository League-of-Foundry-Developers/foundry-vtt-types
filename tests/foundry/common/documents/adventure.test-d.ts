import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseAdventure extends foundry.documents.BaseAdventure {}

// @ts-expect-error name is a required field
new TestBaseAdventure();

// @ts-expect-error name is a required field
new TestBaseAdventure({});

const myAdventure = new TestBaseAdventure({ name: "foo" });

expectTypeOf(myAdventure.img).toEqualTypeOf<string | null>();
expectTypeOf(myAdventure.macros.first()!.command).toEqualTypeOf<string>();

// Static Methods

expectTypeOf(TestBaseAdventure.contentFields.actors).toEqualTypeOf<Actor.ImplementationClass>();

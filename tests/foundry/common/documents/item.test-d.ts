import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";

// @ts-expect-error Item requires a name and type
new foundry.documents.BaseItem();

// @ts-expect-error Item requires a name and type
new foundry.documents.BaseItem({});

const baseItem = new foundry.documents.BaseItem({ name: "foo", type: "base" });
expectTypeOf(baseItem.effects).toEqualTypeOf<
  EmbeddedCollection<ActiveEffect.ConfiguredInstance, Item.ConfiguredInstance>
>();
expectTypeOf(baseItem._source.effects[0]!.duration.seconds).toEqualTypeOf<number | null | undefined>();

declare global {}

// Flags for Actor, Item, Card, and Cards documents can be configured via the FlagConfig. This is tested here.
// For configuring flags for actors and items via SourceConfig please have a look into baseActor.test-d.ts.
declare global {
  interface FlagConfig {
    Item: {
      "my-system": {
        countable: boolean;
      };
    };
  }
}
expectTypeOf(baseItem.flags["my-system"]).toEqualTypeOf<{ countable: boolean }>();

expectTypeOf(baseItem.getFlag("my-system", "countable")).toEqualTypeOf<boolean>();
expectTypeOf(baseItem.getFlag("my-system", "unknown-key")).toEqualTypeOf<never>();
expectTypeOf(baseItem.getFlag("another-system", "value")).toEqualTypeOf<unknown>();
// returns `this`
expectTypeOf(baseItem.setFlag("my-system", "countable", true)).toEqualTypeOf<Promise<foundry.documents.BaseItem>>();

// @ts-expect-error - my-system.countable is a boolean not a number.
baseItem.setFlag("my-system", "countable", 2);

// @ts-expect-error - my-system.unknown-key does not exist.
baseItem.setFlag("my-system", "unknown-key", 2);

// returns `this`
expectTypeOf(baseItem.setFlag("another-system", "value", true)).toEqualTypeOf<Promise<foundry.documents.BaseItem>>();

import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";
import EmbeddedCollection = foundry.abstract.EmbeddedCollection;
import BaseItem = foundry.documents.BaseItem;
import Document = foundry.abstract.Document;

// @ts-expect-error Base Documents should never be directly created so they are marked as abstract in fvtt-types
new foundry.documents.BaseItem({ name: "foo", type: "base" });

declare const baseItem: foundry.documents.BaseItem;

expectTypeOf(baseItem.effects).toEqualTypeOf<EmbeddedCollection<ActiveEffect.Implementation, Item.Implementation>>();
expectTypeOf(baseItem._source.effects[0]!.duration.seconds).toEqualTypeOf<number | null | undefined>();
expectTypeOf(baseItem.type).toEqualTypeOf<"base" | "armor" | "weapon" | Document.ModuleSubtype>();

type ItemFlags = {
  "my-system": {
    countable: boolean;
    optionalKey?: string;
  };

  "another-system": AnyObject;

  "yet-another-system": {
    randomKey: string;
  };
};

// Flags for Actor, Item, Card, and Cards documents can be configured via the FlagConfig. This is tested here.
// For configuring flags for actors and items via SourceConfig please have a look into baseActor.test-d.ts.
declare global {
  interface FlagConfig {
    Item: ItemFlags;
  }
}

expectTypeOf(baseItem.flags).toEqualTypeOf<ItemFlags>();

expectTypeOf(baseItem.getFlag).parameter(0).toEqualTypeOf<"my-system" | "another-system" | "yet-another-system">();

// There are no keys that are defined in all scopes.
expectTypeOf(baseItem.getFlag).parameter(1).toEqualTypeOf<never>();

expectTypeOf(baseItem.getFlag("my-system", "countable")).toEqualTypeOf<boolean>();
expectTypeOf(baseItem.getFlag("my-system", "optionalKey")).toEqualTypeOf<string | undefined>();

// @ts-expect-error - "invalid-key" is not a valid key in the flags.
baseItem.getFlag("my-system", "invalid-key");

expectTypeOf(baseItem.getFlag("another-system", "value")).toEqualTypeOf<unknown>();

// @ts-expect-error - "invalid-system" is not a valid system in the flags.
expectTypeOf(baseItem.getFlag("invalid-system", "value")).toEqualTypeOf<never>();

// returns `this`
expectTypeOf(baseItem.setFlag("my-system", "countable", true)).toEqualTypeOf<Promise<foundry.documents.BaseItem>>();

// @ts-expect-error - my-system.countable is a boolean not a number.
baseItem.setFlag("my-system", "countable", 2);

// @ts-expect-error - my-system.unknown-key does not exist.
baseItem.setFlag("my-system", "unknown-key", 2);

// returns `this`
expectTypeOf(baseItem.setFlag("my-system", "countable", true)).toEqualTypeOf<Promise<foundry.documents.BaseItem>>();

// This test is necessary because seemingly more DRY ways of writing `getFlag` or `setFlag` will fail to typecheck.
// For example `ConcreteMetadata["name"]` is written a lot instead of `this` because `this` is inherently "generic-like" in its safety requirements.
// By comparison since the generic parameter for `ConcreteMetadata` is passed a constant value it will allow treating it as a constant.
class _TestFlags extends Item {
  testFlags() {
    expectTypeOf(this.getFlag("my-system", "countable")).toEqualTypeOf<boolean>();
    expectTypeOf(this.setFlag("my-system", "countable", false)).toEqualTypeOf<Promise<this>>();
  }
}

class _TestFlagsFail<Type extends Document.Type> extends Document<Type, BaseItem.Schema, any> {
  testFlagsFail() {
    // @ts-expect-error - Because `Type` is passed in a generic fashion suddenly the safety of generic parameters kick in and make this unusable.
    this.getFlag("my-system", "countable");

    // @ts-expect-error - Because `Type` is passed in a generic fashion suddenly the safety of generic parameters kick in and make this unusable.
    this.setFlag("my-system", "countable", true);
  }
}

import { describe, expectTypeOf, test } from "vitest";
import type { AnyObject } from "fvtt-types/utils";
import * as activeEffectHelpers from "./active-effect.test-d.ts";

type DataSchema = foundry.data.fields.DataSchema;

declare namespace ArmorData {
  interface Schema extends DataSchema {
    defense: foundry.data.fields.NumberField<{ required: false; nullable: false }>;
  }
}

declare namespace WeaponData {
  interface Schema extends DataSchema {
    attack: foundry.data.fields.NumberField<{ required: true; nullable: false }>;
  }
}

export class ArmorData extends foundry.abstract.TypeDataModel<ArmorData.Schema, Item.Implementation> {}

export class WeaponData extends foundry.abstract.TypeDataModel<WeaponData.Schema, Item.Implementation> {}

test("optional subtype", () => {
  delete game.model?.Item.weapon;
});

// export class TestConfiguredItem<SubType extends Item.SubType = Item.SubType> extends Item<SubType> {
//   newMethodOnTestClass(): void {
//     console.warn("boop");
//   }
// }

declare global {
  // interface DocumentClassConfig {
  //   Item: typeof TestConfiguredItem;
  // }

  interface DataModelConfig {
    Item: {
      armor: typeof ArmorData;
      weapon?: typeof WeaponData;
    };
  }
}

export const source = {
  _id: "XXXXXItemIDXXXXX",
  type: "armor",
  name: "Stuff",
  img: "icons/svg/item-bag.svg",
  system: { defense: 2 },
  effects: [],
  folder: null,
  flags: {},
  _stats: {
    compendiumSource: null,
    duplicateSource: null,
    exportSource: {
      worldId: "uts1",
      uuid: "Item.AT1aBkg7uvGAKjLY",
      coreVersion: "13.351",
      systemId: "universal-tabletop-system",
      systemVersion: "1.1.2",
    },
    coreVersion: "13.348",
    systemId: "universal-tabletop-system",
    systemVersion: "1.1.2",
    createdTime: 1763000814765,
    modifiedTime: 1763000814765,
    lastModifiedBy: "qBvUsXk4totXg4Hs",
  },
  ownership: {
    default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
  },
  sort: 0,
} as const satisfies Item.Source;

export const sourceWithEmbedded = {
  _id: "XXXXXItemIDXXXXX",
  type: "armor", // using one of our test subtypes because a blank system is disallowed, so using `base` is out
  name: "Stuff",
  img: "icons/svg/item-bag.svg",
  system: { defense: 2 },
  effects: [activeEffectHelpers.source],
  folder: null,
  flags: {},
  _stats: {
    compendiumSource: null,
    duplicateSource: null,
    exportSource: {
      worldId: "uts1",
      uuid: "Item.AT1aBkg7uvGAKjLY",
      coreVersion: "13.351",
      systemId: "universal-tabletop-system",
      systemVersion: "1.1.2",
    },
    coreVersion: "13.348",
    systemId: "universal-tabletop-system",
    systemVersion: "1.1.2",
    createdTime: 1763000814765,
    modifiedTime: 1763000814765,
    lastModifiedBy: "qBvUsXk4totXg4Hs",
  },
  ownership: {
    default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
  },
  sort: 0,
} as const satisfies Item.Source;

export const minimalCreateData = {
  name: "FVTT-Types Test Item",
  type: "base",
} satisfies Item.CreateData;

const actor = game.actors!.contents[0]!;
const actorItem = actor.items.contents[0]!;

expectTypeOf(actorItem.configured).toBeBoolean();

describe("Item Tests", () => {});

// @ts-expect-error Item requires name and type.
new Item.implementation();

// @ts-expect-error Item requires name and type.
await Item.create();

// @ts-expect-error Item requires name and type.
new Item.implementation({});

// @ts-expect-error Item requires name and type.
await Item.create({});

const item = new Item.implementation({ name: "Mighty Axe of Killing", type: "weapon" });
await Item.create({ name: "Mighty Axe of Killing", type: "weapon" });

expectTypeOf(item.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(item.img).toEqualTypeOf<string | null>();
expectTypeOf(item.isOwned).toEqualTypeOf<boolean>();
expectTypeOf(item.transferredEffects).toEqualTypeOf<ActiveEffect.Implementation[]>();
expectTypeOf(item.type).toEqualTypeOf<"weapon">();
expectTypeOf(item.getRollData()).toEqualTypeOf<AnyObject>();

declare const known: Item.Known;
if (known.type === "weapon") {
  expectTypeOf(known.system.attack).toEqualTypeOf<number>();

  // Ideally this property wouldn't exist at all but due to how narrowing works this doesn't seem possible.
  expectTypeOf(known.system.defense).toEqualTypeOf<undefined>();
}

expectTypeOf(known.system.defense).toEqualTypeOf<number | undefined>();

// Reported by @n3dst4 on Discord, see https://discord.com/channels/732325252788387980/803646399014109205/1372236409402032231
test("update regression test", () => {
  // Note that this call is unsound as it assumes that it's using the correct subtype.
  //
  // Eventually this _should_ break and require `item` to have been narrowed to `"weapon"` but for
  // now it doesn't matter.
  item.update({
    system: {
      attack: 12,
    },
  });
});

// Configured Item Usage
declare global {
  namespace Item {
    namespace Database {
      interface CreateOperation {
        foo?: string;
      }
      interface UpdateOperation {
        bar?: number;
      }
      interface DeleteOperation {
        foobar?: boolean;
      }
    }
  }
}
Item.get(foundry.utils.randomID(), {});
Item.createDocuments([{ name: "Foo", type: "base" }], { foo: "fizz buzz" });
Item.createDocuments([{ _id: foundry.utils.randomID(), name: "Foo", type: "base" }], { foo: "fizz buzz" });
Item.deleteDocuments([foundry.utils.randomID()], { foobar: false });

class BoilerplateItem extends Item {
  protected static override async _onUpdateOperation(
    documents: Item.Stored[],
    operation: Item.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void> {
    if (operation.bar) {
      console.log(documents[0]!.id, operation.diff, user.id);
    }
  }
}

declare const configuredItem: BoilerplateItem;
expectTypeOf(configuredItem.actor).toEqualTypeOf<Actor.Implementation | null>();

import { expectTypeOf, test } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

type DataSchema = foundry.data.fields.DataSchema;

declare namespace ArmorData {
  interface Schema extends DataSchema {
    defense: foundry.data.fields.NumberField<{ required: true; nullable: false }>;
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

declare global {
  interface DataModelConfig {
    Item: {
      armor: typeof ArmorData;
      weapon?: typeof WeaponData;
    };
  }
}

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
      interface Create {
        foo?: string;
      }
      interface Update {
        bar?: number;
      }
      interface Delete {
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
    documents: Item.Implementation[],
    operation: Item.Database.Update,
    user: User.Implementation,
  ): Promise<void> {
    if (operation.bar) {
      console.log(documents[0]!.id, operation.diff, user.id);
    }
  }
}

declare const configuredItem: BoilerplateItem;
expectTypeOf(configuredItem.actor).toEqualTypeOf<Actor.Implementation | null>();

import { expectTypeOf } from "vitest";

type DataSchema = foundry.data.fields.DataSchema;

declare namespace ArmorData {
  interface Schema extends DataSchema {
    defense: foundry.data.fields.NumberField;
  }
}

declare namespace WeaponData {
  interface Schema extends DataSchema {
    attack: foundry.data.fields.NumberField;
  }
}

export class ArmorData extends foundry.abstract.TypeDataModel<ArmorData.Schema, Item> {}

export class WeaponData extends foundry.abstract.TypeDataModel<WeaponData.Schema, Item> {}

declare global {
  interface DataModelConfig {
    Item: {
      armor: typeof ArmorData;
      weapon: typeof WeaponData;
    };
  }
}

// @ts-expect-error - Item requires name and type.
new Item();

// @ts-expect-error - Item requires name and type.
new Item({});

const item = new Item({ name: "Mighty Axe of Killing", type: "weapon" });

expectTypeOf(item.actor).toEqualTypeOf<Actor | null>();
expectTypeOf(item.img).toEqualTypeOf<string | null | undefined>();
expectTypeOf(item.isOwned).toEqualTypeOf<boolean>();
expectTypeOf(item.transferredEffects).toEqualTypeOf<ActiveEffect[]>();
expectTypeOf(item.type).toEqualTypeOf<"weapon" | "armor" | "base" | `${string}.${string}`>();
expectTypeOf(item.getRollData()).toEqualTypeOf<Record<string, unknown>>();

// Configured Item Usage
declare global {
  namespace Item {
    namespace DatabaseOperation {
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
Item.get(foundry.utils.randomID(), {})
Item.createDocuments([{name: "Foo", type: "base"}], {foo: "fizz buzz"})
Item.createDocuments([{_id: foundry.utils.randomID(), name: "Foo", type: "base"}], {foo: "fizz buzz"})
Item.deleteDocuments([foundry.utils.randomID()], {foobar: false})

class BoilerplateItem extends Item {
  protected static override async _onUpdateOperation(documents: Item.Implementation[], operation: Item.DatabaseOperation.Update, user: User.Implementation): Promise<void> {
    if (operation.bar) {
      console.log(documents[0].id, operation.diff, user.id);
    }
  }
}

declare const configuredItem: BoilerplateItem
expectTypeOf(configuredItem.actor).toEqualTypeOf<Actor.ConfiguredInstance | null>();

import { expectError, expectType } from "tsd";

import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.mjs";
import type { BaseActor, BaseItem } from "../../../../src/foundry/common/documents/module.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CharacterModel
  extends foundry.data.fields.SchemaField.InnerInitializedType<ReturnType<typeof CharacterModel["defineSchema"]>> {}
class CharacterModel extends foundry.abstract.DataModel<
  foundry.data.fields.SchemaField<ReturnType<typeof CharacterModel["defineSchema"]>>
> {
  static override defineSchema() {
    return {
      /** The current hit points of the character */
      hitPoints: new foundry.data.fields.NumberField()
    };
  }

  /** Get the maximum amount of hit points for the character */
  get maxHitPoints(): number {
    return 24;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MonsterModel
  extends foundry.data.fields.SchemaField.InnerInitializedType<ReturnType<typeof MonsterModel["defineSchema"]>> {}
class MonsterModel extends foundry.abstract.DataModel<
  foundry.data.fields.SchemaField<ReturnType<typeof MonsterModel["defineSchema"]>>
> {
  static override defineSchema() {
    return {
      /** The attack damage of the monster */
      damage: new foundry.data.fields.NumberField({ nullable: false, required: true })
    };
  }

  /** The threat of the monster */
  get threat(): number {
    return 400;
  }
}

declare global {
  interface SystemConfig {
    Actor: {
      character: CharacterModel;
      monster: MonsterModel;
    };
  }
}

expectType<foundry.documents.BaseActor<"character">>(
  new foundry.documents.BaseActor({ name: "Joe Diamond", type: "character" })
);
expectType<foundry.documents.BaseActor<"monster">>(
  new foundry.documents.BaseActor({ name: "Cthulhu", type: "monster" })
);
expectError(new foundry.documents.BaseActor({ name: "Kittyfluff", type: "foo" }));

const characterModel = new CharacterModel();
const monsterModel = new MonsterModel();

expectType<foundry.documents.BaseActor<"character">>(
  new foundry.documents.BaseActor({ name: "Joe Diamond", type: "character", system: { hitPoints: 30 } })
);
expectType<foundry.documents.BaseActor<"character">>(
  new foundry.documents.BaseActor({ name: "Joe Diamond", type: "character", system: characterModel })
);
expectType<foundry.documents.BaseActor<"monster">>(
  new foundry.documents.BaseActor({ name: "Cthulhu", type: "monster", system: { damage: 60 } })
);
expectType<foundry.documents.BaseActor<"monster">>(
  new foundry.documents.BaseActor({ name: "Cthulhu", type: "monster", system: monsterModel })
);
expectError(new foundry.documents.BaseActor({ name: "Cthulhu", type: "monster", system: { threat: 300 } }));
expectError(new foundry.documents.BaseActor({ name: "Cthulhu", type: "monster", system: { foo: "bar" } }));

const characterActor = new foundry.documents.BaseActor({ name: "Joe Diamond", type: "character" });
const monsterActor = new foundry.documents.BaseActor({ name: "Cthulhu", type: "monster" });

expectType<Promise<foundry.documents.BaseActor<"character"> | undefined>>(
  characterActor.update({ system: { hitPoints: 42 } })
);
expectType<Promise<foundry.documents.BaseActor<"character"> | undefined>>(
  characterActor.update({ system: characterModel })
);
expectType<Promise<foundry.documents.BaseActor<"monster"> | undefined>>(
  monsterActor.update({ system: { damage: 200 } })
);
expectType<Promise<foundry.documents.BaseActor<"monster"> | undefined>>(monsterActor.update({ system: monsterModel }));
expectError(monsterActor.update({ system: { foo: "bar" } }));

expectType<object>(characterActor.updateSource({ system: { hitPoints: 50 } }));
expectType<object>(characterActor.updateSource({ system: characterModel }));
expectType<object>(monsterActor.updateSource({ system: { damage: 400 } }));
expectType<object>(monsterActor.updateSource({ system: monsterModel }));
expectError(monsterActor.updateSource({ system: { foo: "bar" } }));

expectType<EmbeddedCollection<typeof ActiveEffect, foundry.documents.BaseActor>>(monsterActor.effects);
expectType<ActiveEffectData>(monsterActor._source.effects[0]);
expectType<EffectDurationData>(monsterActor._source.effects[0].duration);
expectType<BaseItem | undefined>(monsterActor.items.get("", { strict: true }));

expectType<"character">(characterActor.type);
expectType<CharacterModel>(characterActor.system);
expectType<number | null | undefined>(characterActor._source.system.hitPoints);
expectType<number | null | undefined>(characterActor.system._source.hitPoints);
expectError(characterActor._source.system.maxHitPoints);
expectType<number | null | undefined>(characterActor.system.hitPoints);
expectType<number>(characterActor.system.maxHitPoints);

expectType<"monster">(monsterActor.type);
expectType<MonsterModel>(monsterActor.system);
expectType<number>(monsterActor._source.system.damage);
expectType<number>(monsterActor.system._source.damage);
expectError(monsterActor._source.system.threat);
expectType<number>(monsterActor.system.damage);
expectType<number>(monsterActor.system.threat);

declare const unknownActor: foundry.documents.BaseActor;
expectType<"character" | "monster">(unknownActor.type);
expectType<CharacterModel | MonsterModel>(unknownActor.system);

// Flags for Actor, Item, Card, and Cards documents can be configured via the FlagConfig. This is tested here.
declare global {
  interface FlagConfig {
    Actor: {
      "my-system": {
        sanity: number;
      };
    };
  }
}
expectType<{ sanity: number }>(characterActor.flags["my-system"]);

expectType<number>(characterActor.getFlag("my-system", "sanity"));
expectType<never>(characterActor.getFlag("my-system", "unknown-key"));
expectType<unknown>(characterActor.getFlag("another-system", "value"));

expectType<Promise<BaseActor>>(monsterActor.setFlag("my-system", "sanity", 6000));
expectError(monsterActor.setFlag("my-system", "sanity", true));
expectError(monsterActor.setFlag("my-system", "unknown-key", 2));
expectType<Promise<BaseActor>>(monsterActor.setFlag("another-system", "value", true));

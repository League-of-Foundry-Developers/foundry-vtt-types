import { expectTypeOf } from "vitest";
import type { ArmorData, WeaponData } from "./item.test-d";

const actor = new Actor({ name: "Beren", type: "npc" });

expectTypeOf(actor.token).toEqualTypeOf<TokenDocument | null>();
expectTypeOf(actor.getActiveTokens(true, true)).toEqualTypeOf<TokenDocument[]>();
expectTypeOf(actor.getActiveTokens(true, false)).toEqualTypeOf<Token[]>();

expectTypeOf(actor.itemTypes.weapon[0]!.type).toEqualTypeOf<"weapon">();
expectTypeOf(actor.itemTypes.weapon[0]!.system).toEqualTypeOf<WeaponData>();
expectTypeOf(actor.itemTypes.armor[0]!.type).toEqualTypeOf<"armor">();
expectTypeOf(actor.itemTypes.armor[0]!.system).toEqualTypeOf<ArmorData>();
for (const effect of actor.allApplicableEffects()) {
  expectTypeOf(effect).toEqualTypeOf<ActiveEffect>();
}

// expectTypeOf(actor.getActiveTokens()).toEqualTypeOf<Token[]>();
// expectTypeOf(actor.getActiveTokens(false, false)).toEqualTypeOf<Token[]>();
// expectTypeOf(actor.getActiveTokens(false, true)).toEqualTypeOf<TokenDocument[]>();
// expectTypeOf(actor.getActiveTokens(false, document)).toEqualTypeOf<Token[] | TokenDocument[]>();

// assertType<foundry.data.ItemData>(actor.itemTypes["armor"][0].data);

// interface CharacterActor {
//   data: foundry.data.ActorData & { type: "character"; _source: { type: "character" } };
// }
// class CharacterActor extends Actor {
//   someCustomFunction() {
//     expectTypeOf(this.data.type).toEqualTypeOf<"character">();
//     expectTypeOf(this.data.data.movement).toEqualTypeOf<number>();
//     expectTypeOf(this.data._source.type).toEqualTypeOf<"character">();
//     expectTypeOf(this.data._source.data.health).toEqualTypeOf<number>();
//   }
// }

// declare const character: CharacterActor;

// expectTypeOf(character.data.type).toEqualTypeOf<"character">();
// expectTypeOf(character.data.data.movement).toEqualTypeOf<number>();
// expectTypeOf(character.data._source.type).toEqualTypeOf<"character">();
// expectTypeOf(character.data._source.data.health).toEqualTypeOf<number>();

// expectTypeOf(character.toObject().type).toEqualTypeOf<"character">();
// expectTypeOf(character.toObject().data.health).toEqualTypeOf<number>();

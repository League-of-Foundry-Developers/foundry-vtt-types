import { expectError, expectType } from "tsd";
import type { BaseCards } from "../../../../src/foundry/common/documents/module.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GermanDeckModel
  extends foundry.data.fields.SchemaField.InnerInitializedType<ReturnType<(typeof GermanDeckModel)["defineSchema"]>> {}
class GermanDeckModel extends foundry.abstract.DataModel<
  foundry.data.fields.SchemaField<ReturnType<(typeof GermanDeckModel)["defineSchema"]>>
> {
  static override defineSchema() {
    return {
      /** The game these cards are most often used in */
      mostUsedGame: new foundry.data.fields.StringField(),
    };
  }

  /** The kind of players these cards are most often used by */
  get mostUsedBy(): string {
    return "older players";
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FrenchDeckModel
  extends foundry.data.fields.SchemaField.InnerInitializedType<ReturnType<(typeof FrenchDeckModel)["defineSchema"]>> {}
class FrenchDeckModel extends foundry.abstract.DataModel<
  foundry.data.fields.SchemaField<ReturnType<(typeof FrenchDeckModel)["defineSchema"]>>
> {
  static override defineSchema() {
    return {
      /** A cool use for this kind of cards */
      coolUse: new foundry.data.fields.StringField(),
    };
  }

  /** Possible injuries sustained when using these cards */
  get possibleInjuries(): string {
    return "card stuck in eye";
  }
}

declare global {
  interface SystemConfig {
    Cards: {
      german: GermanDeckModel;
      french: FrenchDeckModel;
    };
  }
}

expectType<foundry.documents.BaseCards<"german">>(
  new foundry.documents.BaseCards({ name: "Schellen 4", type: "german" }),
);
expectType<foundry.documents.BaseCards<"french">>(
  new foundry.documents.BaseCards({ name: "King of Hearts", type: "french" }),
);
expectError(new foundry.documents.BaseCards({ name: "Kittyfluff", type: "foo" }));

const oldCardModel = new GermanDeckModel();
const unoCardModel = new FrenchDeckModel();

expectType<foundry.documents.BaseCards<"german">>(
  new foundry.documents.BaseCards({ name: "Schellen 4", type: "german", system: { mostUsedGame: "Skat" } }),
);
expectType<foundry.documents.BaseCards<"german">>(
  new foundry.documents.BaseCards({ name: "Schellen 4", type: "german", system: oldCardModel }),
);
expectType<foundry.documents.BaseCards<"french">>(
  new foundry.documents.BaseCards({ name: "King of Hearts", type: "french", system: { coolUse: "throwing cards" } }),
);
expectType<foundry.documents.BaseCards<"french">>(
  new foundry.documents.BaseCards({ name: "King of Hearts", type: "french", system: unoCardModel }),
);
expectError(
  new foundry.documents.BaseCards({ name: "King of Hearts", type: "french", system: { mostUsedBy: "older players" } }),
);
expectError(new foundry.documents.BaseCards({ name: "King of Hearts", type: "french", system: { foo: "bar" } }));

const german = new foundry.documents.BaseCards({ name: "Schellen 4", type: "german" });
const french = new foundry.documents.BaseCards({ name: "King of Hearts", type: "french" });

expectType<Promise<foundry.documents.BaseCards<"german"> | undefined>>(
  german.update({ system: { mostUsedGame: "Skat" } }),
);
expectType<Promise<foundry.documents.BaseCards<"german"> | undefined>>(german.update({ system: oldCardModel }));
expectType<Promise<foundry.documents.BaseCards<"french"> | undefined>>(
  french.update({ system: { coolUse: "throwing cards" } }),
);
expectType<Promise<foundry.documents.BaseCards<"french"> | undefined>>(french.update({ system: unoCardModel }));
expectError(french.update({ system: { foo: "bar" } }));

expectType<object>(german.updateSource({ system: { mostUsedGame: "Skat" } }));
expectType<object>(german.updateSource({ system: oldCardModel }));
expectType<object>(french.updateSource({ system: { coolUse: "throwing cards" } }));
expectType<object>(french.updateSource({ system: unoCardModel }));
expectError(french.updateSource({ system: { foo: "bar" } }));

expectType<"german">(german.type);
expectType<GermanDeckModel>(german.system);
expectType<string | undefined>(german._source.system.mostUsedGame);
expectType<string | undefined>(german.system._source.mostUsedGame);
expectError(german._source.system.mostUsedBy);
expectType<string | undefined>(german.system.mostUsedGame);
expectType<string | undefined>(german.system.mostUsedBy);

expectType<"french">(french.type);
expectType<FrenchDeckModel>(french.system);
expectType<string | undefined>(french._source.system.coolUse);
expectType<string | undefined>(french.system._source.coolUse);
expectError(french._source.system.possibleInjuries);
expectType<string | undefined>(french.system.coolUse);
expectType<string | undefined>(french.system.possibleInjuries);

declare const unknownActor: foundry.documents.BaseCards;
expectType<"german" | "french">(unknownActor.type);
expectType<GermanDeckModel | FrenchDeckModel>(unknownActor.system);

// Flags for Actor, Item, Card, and Cards documents can be configured via the FlagConfig. This is tested here.
declare global {
  interface FlagConfig {
    Cards: {
      "my-system": {
        vintage: boolean;
      };
    };
  }
}
expectType<{ vintage: boolean }>(german.flags["my-system"]);

expectType<boolean>(german.getFlag("my-system", "vintage"));
expectType<never>(german.getFlag("my-system", "unknown-key"));
expectType<unknown>(german.getFlag("another-system", "value"));

expectType<Promise<BaseCards>>(french.setFlag("my-system", "vintage", true));
expectError(french.setFlag("my-system", "vintage", 300));
expectError(french.setFlag("my-system", "unknown-key", 2));
expectType<Promise<BaseCards>>(french.setFlag("another-system", "value", true));

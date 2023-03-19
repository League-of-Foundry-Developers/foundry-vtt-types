import { expectError, expectType } from "tsd";
import type { BaseCard } from "../../../../src/foundry/common/documents/module.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface OldCardModel
  extends foundry.data.fields.SchemaField.InnerInitializedType<ReturnType<typeof OldCardModel["defineSchema"]>> {}
class OldCardModel extends foundry.abstract.DataModel<
  foundry.data.fields.SchemaField<ReturnType<typeof OldCardModel["defineSchema"]>>
> {
  static override defineSchema() {
    return {
      /** The condition of the card */
      condition: new foundry.data.fields.StringField()
    };
  }

  /** Whether the card is marked */
  get marked(): boolean {
    return true; // YOU CHEATER!
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UnoCardModel
  extends foundry.data.fields.SchemaField.InnerInitializedType<ReturnType<typeof UnoCardModel["defineSchema"]>> {}
class UnoCardModel extends foundry.abstract.DataModel<
  foundry.data.fields.SchemaField<ReturnType<typeof UnoCardModel["defineSchema"]>>
> {
  static override defineSchema() {
    return {
      /** Whether the card is special */
      special: new foundry.data.fields.BooleanField()
    };
  }

  /** Whether the card is numbered */
  get numbered(): boolean {
    return !this.special;
  }
}

declare global {
  interface SystemConfig {
    Card: {
      oldCard: OldCardModel;
      unoCard: UnoCardModel;
    };
  }
}

expectType<foundry.documents.BaseCard<"oldCard">>(
  new foundry.documents.BaseCard({ name: "Six of Spades", type: "oldCard" })
);
expectType<foundry.documents.BaseCard<"unoCard">>(
  new foundry.documents.BaseCard({ name: "Green Skip", type: "unoCard" })
);
expectError(new foundry.documents.BaseCard({ name: "Kittyfluff", type: "foo" }));

const oldCardModel = new OldCardModel();
const unoCardModel = new UnoCardModel();

expectType<foundry.documents.BaseCard<"oldCard">>(
  new foundry.documents.BaseCard({ name: "Six of Spades", type: "oldCard", system: { condition: "grubby" } })
);
expectType<foundry.documents.BaseCard<"oldCard">>(
  new foundry.documents.BaseCard({ name: "Six of Spades", type: "oldCard", system: oldCardModel })
);
expectType<foundry.documents.BaseCard<"unoCard">>(
  new foundry.documents.BaseCard({ name: "Green Skip", type: "unoCard", system: { special: true } })
);
expectType<foundry.documents.BaseCard<"unoCard">>(
  new foundry.documents.BaseCard({ name: "Green Skip", type: "unoCard", system: unoCardModel })
);
expectError(new foundry.documents.BaseCard({ name: "Green Skip", type: "unoCard", system: { numbered: false } }));
expectError(new foundry.documents.BaseCard({ name: "Green Skip", type: "unoCard", system: { foo: "bar" } }));

const oldCard = new foundry.documents.BaseCard({ name: "Six of Spades", type: "oldCard" });
const unoCard = new foundry.documents.BaseCard({ name: "Green Skip", type: "unoCard" });

expectType<Promise<foundry.documents.BaseCard<"oldCard"> | undefined>>(
  oldCard.update({ system: { condition: "pristine" } })
);
expectType<Promise<foundry.documents.BaseCard<"oldCard"> | undefined>>(oldCard.update({ system: oldCardModel }));
expectType<Promise<foundry.documents.BaseCard<"unoCard"> | undefined>>(unoCard.update({ system: { special: false } }));
expectType<Promise<foundry.documents.BaseCard<"unoCard"> | undefined>>(unoCard.update({ system: unoCardModel }));
expectError(unoCard.update({ system: { foo: "bar" } }));

expectType<object>(oldCard.updateSource({ system: { condition: "eeewwwww" } }));
expectType<object>(oldCard.updateSource({ system: oldCardModel }));
expectType<object>(unoCard.updateSource({ system: { special: true } }));
expectType<object>(unoCard.updateSource({ system: unoCardModel }));
expectError(unoCard.updateSource({ system: { foo: "bar" } }));

expectType<"oldCard">(oldCard.type);
expectType<OldCardModel>(oldCard.system);
expectType<string | undefined>(oldCard._source.system.condition);
expectType<string | undefined>(oldCard.system._source.condition);
expectError(oldCard._source.system.marked);
expectType<string | undefined>(oldCard.system.condition);
expectType<boolean>(oldCard.system.marked);

expectType<"unoCard">(unoCard.type);
expectType<UnoCardModel>(unoCard.system);
expectType<boolean>(unoCard._source.system.special);
expectType<boolean>(unoCard.system._source.special);
expectError(unoCard._source.system.numbered);
expectType<boolean>(unoCard.system.special);
expectType<boolean>(unoCard.system.numbered);

declare const unknownActor: foundry.documents.BaseCard;
expectType<"oldCard" | "unoCard">(unknownActor.type);
expectType<OldCardModel | UnoCardModel>(unknownActor.system);

// Flags for Actor, Item, Card, and Cards documents can be configured via the FlagConfig. This is tested here.
declare global {
  interface FlagConfig {
    Card: {
      "my-system": {
        holo: boolean;
      };
    };
  }
}
expectType<{ holo: boolean }>(oldCard.flags["my-system"]);

expectType<boolean>(oldCard.getFlag("my-system", "holo"));
expectType<never>(oldCard.getFlag("my-system", "unknown-key"));
expectType<unknown>(oldCard.getFlag("another-system", "value"));

expectType<Promise<BaseCard>>(unoCard.setFlag("my-system", "holo", true));
expectError(unoCard.setFlag("my-system", "holo", 300));
expectError(unoCard.setFlag("my-system", "unknown-key", 2));
expectType<Promise<BaseCard>>(unoCard.setFlag("another-system", "value", true));

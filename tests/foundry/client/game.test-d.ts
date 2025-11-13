import { expectTypeOf, assertType, describe, test } from "vitest";
import type { EmptyObject } from "fvtt-types/utils";

import docCollections = foundry.documents.collections;
import ClientSettings = foundry.helpers.ClientSettings;
import Document = foundry.abstract.Document;
import Localization = foundry.helpers.Localization;
import Module = foundry.packages.Module;

declare const aGame: Game;

expectTypeOf(aGame.combats).toEqualTypeOf<docCollections.CombatEncounters | undefined>();
expectTypeOf(aGame.i18n).toEqualTypeOf<Localization | undefined>();
expectTypeOf(aGame.settings).toEqualTypeOf<ClientSettings>();

declare global {
  interface ModuleConfig {
    "optional-api-module": {
      api: {
        testApi: (value: string) => boolean;
      };
    };
    "api-module-with-optional-props": {
      always: string;
      maybe?: number;
    };
    "required-api-module": {
      hooks: {
        triggerDialog: (value: number) => void;
      };
    };
  }
  interface RequiredModules {
    "required-module": true;
    "required-api-module": true;
  }
}

assertType<Module | undefined>(aGame.modules.get("optional-module"));
assertType<Module>(aGame.modules.get("optional-module", { strict: true }));

expectTypeOf(aGame.modules.get("required-module")).toEqualTypeOf<{ active: true } & Module>();

const optionalApiModule = aGame.modules.get("optional-api-module");
if (optionalApiModule) {
  expectTypeOf(optionalApiModule.api).toEqualTypeOf<ModuleConfig["optional-api-module"]["api"] | undefined>();
  if (optionalApiModule.active) {
    expectTypeOf(optionalApiModule.active).toEqualTypeOf<true>();
    expectTypeOf(optionalApiModule.api.testApi).toEqualTypeOf<(value: string) => boolean>();
  } else {
    expectTypeOf(optionalApiModule.active).toEqualTypeOf<false>();
    expectTypeOf(optionalApiModule.api).toEqualTypeOf<undefined>();
  }
}

const moduleOptionalProps = aGame.modules.get("api-module-with-optional-props");
if (moduleOptionalProps) {
  expectTypeOf(moduleOptionalProps.always).toEqualTypeOf<undefined | string>();
  expectTypeOf(moduleOptionalProps.maybe).toEqualTypeOf<undefined | number>();
  if (moduleOptionalProps.active) {
    expectTypeOf(moduleOptionalProps.always).toEqualTypeOf<string>();
    expectTypeOf(moduleOptionalProps.maybe).toEqualTypeOf<undefined | number>();
    // @ts-expect-error number would the entirely wrong type.
    expectTypeOf(moduleOptionalProps.maybe).toEqualTypeOf<number>();
  }
}
const requiredApiModule = aGame.modules.get("required-api-module");

expectTypeOf(requiredApiModule).toEqualTypeOf<{ active: true } & Module & ModuleConfig["required-api-module"]>();
expectTypeOf(requiredApiModule.hooks.triggerDialog(5)).toEqualTypeOf<void>();

declare global {
  interface Game {
    declarationMergingWorks: number;
  }

  interface ReadyGame {
    onlyInReady: string;
  }
}

expectTypeOf(game.declarationMergingWorks).toEqualTypeOf<number | undefined>();

if (game instanceof Game) {
  expectTypeOf(game.declarationMergingWorks).toEqualTypeOf<number>();

  // @ts-expect-error game is not guaranteed to be ready yet.
  // Arguably it shouldn't be a hard error, just undefined.
  game.onlyInReady;
}

if (game.ready) {
  expectTypeOf(game.declarationMergingWorks).toEqualTypeOf<number>();
  expectTypeOf(game.onlyInReady).toEqualTypeOf<string>();
}

// Game model
expectTypeOf<Item.SubType>().toEqualTypeOf<"weapon" | "armor" | "base" | Document.ModuleSubType>();
expectTypeOf<Document.ImplementationClassFor<"Item">>().toEqualTypeOf<Item.ImplementationClass>();
expectTypeOf(game.documentTypes!.Item).toEqualTypeOf<Array<"weapon" | "armor" | "base" | Document.ModuleSubType>>();

if (game instanceof Game) {
  const tokenModel = game.model.Token;
  expectTypeOf(tokenModel.base).toEqualTypeOf<EmptyObject>();

  const itemModel = game.model.Item;
  expectTypeOf(itemModel.base).toEqualTypeOf<EmptyObject>();

  // The `weapon` subtype is optional.
  expectTypeOf(itemModel.weapon).toEqualTypeOf<EmptyObject | undefined>();

  const journalEntryPageModel = game.model.JournalEntryPage;
  // @ts-expect-error base is not a valid subtype for JournalEntryPage
  journalEntryPageModel.base;
  expectTypeOf(journalEntryPageModel.text).toEqualTypeOf<EmptyObject>();
}

expectTypeOf(game.scenes!.folders).toEqualTypeOf<Collection<Folder.Stored<"Scene">>>();

describe("Game Tests", () => {
  test("game.collections - World Collections", () => {
    /** See {@linkcode CONST.WORLD_DOCUMENT_TYPES} */
    if (game.collections) {
      expectTypeOf(game.collections.get("Actor")).toEqualTypeOf<docCollections.Actors.Implementation>();
      expectTypeOf(game.collections.get("Cards")).toEqualTypeOf<docCollections.CardStacks.Implementation>();
      expectTypeOf(game.collections.get("ChatMessage")).toEqualTypeOf<docCollections.ChatMessages.Implementation>();
      expectTypeOf(game.collections.get("Combat")).toEqualTypeOf<docCollections.CombatEncounters.Implementation>();
      expectTypeOf(
        game.collections.get("FogExploration"),
      ).toEqualTypeOf<docCollections.FogExplorations.Implementation>();
      expectTypeOf(game.collections.get("Item")).toEqualTypeOf<docCollections.Items.Implementation>();
      expectTypeOf(game.collections.get("JournalEntry")).toEqualTypeOf<docCollections.Journal.Implementation>();
      expectTypeOf(game.collections.get("Macro")).toEqualTypeOf<docCollections.Macros.Implementation>();
      expectTypeOf(game.collections.get("Playlist")).toEqualTypeOf<docCollections.Playlists.Implementation>();
      expectTypeOf(game.collections.get("RollTable")).toEqualTypeOf<docCollections.RollTables.Implementation>();
      expectTypeOf(game.collections.get("Scene")).toEqualTypeOf<docCollections.Scenes.Implementation>();
      expectTypeOf(game.collections.get("Setting")).toEqualTypeOf<docCollections.WorldSettings.Implementation>();
      expectTypeOf(game.collections.get("User")).toEqualTypeOf<docCollections.Users.Implementation>();
      // Known means known; no `undefined` even with strict explicitly false
      expectTypeOf(
        game.collections.get("User", { strict: false }),
      ).toEqualTypeOf<docCollections.Users.Implementation>();

      expectTypeOf(game.collections.get("UnknownKey")).toEqualTypeOf<
        foundry.documents.abstract.WorldCollection.Any | undefined
      >();
      expectTypeOf(
        game.collections.get("UnknownKey", { strict: true }),
      ).toEqualTypeOf<foundry.documents.abstract.WorldCollection.Any>();
    }
  });
});

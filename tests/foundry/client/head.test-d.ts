import { expectTypeOf } from "vitest";

import MainMenu = foundry.applications.ui.MainMenu;
import uiapps = foundry.applications.ui;
import tabs = foundry.applications.sidebar.tabs;
import Sidebar = foundry.applications.sidebar.Sidebar;

type UninitializedGame = { [K in keyof Game]?: never };

declare global {
  namespace CONFIG {
    interface UI {
      menu: typeof MainMenu<MainMenu.RenderContext>;
    }
  }
}

expectTypeOf(game).toEqualTypeOf<UninitializedGame | I18nInitGame | InitGame | SetupGame | ReadyGame>();
expectTypeOf(ui.menu).toEqualTypeOf<uiapps.MainMenu | undefined>();
expectTypeOf(ui.sidebar).toEqualTypeOf<Sidebar | undefined>();
expectTypeOf(ui.pause).toEqualTypeOf<uiapps.GamePause | undefined>();
expectTypeOf(ui.nav).toEqualTypeOf<uiapps.SceneNavigation | undefined>();
expectTypeOf(ui.notifications).toEqualTypeOf<uiapps.Notifications | undefined>();
expectTypeOf(ui.actors).toEqualTypeOf<tabs.ActorDirectory | undefined>();
expectTypeOf(ui.cards).toEqualTypeOf<tabs.CardsDirectory | undefined>();
expectTypeOf(ui.chat).toEqualTypeOf<tabs.ChatLog | undefined>();
expectTypeOf(ui.combat).toEqualTypeOf<tabs.CombatTracker | undefined>();
expectTypeOf(ui.compendium).toEqualTypeOf<tabs.CompendiumDirectory | undefined>();
expectTypeOf(ui.controls).toEqualTypeOf<uiapps.SceneControls | undefined>();
expectTypeOf(ui.hotbar).toEqualTypeOf<uiapps.Hotbar | undefined>();
expectTypeOf(ui.items).toEqualTypeOf<tabs.ItemDirectory | undefined>();
expectTypeOf(ui.journal).toEqualTypeOf<tabs.JournalDirectory | undefined>();
expectTypeOf(ui.macros).toEqualTypeOf<tabs.MacroDirectory | undefined>();
expectTypeOf(ui.players).toEqualTypeOf<uiapps.Players | undefined>();
expectTypeOf(ui.playlists).toEqualTypeOf<tabs.PlaylistDirectory | undefined>();
expectTypeOf(ui.scenes).toEqualTypeOf<tabs.SceneDirectory | undefined>();
expectTypeOf(ui.settings).toEqualTypeOf<tabs.Settings | undefined>();
expectTypeOf(ui.tables).toEqualTypeOf<tabs.RollTableDirectory | undefined>();
expectTypeOf(ui.webrtc).toEqualTypeOf<foundry.applications.apps.av.CameraViews | undefined>();

const myColor = Color.from("foobar");

expectTypeOf(myColor).toEqualTypeOf<Color>();

import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

class D20Roll<D extends AnyObject> extends Roll<D> {}

declare global {
  namespace CONFIG {
    interface Dice {
      D20Roll: typeof D20Roll;
    }
  }
}

CONFIG.Dice.D20Roll = D20Roll;

const d20roll = new CONFIG.Dice.D20Roll("1d20");

d20roll.evaluate();

expectTypeOf(CONFIG.AmbientLight.sidebar.applicationClass).toEqualTypeOf<
  typeof foundry.applications.sidebar.tabs.AmbientLightTab
>();
expectTypeOf(CONFIG.AmbientLight.sidebar.order).toEqualTypeOf<number | undefined>();
expectTypeOf(CONFIG.ui.placeables).toEqualTypeOf<typeof foundry.applications.sidebar.tabs.PlaceableDirectory>();

declare const placeableTabConfiguration: PlaceableTab.Configuration<PlaceableTab.Any>;
expectTypeOf(placeableTabConfiguration.collectionName).toEqualTypeOf<
  foundry.canvas.placeables.PlaceableObject.AnyCanvasDocument["collectionName"]
>();

expectTypeOf(CONFIG.Canvas.sceneTransitions.fade.filterType).toEqualTypeOf<string>();
expectTypeOf(CONFIG.Canvas.sceneTransitions.holeSwirl.defaultDuration).toEqualTypeOf<number | undefined>();
expectTypeOf(
  CONFIG.Canvas.sceneTransitions.fade.filterClass,
).toEqualTypeOf<foundry.canvas.rendering.filters.AbstractBaseFilter.AnyConstructor>();

expectTypeOf(CONFIG.Level.documentClass).toEqualTypeOf<foundry.documents.Level.ImplementationClass>();

expectTypeOf(CONFIG.Canvas.managedScenes).toEqualTypeOf<
  Record<string, typeof foundry.canvas.SceneManager | foundry.canvas.SceneManager>
>();

expectTypeOf(CONFIG.JournalEntry.embedHandlers).toEqualTypeOf<CONFIG.DocumentEmbedHandler[]>();
expectTypeOf(CONFIG.Item.typeHints).toEqualTypeOf<CONFIG.Item["typeHints"]>();

expectTypeOf(CONFIG.Actor.trackableAttributes).toEqualTypeOf<Record<string, CONFIG.Actor.TrackableAttribute>>();
expectTypeOf(CONFIG.Actor.trackableAttributes["character"]?.bar).toEqualTypeOf<string[] | undefined>();

expectTypeOf(CONFIG.Token.barConfig.bar1.colors.empty).toEqualTypeOf<foundry.utils.Color>();
expectTypeOf(CONFIG.Token.barConfig.bar2.colors.full).toEqualTypeOf<foundry.utils.Color>();

expectTypeOf(CONFIG.statusEffects[0]).toEqualTypeOf<CONFIG.StatusEffect | undefined>();
expectTypeOf(CONFIG.statusEffects.push).toBeCallableWith({ id: "custom", name: "Custom" });

expectTypeOf(CONFIG.i18n.searchStopWords).toEqualTypeOf<Set<string>>();

expectTypeOf(CONFIG.time.formatters.duration).toEqualTypeOf<typeof foundry.data.CalendarData.formatDuration>();

expectTypeOf(CONFIG.Wall.doorSounds.jailCreaky.label).toEqualTypeOf<string>();
expectTypeOf(CONFIG.Wall.doorSounds.jailHeavy.label).toEqualTypeOf<string>();

declare const movementDescriptor: CONFIG.Token.Movement.ActionConfigDescriptor;
expectTypeOf(movementDescriptor.speedMultiplier).toEqualTypeOf<number | undefined>();
expectTypeOf(movementDescriptor.terrainAction).toEqualTypeOf<string | null | undefined>();
expectTypeOf(movementDescriptor.costMultiplier).toEqualTypeOf<number | undefined>();
expectTypeOf(movementDescriptor.canSelect).toEqualTypeOf<
  boolean | ((token: TokenDocument.Implementation | foundry.data.PrototypeToken) => boolean) | undefined
>();

declare const movementConfig: CONFIG.Token.Movement.ActionConfig;
expectTypeOf(movementConfig.img).toEqualTypeOf<string | null>();
expectTypeOf(movementConfig.walls).toEqualTypeOf<CONST.EDGE_RESTRICTION_TYPES | null>();
expectTypeOf(movementConfig.canSelect).toEqualTypeOf<
  (token: TokenDocument.Implementation | foundry.data.PrototypeToken) => boolean
>();

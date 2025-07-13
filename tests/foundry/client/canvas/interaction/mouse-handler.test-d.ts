import { expectTypeOf, test } from "vitest";

import MouseInteractionManager = foundry.canvas.interaction.MouseInteractionManager;
// import ControlIcon = foundry.canvas.containers.ControlIcon;
import PlaceableObject = foundry.canvas.placeables.PlaceableObject;
import Region = foundry.canvas.placeables.Region;
import Note = foundry.canvas.placeables.Note;

test("Static configuration properties", () => {
  expectTypeOf(MouseInteractionManager.DEFAULT_DRAG_RESISTANCE_PX).toBeNumber();
  expectTypeOf(MouseInteractionManager.DOUBLE_CLICK_TIME_MS).toBeNumber();
  expectTypeOf(MouseInteractionManager.DOUBLE_CLICK_DISTANCE_PX).toBeNumber();
  expectTypeOf(MouseInteractionManager.LONG_PRESS_DURATION_MS).toBeNumber();
});

test("Static state property", () => {
  expectTypeOf(MouseInteractionManager.longPressTimeout).toEqualTypeOf<number | null>();
});

declare const someRegion: Region.Implementation;
declare const someNote: Note.Implementation;

const notePermissions = {
  clickLeft(user, event) {
    return (
      !!this.entry && // checking we know we're in a Note
      user.name.length > 2 && // using user for something
      event instanceof PIXI.FederatedEvent &&
      !!event.interactionData.destination &&
      event.interactionData.destination.x > 50
    );
  },
  clickLeft2: true,
  clickRight: undefined, // treated as `true`
  clickRight2: () => true,
  // all permissions not enumerated treated as `true`
} satisfies MouseInteractionManager.Permissions<Note.Implementation>;

const noteCallbacks = {
  dragLeftCancel: function (event) {
    // no args get passed to this callback
    // why are the event phase enums on the instance side of FederatedEvent? have to ask PIXI
    if (event instanceof PIXI.FederatedEvent && event.eventPhase > event.AT_TARGET) return false;
  },
  hoverIn(_event, options: PlaceableObject.HoverInOptions) {
    if (options.hoverOutOthers) console.warn("hovering out others");
  },
  hoverOut: () => {
    // @ts-expect-error can't pass arrow functions that use `this`
    console.warn(this.entry);
  },
  dragRightStart: () => false,
} satisfies MouseInteractionManager.Callbacks<Note.Implementation>;

const regionPermissions = {
  clickLeft(user: User.Implementation, event: MouseInteractionManager.Event<Region.Implementation>) {
    return (
      !!this.shapes.length && // checking we know we're in a Region
      user.name.length > 2 && // using user for something
      event instanceof PIXI.FederatedEvent &&
      !!event.interactionData.destination &&
      event.interactionData.destination.x > 50
    );
  },
  clickLeft2: true,
  clickRight: undefined, // treated as `true`
  clickRight2: () => true,
  // all permissions not enumerated treated as `true`
} satisfies MouseInteractionManager.Permissions<Region.Implementation>;

const regionCallbacks = {
  hoverIn(_event, options: Region.HoverInOptions) {
    if (options.hoverOutOthers || options.updateLegend) console.log("stuff");
  },
  hoverOut(_event, options: Region.HoverOutOptions) {
    if (!(this.geometry instanceof foundry.canvas.placeables.regions.RegionGeometry)) throw new Error("what");
    if (options.updateLegend) this.layer.draw();
  },
  longPress: (_event: MouseInteractionManager.Event, origin: PIXI.Point) => {
    return origin.x > 500;
  },
} satisfies MouseInteractionManager.Callbacks<Region.Implementation>;

const stage = canvas!.stage!;

// passing no permissions or callbacks is allowed, it just leads to a pretty useless MIM
new MouseInteractionManager(stage, stage);
new MouseInteractionManager(someNote, stage, notePermissions, noteCallbacks);
// @ts-expect-error can't pass region permissions to a note manager
new MouseInteractionManager(someNote, stage, regionPermissions, noteCallbacks);
// @ts-expect-error can't pass region callbacks to a note manager
new MouseInteractionManager(someNote, stage, notePermissions, regionCallbacks);
//@ts-expect-error or the inverse
new MouseInteractionManager(someRegion, stage, notePermissions, noteCallbacks);

const noteMIM = new MouseInteractionManager(someNote, stage, notePermissions, noteCallbacks, {
  target: "controlIcon",
  dragResistance: 20,
  application: new PIXI.Application(),
});
const regionMIM = new MouseInteractionManager(someRegion, stage, regionPermissions, regionCallbacks, {
  target: undefined,
  dragResistance: undefined,
  application: undefined,
});

test(`Branded "enum"(s)`, () => {
  expectTypeOf(MouseInteractionManager.INTERACTION_STATES).toExtend<
    Record<keyof MouseInteractionManager.InteractionStates, MouseInteractionManager.INTERACTION_STATES>
  >();
  expectTypeOf(noteMIM.handlerOutcomes).toExtend<
    Record<keyof MouseInteractionManager.HandlerOutcomes, MouseInteractionManager.HANDLER_OUTCOMES>
  >();
});

test("Trivial properties, getters, setters, and methods", () => {
  expectTypeOf(MouseInteractionManager.emulateMoveEvent()).toBeVoid();
  expectTypeOf(noteMIM.object).toEqualTypeOf<Note.Implementation>();
});

declare const regionEvent: MouseInteractionManager.Event<Region.Implementation>;
declare const noteEvent: MouseInteractionManager.Event<Note.Implementation>;

expectTypeOf(noteEvent?.interactionData);

test("callbacks", () => {
  // All callback args are just `...AnyArray`
  // @ts-expect-error Can't pass a region event to a note callback
  noteMIM.callback("hoverIn", regionEvent, { hoverOutOthers: true });
  expectTypeOf(noteMIM.callback("hoverIn", noteEvent, { hoverOutOthers: true })).toEqualTypeOf<boolean>;
  expectTypeOf(noteMIM.callback("longPress", noteEvent, new PIXI.Point(1000, 1000)));
  expectTypeOf(regionMIM.callback("hoverIn", regionEvent, { hoverOutOthers: true })).toEqualTypeOf<boolean>;
  expectTypeOf(regionMIM.callback("longPress", regionEvent, new PIXI.Point(1000, 1000)));
});
expectTypeOf(noteMIM.state).toEqualTypeOf<MouseInteractionManager.INTERACTION_STATES>();
expectTypeOf(noteMIM.reset({ interactionData: true, state: false })).toEqualTypeOf<void>();

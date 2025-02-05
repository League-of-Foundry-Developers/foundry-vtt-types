import { expectTypeOf } from "vitest";

expectTypeOf(
  MouseInteractionManager.INTERACTION_STATES.CLICKED,
).toMatchTypeOf<MouseInteractionManager.INTERACTION_STATES>();

declare const someEvent: PIXI.FederatedEvent;
declare const someRegion: Region.Object;

const permissions = {
  dragLeftStart: (_user: User.ConfiguredInstance, _e: Event | PIXI.FederatedEvent) => true,
  dragRightStart: false,
};

const callbacks = {
  hoverIn: (_e: Event | PIXI.FederatedEvent, options: PlaceableObject.HoverInOptions) => {
    if (options.hoverOutOthers) console.log("stuff");
  },
  longPress: (_e: Event | PIXI.FederatedEvent, origin: PIXI.Point) => {
    return origin.x > 500;
  },
};

const myMouseHandler = new MouseInteractionManager(someRegion, new PIXI.Container(), permissions, callbacks, {
  target: null,
});

expectTypeOf(myMouseHandler.handlerOutcomes.ACCEPTED).toMatchTypeOf<MouseInteractionManager.HANDLER_OUTCOMES>();

// Unfortunately the parameters beyond the event are not being typechecked due to complexities in the way manager callbacks are registered
expectTypeOf(myMouseHandler.callback("hoverIn", someEvent, { hoverOutOthers: true })).toEqualTypeOf<boolean>;
expectTypeOf(myMouseHandler.callback("longPress", someEvent, new PIXI.Point(1000, 1000)));

expectTypeOf(myMouseHandler.state).toEqualTypeOf<MouseInteractionManager.INTERACTION_STATES>();
expectTypeOf(myMouseHandler.reset({ interactionData: true, state: false })).toEqualTypeOf<void>();

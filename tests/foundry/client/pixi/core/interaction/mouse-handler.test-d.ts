import { expectTypeOf } from "vitest";

expectTypeOf(MouseInteractionManager.INTERACTION_STATES).toMatchTypeOf<
  Record<string, number & MouseInteractionManager.INTERACTION_STATES>
>();

declare const someEvent: PIXI.FederatedEvent;

const permissions = {
  dragLeftStart: (_user: User.ConfiguredInstance, _e: Event | PIXI.FederatedEvent) => true,
  dragLeftDrop: (user: User.ConfiguredInstance, _e: Event | PIXI.FederatedEvent) => user.id?.includes("F") ?? false,
  dragRightStart: false,
};

const callbacks = {
  dragLeftStart: (_e: Event | PIXI.FederatedEvent, otherArg: number) => {
    return otherArg > 4;
  },
  dragLeftDrop: (_e: Event | PIXI.FederatedEvent, otherArg: string) => {
    return otherArg.includes("hello, world");
  },
};

const myMouseHandler = new MouseInteractionManager(new PIXI.Container(), new PIXI.Container(), permissions, callbacks, {
  target: null,
});

expectTypeOf(myMouseHandler.callback("dragLeftStart", someEvent, 8)).toEqualTypeOf<boolean>;
expectTypeOf(myMouseHandler.callback("dragLeftDrop", someEvent, "bob"));
expectTypeOf(myMouseHandler.state).toEqualTypeOf<MouseInteractionManager.INTERACTION_STATES>();

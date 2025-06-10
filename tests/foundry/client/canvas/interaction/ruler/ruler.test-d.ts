import { expectTypeOf } from "vitest";
import { Ruler } from "#client/canvas/interaction/_module.mjs";

expectTypeOf(Ruler.STATES).toExtend<Record<keyof Ruler.States, Ruler.STATES>>();
expectTypeOf(Ruler.canMeasure).toBeBoolean();

if (game.ready) {
  expectTypeOf(new Ruler(undefined)).toEqualTypeOf<Ruler>();
  expectTypeOf(new Ruler(game.user, { color: null })).toEqualTypeOf<Ruler>();
  expectTypeOf(new Ruler(game.user, { color: 0x32f4e2 })).toEqualTypeOf<Ruler>();
}

const ruler = new Ruler();
declare const somePoint: PIXI.Point;

expectTypeOf(ruler.user).toEqualTypeOf<User.Implementation>();
expectTypeOf(ruler.name).toEqualTypeOf<string>();
expectTypeOf(ruler.color).toEqualTypeOf<Color>();

expectTypeOf(ruler.ruler).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(ruler.labels).toEqualTypeOf<PIXI.Container>();

expectTypeOf(ruler.destination).toEqualTypeOf<Canvas.Point | null>();
expectTypeOf(ruler.origin).toEqualTypeOf<Canvas.Point | null>();
expectTypeOf(ruler.waypoints).toEqualTypeOf<Canvas.Point[]>();

expectTypeOf(ruler.segments).toEqualTypeOf<Ruler.MeasurementSegment[]>();
expectTypeOf(ruler.history).toEqualTypeOf<Ruler.MeasurementHistoryWaypoint[]>();

expectTypeOf(ruler.totalDistance).toBeNumber();
expectTypeOf(ruler.totalCost).toBeNumber();

expectTypeOf(ruler.state).toEqualTypeOf<Ruler.STATES>();
expectTypeOf(ruler["_state"]).toEqualTypeOf<Ruler.STATES>();

expectTypeOf(ruler.active).toEqualTypeOf<boolean>();
expectTypeOf(ruler.highlightLayer).toEqualTypeOf<GridHighlight>();
expectTypeOf(ruler.token).toEqualTypeOf<Token.Implementation | null>();

expectTypeOf(ruler.clear()).toBeVoid();

expectTypeOf(ruler.measure(somePoint)).toEqualTypeOf<Ruler.MeasurementSegment[] | void>();
expectTypeOf(ruler.measure({ x: 10, y: 10 }, {})).toEqualTypeOf<Ruler.MeasurementSegment[] | void>();
expectTypeOf(ruler.measure({ x: 10, y: 10 }, { snap: null, force: undefined })).toEqualTypeOf<
  Ruler.MeasurementSegment[] | void
>();

expectTypeOf(ruler["_getMeasurementOrigin"](somePoint)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(ruler["_getMeasurementOrigin"](somePoint, {})).toEqualTypeOf<Canvas.Point>();
expectTypeOf(ruler["_getMeasurementOrigin"](somePoint, { snap: false })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(ruler["_getMeasurementDestination"](somePoint)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(ruler["_getMeasurementDestination"](somePoint, {})).toEqualTypeOf<Canvas.Point>();
expectTypeOf(ruler["_getMeasurementDestination"](somePoint, { snap: undefined })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(ruler["_getMeasurementSegments"]()).toEqualTypeOf<Ruler.MeasurementSegment[]>();

expectTypeOf(ruler["_startMeasurement"](somePoint)).toBeVoid();
expectTypeOf(ruler["_startMeasurement"](somePoint, {})).toBeVoid();
expectTypeOf(ruler["_startMeasurement"](somePoint, { snap: true })).toBeVoid();

expectTypeOf(ruler["_endMeasurement"]()).toBeVoid();

expectTypeOf(ruler["_addWaypoint"](somePoint)).toBeVoid();
expectTypeOf(ruler["_addWaypoint"](somePoint, {})).toBeVoid();
expectTypeOf(ruler["_addWaypoint"](somePoint, { snap: null })).toBeVoid();

expectTypeOf(ruler["_getCostFunction"]()).toEqualTypeOf<foundry.grid.BaseGrid.MeasurePathCostFunction | void>();
expectTypeOf(ruler["_computeDistance"]()).toBeVoid();

declare const fullRulerSegment: Ruler.MeasurementSegment;
expectTypeOf(ruler["_getSegmentLabel"](fullRulerSegment)).toBeString();
expectTypeOf(ruler["_getSegmentLabel"]({ distance: 50, last: false, teleport: false })).toBeString();

expectTypeOf(ruler["_drawMeasuredPath"]()).toBeVoid();

declare const someRay: Ray;
expectTypeOf(ruler["_highlightMeasurementSegment"](fullRulerSegment)).toBeVoid();
expectTypeOf(ruler["_highlightMeasurementSegment"]({ teleport: true, ray: someRay })).toBeVoid();

expectTypeOf(ruler.moveToken()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(ruler["_getMovementToken"](somePoint)).toEqualTypeOf<Token.Implementation | null>();

expectTypeOf(ruler["_getMeasurementHistory"]()).toEqualTypeOf<Ruler.MeasurementHistory | void>();
expectTypeOf(ruler["_createMeasurementHistory"]()).toEqualTypeOf<Ruler.MeasurementHistory>();

declare const someToken: Token.Implementation;
expectTypeOf(ruler["_canMove"](someToken)).toBeBoolean();
expectTypeOf(ruler["_animateMovement"](someToken)).toEqualTypeOf<Promise<void>>();

expectTypeOf(
  ruler["_animateSegment"](someToken, fullRulerSegment, somePoint, { noHook: false, recursive: true }),
).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  ruler["_animateSegment"](
    someToken,
    {
      animation: {
        // TODO: fill in once properly typed in TokenDocument
      },
      teleport: true,
    },
    somePoint,
    {
      noHook: false,
      recursive: true,
    },
  ),
).toEqualTypeOf<Promise<void>>();

expectTypeOf(ruler["_preMove"](someToken)).toEqualTypeOf<Promise<void>>();
expectTypeOf(ruler["_postMove"](someToken)).toEqualTypeOf<Promise<void>>();
expectTypeOf(ruler["_broadcastMeasurement"]()).toBeVoid();
expectTypeOf(ruler["_getMeasurementData"]()).toEqualTypeOf<Ruler.MeasurementData>();

expectTypeOf(ruler.update()).toBeVoid();
expectTypeOf(ruler.update(null)).toBeVoid();
expectTypeOf(
  ruler.update({
    destination: somePoint,
    history: [],
    state: Ruler.STATES.MEASURING,
    token: someToken.id,
    waypoints: [],
  }),
).toBeVoid();

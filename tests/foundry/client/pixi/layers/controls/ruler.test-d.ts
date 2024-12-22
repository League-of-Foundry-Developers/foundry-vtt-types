import { expectTypeOf } from "vitest";
import Color = foundry.utils.Color;

if (game instanceof Game) {
  expectTypeOf(new Ruler(undefined)).toEqualTypeOf<Ruler>();
  expectTypeOf(new Ruler(game.user, { color: null })).toEqualTypeOf<Ruler>();
  expectTypeOf(new Ruler(game.user, { color: 0x32f4e2 })).toEqualTypeOf<Ruler>();
}

const ruler = new Ruler();
expectTypeOf(ruler.user).toEqualTypeOf<User>();
expectTypeOf(ruler.name).toEqualTypeOf<string>();
expectTypeOf(ruler.color).toEqualTypeOf<Color>();
expectTypeOf(ruler.waypoints).toEqualTypeOf<PIXI.Point[]>();
expectTypeOf(ruler.destination).toEqualTypeOf<PIXI.Point | null>();
expectTypeOf(ruler.ruler).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(ruler.labels).toEqualTypeOf<PIXI.Container>();
expectTypeOf(Ruler.STATES).toEqualTypeOf<{ INACTIVE: 0; STARTING: 1; MEASURING: 2; MOVING: 3 }>();
expectTypeOf(ruler.active).toEqualTypeOf<boolean>();

expectTypeOf(ruler.measure(new PIXI.Point())).toEqualTypeOf<Array<Ruler.Segment>>();
expectTypeOf(ruler.measure({ x: 10, y: 10 }, {})).toEqualTypeOf<Array<Ruler.Segment>>();
expectTypeOf(ruler.measure({ x: 10, y: 10 }, { gridSpaces: true })).toEqualTypeOf<Array<Ruler.Segment>>();

expectTypeOf(ruler.moveToken()).toEqualTypeOf<Promise<false | undefined>>();
expectTypeOf(ruler.clear()).toEqualTypeOf<void>();
expectTypeOf(ruler.toJSON()).toEqualTypeOf<RulerData>();
expectTypeOf(ruler.update(ruler.toJSON())).toEqualTypeOf<void>();

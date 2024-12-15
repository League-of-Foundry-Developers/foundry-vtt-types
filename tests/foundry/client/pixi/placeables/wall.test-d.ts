import { expectTypeOf } from "vitest";

expectTypeOf(Wall.embeddedName).toEqualTypeOf<"Wall">();

declare const doc: WallDocument;
declare const ray: Ray;

const wall = new Wall(doc);
expectTypeOf(wall.mouseInteractionManager).toEqualTypeOf<MouseInteractionManager<Wall> | null>();
expectTypeOf(wall.roof).toEqualTypeOf<Tile | undefined>();
expectTypeOf(wall.coords).toEqualTypeOf<[number, number, number, number]>();
expectTypeOf(wall.midpoint).toEqualTypeOf<[number, number]>();
expectTypeOf(wall.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(wall.direction).toEqualTypeOf<number | null>();
expectTypeOf(wall.toRay()).toEqualTypeOf<Ray>();
expectTypeOf(wall.draw()).toEqualTypeOf<Promise<Wall>>();
expectTypeOf(wall.isDirectionBetweenAngles(10, 20)).toEqualTypeOf<boolean>();
expectTypeOf(wall.canRayIntersect(ray)).toEqualTypeOf<boolean>();
expectTypeOf(wall.getLinkedSegments()).toEqualTypeOf<{
  ids: string[];
  walls: Wall[];
  endpoints: Array<[number, number]>;
}>();

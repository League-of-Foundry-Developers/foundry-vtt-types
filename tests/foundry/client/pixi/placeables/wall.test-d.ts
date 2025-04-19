import { expectTypeOf } from "vitest";

expectTypeOf(Wall.embeddedName).toEqualTypeOf<"Wall">();

declare const doc: WallDocument.Implementation;
declare const ray: Ray;

const wall = new CONFIG.Wall.objectClass(doc);
expectTypeOf(wall.mouseInteractionManager).toEqualTypeOf<MouseInteractionManager<Wall.Object> | null>();
expectTypeOf(wall.roof).toEqualTypeOf<Tile.Object | undefined>();
expectTypeOf(wall.coords).toEqualTypeOf<[number, number, number, number]>();
expectTypeOf(wall.midpoint).toEqualTypeOf<[number, number]>();
expectTypeOf(wall.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(wall.direction).toEqualTypeOf<number | null>();
expectTypeOf(wall.toRay()).toEqualTypeOf<Ray>();
expectTypeOf(wall.draw()).toEqualTypeOf<Promise<Wall.Object>>();
expectTypeOf(wall.isDirectionBetweenAngles(10, 20)).toEqualTypeOf<boolean>();
expectTypeOf(wall.canRayIntersect(ray)).toEqualTypeOf<boolean>();
expectTypeOf(wall.getLinkedSegments()).toEqualTypeOf<{
  ids: string[];
  walls: Wall.Object[];
  endpoints: Array<[number, number]>;
}>();

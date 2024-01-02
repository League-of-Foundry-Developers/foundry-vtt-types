import { expectType } from 'tsd';

expectType<'Wall'>(Wall.embeddedName);

declare const doc: WallDocument;
declare const ray: Ray;

const wall = new Wall(doc);
expectType<DoorControl | undefined | null>(wall.doorControl);
expectType<MouseInteractionManager<Wall> | null>(wall.mouseInteractionManager);
expectType<Tile | undefined>(wall.roof);
expectType<[number, number, number, number]>(wall.coords);
expectType<NormalizedRectangle>(wall.bounds);
expectType<[number, number]>(wall.midpoint);
expectType<PIXI.Point>(wall.center);
expectType<number | null>(wall.direction);
expectType<Ray>(wall.toRay());
expectType<Promise<Wall>>(wall.draw());
expectType<boolean>(wall.isDirectionBetweenAngles(10, 20));
expectType<boolean>(wall.canRayIntersect(ray));
expectType<{ ids: string[]; walls: Wall[]; endpoints: Array<[number, number]> }>(wall.getLinkedSegments());

import { expectType } from 'tsd';

let sourcePolygon = new SourcePolygon(0, 0, 42);
sourcePolygon = new SourcePolygon(0, 0, 42, []);
sourcePolygon = new SourcePolygon(0, 0, 42, [1, 2, 3, 4, 5, 6]);
sourcePolygon = new SourcePolygon(0, 0, 42, [
  { x: 1, y: 2 },
  { x: 3, y: 4 },
  { x: 5, y: 6 }
]);

expectType<number>(sourcePolygon.x);
expectType<number>(sourcePolygon.y);
expectType<number>(sourcePolygon.radius);
expectType<SourcePolygon>(sourcePolygon.clone());
expectType<boolean>(sourcePolygon.contains(2, 4));

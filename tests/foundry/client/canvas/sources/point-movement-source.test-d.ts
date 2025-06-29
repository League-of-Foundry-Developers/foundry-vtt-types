import { expectTypeOf } from "vitest";

import PointMovementSource = foundry.canvas.sources.PointMovementSource;

expectTypeOf(PointMovementSource.sourceType).toEqualTypeOf<"move">();
expectTypeOf(PointMovementSource.defaultData).toEqualTypeOf<PointMovementSource.SourceData>();

declare const object: foundry.canvas.placeables.Token.Implementation;
new PointMovementSource();
new PointMovementSource({ object: undefined, sourceId: undefined });
const mySource = new PointMovementSource({ object, sourceId: object.sourceId });
// Every property of SourceData represented for testing, not all necessarily actually used by this type
const initializedSource = mySource.initialize({
  angle: 90,
  disabled: false,
  elevation: 20,
  externalRadius: 2000,
  radius: 300,
  rotation: 270,
  walls: true,
  x: 50,
  y: 50,
});
expectTypeOf(mySource.data).toEqualTypeOf<PointMovementSource.SourceData>();

expectTypeOf(mySource.shape).toEqualTypeOf<PointMovementSource.ImplementationPolygon | undefined>();
expectTypeOf(initializedSource.shape).toEqualTypeOf<PointMovementSource.ImplementationPolygon>();
const _shape: foundry.canvas.geometry.PointSourcePolygon = initializedSource.shape;

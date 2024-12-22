import { expectTypeOf } from "vitest";
import type PointVisionSource from "../../../../../src/foundry/client-esm/canvas/sources/point-vision-source.d.mts";

const mySource = new foundry.canvas.sources.PointVisionSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(mySource.drawMeshes().background?.visible).toEqualTypeOf<boolean | undefined>();
expectTypeOf(mySource.data).toEqualTypeOf<PointVisionSource.SourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource._configureShaders().background).toEqualTypeOf<typeof AdaptiveVisionShader>();

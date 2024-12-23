import { expectTypeOf } from "vitest";
import type { ValueOf } from "fvtt-types/utils";

class MyDetectionMode extends DetectionMode {}

const myDetectionMode = new MyDetectionMode({ id: "foo", label: "bar", type: DetectionMode.DETECTION_TYPES.OTHER });

const myVisionSource = new VisionSource();

expectTypeOf(
  myDetectionMode.testVisibility(
    myVisionSource,
    { id: "foobar", enabled: true, range: 3 },
    { object: null, tests: [] },
  ),
).toEqualTypeOf<boolean>();

expectTypeOf(myDetectionMode.angle).toEqualTypeOf<boolean>();
expectTypeOf(myDetectionMode.type).toEqualTypeOf<ValueOf<typeof DetectionMode.DETECTION_TYPES>>();

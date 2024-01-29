import { expectTypeOf } from "vitest";

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

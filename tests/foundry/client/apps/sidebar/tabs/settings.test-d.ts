import { expectTypeOf } from "vitest";

const frameViewer = new FrameViewer("https://foundryvtt.wiki/", {
  title: "My Title",
});

expectTypeOf(frameViewer.url).toEqualTypeOf<string>();

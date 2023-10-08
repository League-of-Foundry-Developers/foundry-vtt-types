import { expectType } from "tsd";

const frameViewer = new FrameViewer("https://foundryvtt.wiki/", {
  title: "My Title",
});

expectType<string>(frameViewer.url);

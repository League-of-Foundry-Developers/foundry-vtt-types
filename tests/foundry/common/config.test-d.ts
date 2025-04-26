import { expectTypeOf } from "vitest";

const myRelease = new foundry.config.ReleaseData({
  build: 315,
  // @ts-expect-error "foobar" is not a valid release channel
  channel: "foobar",
  download: undefined,
  generation: 11,
  maxGeneration: 12,
  maxStableGeneration: 11,
  node_version: 16,
  notes: undefined,
  suffix: "Stable",
  time: 1709002477602,
});

expectTypeOf(myRelease.shortDisplay).toExtend<string>();

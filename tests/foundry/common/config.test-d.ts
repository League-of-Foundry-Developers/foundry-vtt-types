import { expectTypeOf } from "vitest";

import ServerSettings = foundry.config.ServerSettings;

declare const serverSettings: ServerSettings;

expectTypeOf(serverSettings.adminUsername).toEqualTypeOf<string | null>();
expectTypeOf<ServerSettings.Source["adminUsername"]>().toEqualTypeOf<string | null>();
expectTypeOf<ServerSettings.InitializedData["adminUsername"]>().toEqualTypeOf<string | null>();
expectTypeOf<ServerSettings.CreateData["adminUsername"]>().toEqualTypeOf<string | null | undefined>();

expectTypeOf(serverSettings.tempDir).toEqualTypeOf<string | undefined>();
expectTypeOf(serverSettings.unixSocket).toEqualTypeOf<string | null>();
expectTypeOf(serverSettings.port).toEqualTypeOf<number | null>();

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

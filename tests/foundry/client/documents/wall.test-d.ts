import { expectTypeOf } from "vitest";

declare module "fvtt-types/configuration" {
  interface FlagConfig {
    WallDocument: {
      foobar?: boolean;
    };
  }
}

declare const scene: Scene.Implementation;

// @ts-expect-error requires 'c'
new WallDocument.implementation();

// @ts-expect-error requires 'c'
new WallDocument.implementation({});

new WallDocument.implementation({ c: [0, 0, 0, 0] });
new WallDocument.implementation({ c: [0, 0, 0, 0] }, { parent: scene });

declare const myWall: WallDocument.Stored;

expectTypeOf(myWall.flags.core?.sheetClass).toEqualTypeOf<string | undefined>();

expectTypeOf(myWall.hidden).toEqualTypeOf<false>();
expectTypeOf(myWall.locked).toEqualTypeOf<false>();

await WallDocument.create(
  {
    c: [0, 0, 0, 0],
    flags: { core: { sheetClass: "foobar" } },
  },
  { parent: scene },
);

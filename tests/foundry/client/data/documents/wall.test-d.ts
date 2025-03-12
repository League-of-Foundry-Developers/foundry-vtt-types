import { expectTypeOf } from "vitest";

declare global {
  interface FlagConfig {
    WallDocument: {
      foobar?: boolean;
    };
  }
}

declare const scene: Scene;

// @ts-expect-error requires 'c'
new WallDocument();

// @ts-expect-error requires 'c'
new WallDocument({});

new WallDocument({ c: [0, 0, 0, 0] });
new WallDocument({ c: [0, 0, 0, 0] }, { parent: scene });

declare const myWall: WallDocument.Stored;

expectTypeOf(myWall.flags.core?.sheetClass).toEqualTypeOf<string | undefined>();

await WallDocument.create(
  {
    c: [0, 0, 0, 0],
    flags: { core: { sheetClass: "foobar" } },
  },
  { parent: scene },
);

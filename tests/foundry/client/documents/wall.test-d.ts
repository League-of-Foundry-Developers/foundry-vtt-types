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

declare const wall: WallDocument.Stored;
declare const level: Level.Implementation;
declare const edge: foundry.canvas.geometry.edges.Edge;

expectTypeOf(wall.edge).toEqualTypeOf<foundry.canvas.geometry.edges.Edge | null>();
expectTypeOf(wall.darkness).toEqualTypeOf<CONST.EDGE_SENSE_TYPES | null>();
expectTypeOf(wall.isDoor).toBeBoolean();
expectTypeOf(wall.isOpen).toBeBoolean();
expectTypeOf(wall.levels).toEqualTypeOf<Set<string>>();
expectTypeOf(wall.prepareBaseData()).toEqualTypeOf<void>();
expectTypeOf(wall.getWallCategory()).toEqualTypeOf<WallDocument.Category>();
expectTypeOf(wall.initializeEdge()).toEqualTypeOf<void>();
expectTypeOf(wall.initializeEdge({ deleted: true })).toEqualTypeOf<void>();

class TestWallDocument extends WallDocument {
  protected override _onEdgeChange(
    _level: Level.Implementation,
    _newEdge: foundry.canvas.geometry.edges.Edge | null,
    _priorEdge: foundry.canvas.geometry.edges.Edge | null,
    _changedTypes: ReadonlySet<CONST.EDGE_RESTRICTION_TYPES>,
  ): void {}
}

expectTypeOf(new TestWallDocument({ c: [0, 0, 0, 0] }, { parent: scene })).toEqualTypeOf<TestWallDocument>();
expectTypeOf(wall.includedInLevel(level)).toBeBoolean();
expectTypeOf(edge.id).toEqualTypeOf<string | undefined>();

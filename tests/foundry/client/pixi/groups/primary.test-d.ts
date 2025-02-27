import { expectTypeOf } from "vitest";

expectTypeOf(PrimaryCanvasGroup.groupName).toMatchTypeOf<keyof CONFIG.Canvas.Groups>();
expectTypeOf(PrimaryCanvasGroup.tearDownChildren).toEqualTypeOf<boolean>();
expectTypeOf(PrimaryCanvasGroup.BACKGROUND_ELEVATION).toEqualTypeOf<number>();

declare const someMesh: SpriteMesh;
declare const someToken: Token.ConfiguredInstance;
declare const someTile: Tile.ConfiguredInstance;
declare const someDrawing: Drawing.ConfiguredInstance;
const myPrimaryGroup = new PrimaryCanvasGroup(someMesh);

expectTypeOf(myPrimaryGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"primary">>();

expectTypeOf(myPrimaryGroup._ambienceFilter).toEqualTypeOf<PrimaryCanvasGroupAmbienceFilter | undefined>();

expectTypeOf(myPrimaryGroup.addToken(someToken)).toEqualTypeOf<PrimarySpriteMesh>();
expectTypeOf(myPrimaryGroup.addTile(someTile)).toEqualTypeOf<PrimarySpriteMesh>();
expectTypeOf(myPrimaryGroup.addDrawing(someDrawing)).toEqualTypeOf<PrimaryGraphics>();

//deprecated since v11, until v13
expectTypeOf(myPrimaryGroup.mapElevationAlpha(20)).toEqualTypeOf<number>();
//depcated since v12, until v14
expectTypeOf(myPrimaryGroup.mapElevationToDepth(20)).toEqualTypeOf<number>();

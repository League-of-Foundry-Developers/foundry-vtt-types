import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

declare const scene: foundry.documents.Scene;
const doc = new TokenDocument.implementation({}, { parent: scene });
expectTypeOf(doc.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(doc.isOwner).toEqualTypeOf<boolean>();
expectTypeOf(doc.isLinked).toEqualTypeOf<boolean>();
expectTypeOf(doc.combatant).toEqualTypeOf<Combatant.Stored | null>();
expectTypeOf(doc.inCombat).toEqualTypeOf<boolean>();
expectTypeOf(doc.clone()).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(doc.clone({}, { save: true })).toEqualTypeOf<Promise<TokenDocument.Stored | undefined>>();
expectTypeOf(doc.actor).toEqualTypeOf<Actor.Implementation | null>();

// Can't get more specific due to delta concerns
expectTypeOf(doc.getEmbeddedCollection("Item")).toEqualTypeOf<foundry.utils.Collection<Item.Implementation>>();
expectTypeOf(doc.getEmbeddedCollection("ActiveEffect")).toEqualTypeOf<
  foundry.utils.Collection<ActiveEffect.Implementation>
>();

declare const someToken: TokenDocument.Stored;
declare const someLevel: Level.Implementation;

expectTypeOf(TokenDocument.implementation._preventActorDeltaAccess).toBeBoolean();
expectTypeOf(someToken.scene).toEqualTypeOf<Scene.Implementation | null>();
expectTypeOf(someToken.isLazyDelta).toBeBoolean();
expectTypeOf(someToken.attachments.regions).toEqualTypeOf<Set<RegionDocument.Implementation>>();
expectTypeOf(someToken._returnedMovementPromises).toEqualTypeOf<Map<string, Promise<boolean>>>();
expectTypeOf(someToken.level).toBeString();
expectTypeOf(someToken.depth).toBeNumber();
expectTypeOf(someToken.includedInLevel(someLevel)).toBeBoolean();
expectTypeOf(someToken.locatedInLevel("someLevelId")).toBeBoolean();
expectTypeOf(someToken.prepareData()).toEqualTypeOf<void>();
expectTypeOf(someToken.startMovement()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(someToken.startMovement("aMovementId")).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(someToken.getOccupiedGridSpaceOffsets()).toEqualTypeOf<foundry.grid.BaseGrid.Offset3D[]>();
expectTypeOf(someToken.getMaxOccupiedGridSpaceCount({ width: 2, height: 2 })).toBeNumber();
expectTypeOf(someToken.getMovementOrigin()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();
expectTypeOf(someToken.getLightOrigin()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();
expectTypeOf(someToken.getVisionOrigin()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();
expectTypeOf(someToken.getSoundOrigin()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();
expectTypeOf(someToken.getListenerPosition()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();
expectTypeOf(someToken.getContainmentTestPoints()).toEqualTypeOf<foundry.canvas.Canvas.Point[]>();
expectTypeOf(someToken.getVisibilityTestPoints()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint[]>();
expectTypeOf(someToken.getOcclusionTestPoints()).toEqualTypeOf<foundry.canvas.Canvas.Point[]>();
expectTypeOf(someToken.applyActiveEffects("initial")).toEqualTypeOf<void>();

class TestTokenDocument extends TokenDocument {
  protected override _onMovementPlanned(): void {}

  protected override _onOverrideSize(_changes: TokenDocument.PartialDimensions): Promise<void> {
    return Promise.resolve();
  }

  protected override _getReplacementData(): AnyObject {
    return {};
  }

  protected override _prepareBars(): void {}

  protected override _constrainTestPoints(
    _points: (foundry.canvas.Canvas.Point | foundry.canvas.Canvas.ElevatedPoint)[],
    _data: TokenDocument.TestPointsData,
  ): void {}
}

expectTypeOf(new TestTokenDocument()).toEqualTypeOf<TestTokenDocument>();

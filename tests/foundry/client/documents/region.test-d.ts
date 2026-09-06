import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;

declare const region: RegionDocument.Stored;
declare const waypoints: RegionDocument.SegmentizeMovementPathWaypoint[];
declare const samples: Canvas.Point[];

expectTypeOf(region.segmentizeMovementPath(waypoints, samples)).toEqualTypeOf<RegionDocument.MovementSegment[]>();
expectTypeOf(region.segmentizeMovementPath(waypoints, samples, 0.75)).toEqualTypeOf<RegionDocument.MovementSegment[]>();
expectTypeOf(region.segmentizeMovementPath(waypoints, samples, undefined)).toEqualTypeOf<
  RegionDocument.MovementSegment[]
>();

declare const token: TokenDocument.Implementation;

expectTypeOf(region.isSingleShape).toBeBoolean();
expectTypeOf(region.area).toBeNumber();
expectTypeOf(region.clipperPolyTree).toEqualTypeOf<ClipperLib.PolyTree>();
expectTypeOf(region.levels).toEqualTypeOf<Set<string>>();
expectTypeOf(region.restriction.enabled).toBeBoolean();
expectTypeOf(region.restriction.type).toEqualTypeOf<CONST.EDGE_RESTRICTION_TYPES>();
expectTypeOf(region.restriction.priority).toBeNumber();
expectTypeOf(region.highlightMode).toEqualTypeOf<RegionDocument.HighlightMode>();
expectTypeOf(region.displayMeasurements).toBeBoolean();
expectTypeOf(region.hidden).toBeBoolean();
expectTypeOf(region.elevation.topInclusive).toBeBoolean();
expectTypeOf(region.clampElevation(5)).toBeNumber();
expectTypeOf(region.clampElevation(5, 2)).toBeNumber();
expectTypeOf(region.updateShapeConstraints()).toEqualTypeOf<void>();
expectTypeOf(region.updateShapeConstraints({ save: true })).toEqualTypeOf<void>();
expectTypeOf(
  RegionDocument.implementation._testElevation({ bottom: 0, top: 10, topInclusive: false }, 5),
).toBeBoolean();

expectTypeOf(region.teleportTokens([token])).toEqualTypeOf<
  Promise<Map<TokenDocument.Implementation, TokenDocument.Implementation>>
>();
expectTypeOf(region.teleportTokens([token], { placement: "center", snap: false, pan: false })).toEqualTypeOf<
  Promise<Map<TokenDocument.Implementation, TokenDocument.Implementation>>
>();
expectTypeOf(region.spawnTokens([{ name: "Goblin" }])).toEqualTypeOf<Promise<TokenDocument.Implementation[]>>();
expectTypeOf(region.removeShapeDialog(0)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(RegionDocument.createTokenEmanation(token, 20, { name: "Aura" })).toEqualTypeOf<
  Promise<RegionDocument.Stored | undefined>
>();

expectTypeOf<RegionDocument.TokenEnterExitEventData["token"]>().toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf<
  RegionDocument.TokenEnterExitEventData["movement"]
>().toEqualTypeOf<TokenDocument.MovementOperation | null>();

expectTypeOf<RegionDocument.TokenMoveEventData["token"]>().toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf<RegionDocument.TokenMoveEventData["movement"]>().toEqualTypeOf<TokenDocument.MovementOperation>();

expectTypeOf<RegionDocument.TokenAnimateEventData["token"]>().toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf<RegionDocument.TokenAnimateEventData["position"]>().toEqualTypeOf<TokenDocument.Position>();

expectTypeOf<RegionDocument.TokenTurnEventData["token"]>().toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf<RegionDocument.TokenTurnEventData["combatant"]>().toEqualTypeOf<Combatant.Implementation>();
expectTypeOf<RegionDocument.TokenTurnEventData["combat"]>().toEqualTypeOf<Combat.Implementation>();
expectTypeOf<RegionDocument.TokenTurnEventData["round"]>().toBeNumber();
expectTypeOf<RegionDocument.TokenTurnEventData["turn"]>().toBeNumber();
expectTypeOf<RegionDocument.TokenTurnEventData["skipped"]>().toBeBoolean();

expectTypeOf<RegionDocument.TokenRoundEventData["token"]>().toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf<RegionDocument.TokenRoundEventData["combatant"]>().toEqualTypeOf<Combatant.Implementation>();
expectTypeOf<RegionDocument.TokenRoundEventData["combat"]>().toEqualTypeOf<Combat.Implementation>();
expectTypeOf<RegionDocument.TokenRoundEventData["round"]>().toBeNumber();
expectTypeOf<RegionDocument.TokenRoundEventData["skipped"]>().toBeBoolean();

export {};

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-empty-object-type */

type AdventureImportData = Adventure.ImportData;

type AdventureImportOptions = Adventure.ImportOptions;

type AdventureImportResult = Adventure.ImportResult;

type _ActiveEffectDuration = ActiveEffect.Duration;

type ActiveEffectDuration = ActiveEffect.DurationData & _ActiveEffectDuration;

type FolderChildNode = Folder.ChildNode;

type CombatHistoryData = Combat.HistoryData;

type CombatTurnEventContext = Combat.TurnEventContext;

type CombatRoundEventContext = Combat.RoundEventContext;

// TODO: Data extends object, pass generic to RegionDocument.RegionEvent once set up
type RegionEvent<Data> = RegionDocument.RegionEvent;

type RegionRegionBoundaryEvent = RegionEvent<{}>;

type RegionBehaviorActivatedEvent = RegionEvent<{}>;

type RegionBehaviorDeactivatedEvent = RegionEvent<{}>;

type RegionBehaviorViewedEvent = RegionEvent<{}>;

type RegionBehaviorUnviewedEvent = RegionEvent<{}>;

type RegionTokenEnterExitEventData = unknown;

type RegionTokenEnterExitEvent = RegionEvent<RegionTokenEnterExitEventData>;

type RegionTokenEnterEvent = RegionTokenEnterExitEvent;

type RegionTokenExitEvent = RegionTokenEnterExitEvent;

type RegionTokenMoveEventData = unknown;

type RegionTokenMoveEvent = RegionEvent<RegionTokenMoveEventData>;

type RegionTokenMoveInEvent = RegionTokenMoveEvent;

type RegionTokenMoveOutEvent = RegionTokenMoveEvent;

type RegionTokenMoveWithinEvent = RegionTokenMoveEvent;

type RegionTokenAnimateEventData = unknown;

type RegionTokenAnimateEvent = RegionEvent<RegionTokenAnimateEventData>;

type RegionTokenAnimateInEvent = RegionTokenAnimateEvent;

type RegionTokenAnimateOutEvent = RegionTokenAnimateEvent;

type RegionTokenTurnEventData = unknown;

type RegionTokenTurnEvent = RegionEvent<RegionTokenTurnEventData>;

type RegionTokenTurnStartEvent = RegionTokenTurnEvent;

type RegionTokenTurnEndEvent = RegionTokenTurnEvent;

type RegionTokenRoundEventData = unknown;

type RegionTokenRoundEvent = RegionEvent<RegionTokenRoundEventData>;

type RegionTokenRoundStartEvent = RegionTokenRoundEvent;

type RegionTokenRoundEndEvent = RegionTokenRoundEvent;

type RegionMovementSegment = foundry.canvas.placeables.Region.MovementSegment;

type RegionSegmentizeMovementPathWaypoint = RegionDocument.SegmentizeMovementPathWaypoint;

type RollTableDraw = RollTable.Draw;

type SceneDimensions = Scene.Dimensions;

type TrackedAttributesDescription = TokenDocument.TrackedAttributesDescription;

type TokenMeasuredMovementWaypoint = TokenDocument.MeasuredMovementWaypoint;

type TokenMovementWaypoint = TokenDocument.MovementWaypoint;

type TokenMovementSegmentData = TokenDocument.MovementSegmentData;

type TokenMeasureMovementPathWaypoint = unknown;

type TokenMeasureMovementPathOptions = foundry.canvas.placeables.Token.MeasureMovementPathOptions;

type TokenMovementCostFunction = TokenDocument.MovementCostFunction;

type TokenMovementCostAggregator = TokenDocument.MovementCostAggregator;

type TokenGetCompleteMovementPathWaypoint = TokenDocument.GetCompleteMovementPathWaypoint;

type TokenCompleteMovementWaypoint = TokenDocument.CompleteMovementWaypoint;

type TokenSegmentizeMovementWaypoint = TokenDocument.SegmentizeMovementWaypoint;

type TokenRegionMovementWaypoint = unknown;

type TokenRegionMovementSegment = unknown;

type TokenMovementSectionData = TokenDocument.MovementSectionData;

type TokenMovementHistoryData = TokenDocument.MovementHistoryData;

type TokenMovementMethod = TokenDocument.MovementMethod;

type TokenMovementState = TokenDocument.MovementState;

type TokenMovementData = TokenDocument.MovementData;

type TokenMovementOperation = TokenDocument.MovementOperation;

type TokenMovementContinuationData = TokenDocument.MovementContinuationData;

type TokenMovementContinuationHandle = TokenDocument.MovementContinuationHandle;

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

type AdventurePreImportCallback = Adventure.PreImportCallback;

type AdventureImportOptions = Adventure.ImportOptions;

type AdventureImportResult = Adventure.ImportResult;

type AdventurePostImportCallback = Adventure.PostImportCallback;

type _ActiveEffectChangeData = ActiveEffect.ChangeData;

type ActiveEffectChangeData = ActiveEffect.ChangeData;

type ActiveEffectChangeRenderer = ActiveEffect.ChangeRenderer;

type ActiveEffectChangeHandler = ActiveEffect.ChangeHandler;

type _ActiveEffectDuration = ActiveEffect.Duration;

type ActiveEffectDuration = ActiveEffect.Duration;

type FolderChildNode = Folder.ChildNode;

type CombatHistoryData = Combat.HistoryData;

type CombatTurnEventContext = Combat.TurnEventContext;

type CombatRoundEventContext = Combat.RoundEventContext;

// TODO: Data extends object, pass generic to RegionDocument.RegionEvent once set up
type RegionEvent<Data> = RegionDocument.RegionEvent;

type RegionRegionBoundaryEvent = RegionEvent<{}>;

type RegionRegionAnimationEvent = RegionEvent<{}>;

type RegionBehaviorActivatedEvent = RegionEvent<{}>;

type RegionBehaviorDeactivatedEvent = RegionEvent<{}>;

type RegionBehaviorViewedEvent = RegionEvent<{}>;

type RegionBehaviorUnviewedEvent = RegionEvent<{}>;

type RegionTokenEnterExitEventData = RegionDocument.TokenEnterExitEventData;

type RegionTokenEnterExitEvent = RegionEvent<RegionTokenEnterExitEventData>;

type RegionTokenEnterEvent = RegionTokenEnterExitEvent;

type RegionTokenExitEvent = RegionTokenEnterExitEvent;

type RegionTokenMoveEventData = RegionDocument.TokenMoveEventData;

type RegionTokenMoveEvent = RegionEvent<RegionTokenMoveEventData>;

type RegionTokenMoveInEvent = RegionTokenMoveEvent;

type RegionTokenMoveOutEvent = RegionTokenMoveEvent;

type RegionTokenMoveWithinEvent = RegionTokenMoveEvent;

type RegionTokenAnimateEventData = RegionDocument.TokenAnimateEventData;

type RegionTokenAnimateEvent = RegionEvent<RegionTokenAnimateEventData>;

type RegionTokenAnimateInEvent = RegionTokenAnimateEvent;

type RegionTokenAnimateOutEvent = RegionTokenAnimateEvent;

type RegionTokenTurnEventData = RegionDocument.TokenTurnEventData;

type RegionTokenTurnEvent = RegionEvent<RegionTokenTurnEventData>;

type RegionTokenTurnStartEvent = RegionTokenTurnEvent;

type RegionTokenTurnEndEvent = RegionTokenTurnEvent;

type RegionTokenRoundEventData = RegionDocument.TokenRoundEventData;

type RegionTokenRoundEvent = RegionEvent<RegionTokenRoundEventData>;

type RegionTokenRoundStartEvent = RegionTokenRoundEvent;

type RegionTokenRoundEndEvent = RegionTokenRoundEvent;

type RegionMovementSegment = RegionDocument.MovementSegment;

type RegionSegmentizeMovementPathWaypoint = RegionDocument.SegmentizeMovementPathWaypoint;

type RollTableDraw = RollTable.Draw;

type SceneDimensions = Scene.Dimensions;

type SceneViewOptions = Scene.ViewOptions;

type TrackedAttributesDescription = TokenDocument.TrackedAttributesDescription;

type TokenMovementWaypoint = TokenDocument.MovementWaypoint;

type _TokenProcessedMovementWaypoint = Pick<TokenDocument.ProcessedMovementWaypoint, "terrain" | "intermediate">;

type TokenProcessedMovementWaypoint = TokenDocument.ProcessedMovementWaypoint;

type _TokenMeasuredMovementWaypoint = Pick<
  TokenDocument.MeasuredMovementWaypoint,
  "userId" | "movementId" | "subpathId" | "cost"
>;

type TokenMeasuredMovementWaypoint = TokenDocument.MeasuredMovementWaypoint;

type TokenMovementSegmentData = TokenDocument.MovementSegmentData;

type TokenMeasurableMovementWaypointData = TokenDocument.MeasurableMovementWaypointData;

type TokenMeasurableMovementWaypoint = TokenDocument.MeasurableMovementWaypoint;

type TokenMovementCostFunction = TokenDocument.MovementCostFunction;

type TokenMovementCostAggregator = TokenDocument.MovementCostAggregator;

type TokenRegionMovementSegment = TokenDocument.RegionMovementSegment;

type TokenMovementSectionData = TokenDocument.MovementSectionData;

type TokenMovementHistoryData = TokenDocument.MovementHistoryData;

type TokenMovementMethod = TokenDocument.MovementMethod;

type TokenMovementState = TokenDocument.MovementState;

type TokenMovementData = TokenDocument.MovementData;

type TokenPreMovementOperation = TokenDocument.PreUpdateMovement;

type TokenMovementOperation = TokenDocument.MovementOperation;

type TokenMovementInstructionOptions = TokenDocument.MovementInstructionOptions;

type TokenMovementInstructionDestination = TokenDocument.MovementInstructionDestination;

type TokenMovementInstructionWaypoints = TokenDocument.MovementInstructionWaypoints;

type TokenMovementInstruction = TokenDocument.MovementInstruction;

type TokenResizingInstruction = TokenDocument.ResizingInstruction;

type TokenMovementOptions = TokenDocument.MovementOptions;

type TokenMovementContinuationData = TokenDocument.MovementContinuationData;

type TokenMovementContinuationHandle = TokenDocument.MovementContinuationHandle;

type TokenResumeMovementCallback = TokenDocument.ResumeMovementCallback;

type WallCategory = WallDocument.Category;

type RegionSurface = RegionDocument.Surface;
